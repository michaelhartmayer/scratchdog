export type CellType =
  | 'EMPTY'
  | 'VIRUS_R'
  | 'VIRUS_Y'
  | 'VIRUS_B'
  | 'PILL_R'
  | 'PILL_Y'
  | 'PILL_B';
export type PillColor = 'R' | 'Y' | 'B';
export type Orientation = 'HORIZONTAL' | 'VERTICAL';

export interface ActivePill {
  x: number; // Left/Top segment position
  y: number;
  color1: PillColor; // Left or Top segment
  color2: PillColor; // Right or Bottom segment
  orientation: Orientation;
}

export interface GameState {
  grid: CellType[][];
  score: number;
  level: number;
  speed: 'LOW' | 'MED' | 'HIGH';
  status: 'PLAYING' | 'PAUSED' | 'GAME_OVER' | 'VICTORY' | 'CASCADING';
  activePill: ActivePill | null;
  nextPill: { color1: PillColor; color2: PillColor } | null;
  virusCount: number;
}

// Spec 6.2: Gravity timing (frames between drops at 60fps)
const SPEED_TIMINGS = {
  LOW: 1000, // ~1 second per drop
  MED: 500, // ~0.5 seconds per drop
  HIGH: 250, // ~0.25 seconds per drop
};

export class DrMarioEngine {
  private _grid: CellType[][];
  private _score = 0;
  private _level = 0;
  private _speed: 'LOW' | 'MED' | 'HIGH' = 'LOW';
  private _status: 'PLAYING' | 'PAUSED' | 'GAME_OVER' | 'VICTORY' | 'CASCADING' = 'PLAYING';
  private _activePill: ActivePill | null = null;
  private _nextPill: { color1: PillColor; color2: PillColor } | null = null;
  private _virusCount = 0;
  private _dropTimer = 0;
  private _lockTimer = 0;
  private _cascadeTimer = 0;
  private _isLocking = false;
  private _pillsDropped = 0;

  public readonly WIDTH = 8;
  public readonly HEIGHT = 16;
  private readonly LOCK_DELAY = 300; // ms before pill locks

  constructor() {
    this._grid = Array.from({ length: this.HEIGHT }, () =>
      Array.from({ length: this.WIDTH }, () => 'EMPTY'),
    );
  }

  public get state(): GameState {
    return {
      grid: JSON.parse(JSON.stringify(this._grid)) as CellType[][],
      score: this._score,
      level: this._level,
      speed: this._speed,
      status: this._status,
      activePill: this._activePill ? { ...this._activePill } : null,
      nextPill: this._nextPill ? { ...this._nextPill } : null,
      virusCount: this._virusCount,
    };
  }

  // Test Helper: Set grid state directly
  public setGrid(grid: CellType[][]) {
    // Deep copy to ensure no reference issues
    this._grid = JSON.parse(JSON.stringify(grid)) as CellType[][];
  }

  // Test Helper: Set speed directly
  public setSpeed(speed: 'LOW' | 'MED' | 'HIGH') {
    this._speed = speed;
  }

  public initializeLevel(level: number, speed: 'LOW' | 'MED' | 'HIGH') {
    this._level = level;
    this._speed = speed;
    this._score = 0;
    this._status = 'PLAYING';
    this._pillsDropped = 0;
    this._grid = Array.from({ length: this.HEIGHT }, () =>
      Array.from({ length: this.WIDTH }, () => 'EMPTY'),
    );
    this._activePill = null;
    this._nextPill = null;
    this._dropTimer = 0;
    this._lockTimer = 0;
    this._isLocking = false;

    this.generateViruses();
    this._virusCount = this.countViruses();
    this.generateNextPill();
    this.spawnPill();
  }

  private generateViruses() {
    const virusCount = Math.min(4 * (this._level + 1), 84);
    let placed = 0;

    while (placed < virusCount) {
      let y = Math.floor(Math.random() * (this.HEIGHT - 4)) + 4;
      let x = Math.floor(Math.random() * this.WIDTH);

      let attempts = 0;
      while (
        this._grid[y][x] !== 'EMPTY' &&
        attempts < this.WIDTH * this.HEIGHT
      ) {
        x++;
        if (x >= this.WIDTH) {
          x = 0;
          y++;
          if (y >= this.HEIGHT) y = 4;
        }
        attempts++;
      }

      if (this._grid[y][x] !== 'EMPTY') break;

      const colorSeed = (virusCount - placed) % 4;
      let colorType: CellType;

      if (colorSeed === 0) colorType = 'VIRUS_Y';
      else if (colorSeed === 1) colorType = 'VIRUS_R';
      else if (colorSeed === 2) colorType = 'VIRUS_B';
      else {
        const types: CellType[] = ['VIRUS_Y', 'VIRUS_R', 'VIRUS_B'];
        colorType = types[Math.floor(Math.random() * types.length)];
      }

      if (
        x >= 2 &&
        this._grid[y][x - 1] === colorType &&
        this._grid[y][x - 2] === colorType
      ) {
        colorType = this.cycleVirusColor(colorType);
      }
      if (
        y >= 6 &&
        this._grid[y - 1][x] === colorType &&
        this._grid[y - 2][x] === colorType
      ) {
        colorType = this.cycleVirusColor(colorType);
      }
      if (
        x >= 2 &&
        this._grid[y][x - 1] === colorType &&
        this._grid[y][x - 2] === colorType
      ) {
        colorType = this.cycleVirusColor(colorType);
      }

      this._grid[y][x] = colorType;
      placed++;
    }
  }

  private cycleVirusColor(color: CellType): CellType {
    if (color === 'VIRUS_Y') return 'VIRUS_R';
    if (color === 'VIRUS_R') return 'VIRUS_B';
    return 'VIRUS_Y';
  }

  private randomPillColor(): PillColor {
    const colors: PillColor[] = ['R', 'Y', 'B'];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  private generateNextPill() {
    this._nextPill = {
      color1: this.randomPillColor(),
      color2: this.randomPillColor(),
    };
  }

  // Spec 3.4: Pills spawn at top center
  private spawnPill() {
    if (!this._nextPill) {
      this.generateNextPill();
    }

    const spawnX = 3; // Center of 8-wide grid (columns 3 and 4)
    const spawnY = 0;

    // Check if spawn position is blocked (Game Over condition - Spec 4.2)
    if (
      this._grid[spawnY][spawnX] !== 'EMPTY' ||
      this._grid[spawnY][spawnX + 1] !== 'EMPTY'
    ) {
      this._status = 'GAME_OVER';
      return;
    }

    if (this._nextPill) {
      this._activePill = {
        x: spawnX,
        y: spawnY,
        color1: this._nextPill.color1,
        color2: this._nextPill.color2,
        orientation: 'HORIZONTAL',
      };
    }

    this._dropTimer = 0;
    this._isLocking = false;
    this._lockTimer = 0;

    this.generateNextPill();
  }

  private countViruses(): number {
    let count = 0;
    for (let y = 0; y < this.HEIGHT; y++) {
      for (let x = 0; x < this.WIDTH; x++) {
        if (this._grid[y][x].startsWith('VIRUS_')) count++;
      }
    }
    return count;
  }

  private getDropInterval(): number {
    // Spec 3.3.2.2: Speed increases every 10 pills
    const speedBonus = Math.floor(this._pillsDropped / 10) * 50;
    return Math.max(100, SPEED_TIMINGS[this._speed] - speedBonus);
  }

  // Input handling
  public input(
    action:
      | 'LEFT'
      | 'RIGHT'
      | 'DOWN'
      | 'ROTATE_CW'
      | 'ROTATE_CCW'
      | 'HARD_DROP',
  ) {
    if (this._status !== 'PLAYING' || !this._activePill) return;

    switch (action) {
      case 'LEFT':
        this.movePill(-1, 0);
        break;
      case 'RIGHT':
        this.movePill(1, 0);
        break;
      case 'DOWN':
        this.movePill(0, 1);
        break;
      case 'ROTATE_CW':
        this.rotatePill(true);
        break;
      case 'ROTATE_CCW':
        this.rotatePill(false);
        break;
      case 'HARD_DROP':
        while (this.movePill(0, 1)) {
          /* drop until blocked */
        }
        this.lockPill();
        break;
    }
  }

  private movePill(dx: number, dy: number): boolean {
    if (!this._activePill) return false;

    const newX = this._activePill.x + dx;
    const newY = this._activePill.y + dy;

    if (this.canPlace(newX, newY, this._activePill.orientation)) {
      this._activePill.x = newX;
      this._activePill.y = newY;

      // Reset lock timer if moving horizontally while locking
      if (this._isLocking && dx !== 0) {
        this._lockTimer = 0;
      }
      // If moving down, reset locking state
      if (dy > 0) {
        this._isLocking = false;
        this._lockTimer = 0;
      }
      return true;
    }
    return false;
  }

  // Spec 3.1.2: Rotation
  private rotatePill(clockwise: boolean) {
    if (!this._activePill) return;

    const { x, y, orientation } = this._activePill;

    if (orientation === 'HORIZONTAL') {
      // Rotating to VERTICAL
      // Check if there's room above (standard rotation) or below
      if (this.canPlace(x, y, 'VERTICAL')) {
        this._activePill.orientation = 'VERTICAL';
        if (clockwise) {
          // CW: Right becomes Top, Left becomes Bottom
          [this._activePill.color1, this._activePill.color2] = [
            this._activePill.color2,
            this._activePill.color1,
          ];
        }
        // CCW: Left becomes Top, Right becomes Bottom (no swap needed)
      }
    } else {
      // Rotating to HORIZONTAL
      // Check if there's room to the right, or kick left
      if (this.canPlace(x, y, 'HORIZONTAL')) {
        this._activePill.orientation = 'HORIZONTAL';
        if (!clockwise) {
          // CCW: Top becomes Right, Bottom becomes Left
          [this._activePill.color1, this._activePill.color2] = [
            this._activePill.color2,
            this._activePill.color1,
          ];
        }
      } else if (x > 0 && this.canPlace(x - 1, y, 'HORIZONTAL')) {
        // Wall kick left
        this._activePill.x = x - 1;
        this._activePill.orientation = 'HORIZONTAL';
        if (!clockwise) {
          [this._activePill.color1, this._activePill.color2] = [
            this._activePill.color2,
            this._activePill.color1,
          ];
        }
      }
    }
  }

  private canPlace(x: number, y: number, orientation: Orientation): boolean {
    // Check first segment
    if (x < 0 || x >= this.WIDTH || y < 0 || y >= this.HEIGHT) return false;
    if (this._grid[y][x] !== 'EMPTY') return false;

    // Check second segment
    if (orientation === 'HORIZONTAL') {
      if (x + 1 >= this.WIDTH) return false;
      if (this._grid[y][x + 1] !== 'EMPTY') return false;
    } else {
      if (y + 1 >= this.HEIGHT) return false;
      if (this._grid[y + 1][x] !== 'EMPTY') return false;
    }

    return true;
  }

  private lockPill() {
    if (!this._activePill) return;

    const { x, y, color1, color2, orientation } = this._activePill;

    // Place pill on grid
    this._grid[y][x] = `PILL_${color1}` as CellType;
    if (orientation === 'HORIZONTAL') {
      this._grid[y][x + 1] = `PILL_${color2}` as CellType;
    } else {
      this._grid[y + 1][x] = `PILL_${color2}` as CellType;
    }

    this._activePill = null;
    this._pillsDropped++;

    // Check for matches
    this.checkAndClearMatches();
  }

  private checkAndClearMatches() {
    const toRemove = new Set<string>();

    // Check horizontal matches
    for (let y = 0; y < this.HEIGHT; y++) {
      for (let x = 0; x <= this.WIDTH - 4; x++) {
        const color = this.getMatchColor(this._grid[y][x]);
        if (
          color &&
          this.getMatchColor(this._grid[y][x + 1]) === color &&
          this.getMatchColor(this._grid[y][x + 2]) === color &&
          this.getMatchColor(this._grid[y][x + 3]) === color
        ) {
          for (let i = 0; i < 4; i++)
            toRemove.add(`${String(x + i)},${String(y)}`);
          // Extend if more matches
          for (
            let i = 4;
            x + i < this.WIDTH &&
            this.getMatchColor(this._grid[y][x + i]) === color;
            i++
          ) {
            toRemove.add(`${String(x + i)},${String(y)}`);
          }
        }
      }
    }

    // Check vertical matches
    for (let x = 0; x < this.WIDTH; x++) {
      for (let y = 0; y <= this.HEIGHT - 4; y++) {
        const color = this.getMatchColor(this._grid[y][x]);
        if (
          color &&
          this.getMatchColor(this._grid[y + 1][x]) === color &&
          this.getMatchColor(this._grid[y + 2][x]) === color &&
          this.getMatchColor(this._grid[y + 3][x]) === color
        ) {
          for (let i = 0; i < 4; i++)
            toRemove.add(`${String(x)},${String(y + i)}`);
          for (
            let i = 4;
            y + i < this.HEIGHT &&
            this.getMatchColor(this._grid[y + i][x]) === color;
            i++
          ) {
            toRemove.add(`${String(x)},${String(y + i)}`);
          }
        }
      }
    }

    if (toRemove.size > 0) {
      // Calculate score (Spec 5.1)
      let virusesCleared = 0;
      toRemove.forEach((pos) => {
        const [x, y] = pos.split(',').map(Number);
        if (this._grid[y][x].startsWith('VIRUS_')) virusesCleared++;
        this._grid[y][x] = 'EMPTY';
      });

      if (virusesCleared > 0) {
        const basePoints =
          this._speed === 'LOW' ? 100 : this._speed === 'MED' ? 200 : 300;
        const multiplier = 2 ** (virusesCleared - 1);
        this._score += basePoints * virusesCleared * multiplier;
      }

      // Update virus count
      this._virusCount = this.countViruses();
      if (this._virusCount === 0) {
        this._status = 'VICTORY';
        return;
      }

      // Start cascading instead of instant gravity
      this._status = 'CASCADING';
      this._cascadeTimer = 0;
      return;
    }

    // Spawn new pill
    this.spawnPill();
  }

  private getMatchColor(cell: CellType): string | null {
    if (cell === 'EMPTY') return null;
    // Extract color suffix (R, Y, B)
    return cell.split('_')[1] || null;
  }

  // Spec 6.2.3: Cascade fall speed (1 row per 250ms)
  private applyGravityStep(): boolean {
    let changed = false;
    // Iterate from bottom up
    for (let y = this.HEIGHT - 2; y >= 0; y--) {
      for (let x = 0; x < this.WIDTH; x++) {
        // If current is tile and below is EMPTY
        if (
          this._grid[y][x] !== 'EMPTY' &&
          !this._grid[y][x].startsWith('VIRUS_') && // Viruses don't fall
          this._grid[y + 1][x] === 'EMPTY'
        ) {
          this._grid[y + 1][x] = this._grid[y][x];
          this._grid[y][x] = 'EMPTY';
          changed = true;
        }
      }
    }
    return changed;
  }

  private checkMatchesAfterGravity(): boolean {
    const toRemove = new Set<string>();

    // Same matching logic
    for (let y = 0; y < this.HEIGHT; y++) {
      for (let x = 0; x <= this.WIDTH - 4; x++) {
        const color = this.getMatchColor(this._grid[y][x]);
        if (
          color &&
          this.getMatchColor(this._grid[y][x + 1]) === color &&
          this.getMatchColor(this._grid[y][x + 2]) === color &&
          this.getMatchColor(this._grid[y][x + 3]) === color
        ) {
          for (let i = 0; i < 4; i++)
            toRemove.add(`${String(x + i)},${String(y)}`);
        }
      }
    }

    for (let x = 0; x < this.WIDTH; x++) {
      for (let y = 0; y <= this.HEIGHT - 4; y++) {
        const color = this.getMatchColor(this._grid[y][x]);
        if (
          color &&
          this.getMatchColor(this._grid[y + 1][x]) === color &&
          this.getMatchColor(this._grid[y + 2][x]) === color &&
          this.getMatchColor(this._grid[y + 3][x]) === color
        ) {
          for (let i = 0; i < 4; i++)
            toRemove.add(`${String(x)},${String(y + i)}`);
        }
      }
    }

    if (toRemove.size > 0) {
      toRemove.forEach((pos) => {
        const [x, y] = pos.split(',').map(Number);
        if (this._grid[y][x].startsWith('VIRUS_')) {
          // Award points for viruses even in chain (base only, no chain bonus per Spec 3.2.2.1)
          const basePoints =
            this._speed === 'LOW' ? 100 : this._speed === 'MED' ? 200 : 300;
          this._score += basePoints;
        }
        this._grid[y][x] = 'EMPTY';
      });

      // Update virus count and check win
      this._virusCount = this.countViruses();
      if (this._virusCount === 0) {
        this._status = 'VICTORY';
        return true;
      }

      return true; // Return true to indicate matches were found
    }
    return false;
  }

  public tick(deltaMs: number) {
    if (this._status === 'CASCADING') {
      this._cascadeTimer += deltaMs;
      // 4 rows per second = 250ms per row (Spec 6.2.3)
      if (this._cascadeTimer >= 250) {
        this._cascadeTimer = 0;
        const moved = this.applyGravityStep();
        if (!moved) {
          // Gravity done, check for new matches
          const matchesFound = this.checkMatchesAfterGravity();
          if (matchesFound) {
            // If new matches found, they are cleared, keep cascading to let things fall into new empty space
            this._cascadeTimer = 0;
          } else {
            // No movement, no matches, sequence done
            if (this._status as string !== 'VICTORY') {
              this.spawnPill();
              this._status = 'PLAYING';
            }
          }
        }
      }
      return;
    }

    if (this._status !== 'PLAYING' || !this._activePill) return;

    this._dropTimer += deltaMs;

    const dropInterval = this.getDropInterval();

    if (this._dropTimer >= dropInterval) {
      this._dropTimer = 0;

      // Try to move down
      if (!this.movePill(0, 1)) {
        // Can't move down, start locking
        if (!this._isLocking) {
          this._isLocking = true;
          this._lockTimer = 0;
        }
      }
    }

    // Handle locking (Spec 3.5)
    if (this._isLocking) {
      this._lockTimer += deltaMs;
      if (this._lockTimer >= this.LOCK_DELAY) {
        this.lockPill();
      }
    }
  }
}

export type CellType =
  | 'EMPTY'
  | 'VIRUS_R'
  | 'VIRUS_Y'
  | 'VIRUS_B'
  | 'PILL_R'
  | 'PILL_Y'
  | 'PILL_B'
  | 'PILL_R_LEFT'
  | 'PILL_R_RIGHT'
  | 'PILL_R_TOP'
  | 'PILL_R_BOTTOM'
  | 'PILL_Y_LEFT'
  | 'PILL_Y_RIGHT'
  | 'PILL_Y_TOP'
  | 'PILL_Y_BOTTOM'
  | 'PILL_B_LEFT'
  | 'PILL_B_RIGHT'
  | 'PILL_B_TOP'
  | 'PILL_B_BOTTOM'
  | 'EXPLODE_R'
  | 'EXPLODE_Y'
  | 'EXPLODE_B';
export type PillColor = 'R' | 'Y' | 'B';
export type Orientation = 'HORIZONTAL' | 'VERTICAL';

import { audioManager } from '../audio/AudioManager';

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
  status:
  | 'PLAYING'
  | 'PAUSED'
  | 'GAME_OVER'
  | 'VICTORY'
  | 'FLASHING'
  | 'CASCADING'
  | 'WIN_ANIMATION';
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
  private _status:
    | 'PLAYING'
    | 'PAUSED'
    | 'GAME_OVER'
    | 'VICTORY'
    | 'FLASHING'
    | 'CASCADING'
    | 'WIN_ANIMATION' = 'PLAYING';
  private _activePill: ActivePill | null = null;
  private _nextPill: { color1: PillColor; color2: PillColor } | null = null;
  private _virusCount = 0;
  private _dropTimer = 0;
  private _lockTimer = 0;
  private _cascadeTimer = 0;
  private _flashTimer = 0;
  private _cellsToFlash = new Set<string>();
  private _isLocking = false;
  private _pillsDropped = 0;
  private _winAnimRow = -1;
  private _winAnimTimer = 0;
  private _winAnimCells = new Map<string, number>();

  // Spec 3.6.1: Flash duration = 16 frames at 60fps = ~267ms
  private readonly FLASH_DURATION = 267;

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

  // Test Helper: Set status directly
  public setStatus(
    status:
      | 'PLAYING'
      | 'PAUSED'
      | 'GAME_OVER'
      | 'VICTORY'
      | 'FLASHING'
      | 'CASCADING'
      | 'WIN_ANIMATION',
  ) {
    this._status = status;
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
        void audioManager.playSFX('rotation');
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
        void audioManager.playSFX('rotation');
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
        void audioManager.playSFX('rotation');
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

    // Place pill on grid with orientation-aware types
    if (orientation === 'HORIZONTAL') {
      this._grid[y][x] = `PILL_${color1}_LEFT` as CellType;
      this._grid[y][x + 1] = `PILL_${color2}_RIGHT` as CellType;
    } else {
      this._grid[y][x] = `PILL_${color1}_TOP` as CellType;
      this._grid[y + 1][x] = `PILL_${color2}_BOTTOM` as CellType;
    }

    this._activePill = null;
    this._pillsDropped++;

    void audioManager.playSFX('thud');

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
      // Spec 3.6.1/3.6.2: Convert matched cells to EXPLODE state (flash/starburst)
      let virusesCleared = 0;
      toRemove.forEach((pos) => {
        const [x, y] = pos.split(',').map(Number);
        const cell = this._grid[y][x];
        if (cell.startsWith('VIRUS_')) virusesCleared++;

        // Breaking logic: If we remove a segment, its neighbor might need to break
        if (cell.startsWith('PILL_')) {
          if (cell.endsWith('_LEFT')) {
            const right = this._grid[y][x + 1];
            if (
              right.endsWith('_RIGHT') &&
              !toRemove.has(`${String(x + 1)},${String(y)}`)
            ) {
              this._grid[y][x + 1] = right.replace('_RIGHT', '') as CellType;
            }
          } else if (cell.endsWith('_RIGHT')) {
            const left = this._grid[y][x - 1];
            if (
              left.endsWith('_LEFT') &&
              !toRemove.has(`${String(x - 1)},${String(y)}`)
            ) {
              this._grid[y][x - 1] = left.replace('_LEFT', '') as CellType;
            }
          } else if (cell.endsWith('_TOP')) {
            const bottom = this._grid[y + 1][x];
            if (
              bottom.endsWith('_BOTTOM') &&
              !toRemove.has(`${String(x)},${String(y + 1)}`)
            ) {
              this._grid[y + 1][x] = bottom.replace('_BOTTOM', '') as CellType;
            }
          } else if (cell.endsWith('_BOTTOM')) {
            const top = this._grid[y - 1][x];
            if (
              top.endsWith('_TOP') &&
              !toRemove.has(`${String(x)},${String(y - 1)}`)
            ) {
              this._grid[y - 1][x] = top.replace('_TOP', '') as CellType;
            }
          }
        }

        // Convert to explosion cell type
        const color = this.getMatchColor(cell);
        if (color) {
          this._grid[y][x] = `EXPLODE_${color}` as CellType;
        }
      });

      // Calculate score (Spec 5.1)
      if (virusesCleared > 0) {
        const basePoints =
          this._speed === 'LOW' ? 100 : this._speed === 'MED' ? 200 : 300;
        const multiplier = 2 ** (virusesCleared - 1);
        this._score += basePoints * virusesCleared * multiplier;
      }

      // Store cells to clear after flash animation
      this._cellsToFlash = toRemove;

      // Spec 3.6.1: Enter FLASHING state for 267ms before clearing
      this._status = 'FLASHING';
      this._flashTimer = 0;
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
  private isTraversable(x: number, y: number): boolean {
    if (y < 0 || y >= this.HEIGHT || x < 0 || x >= this.WIDTH) return false;
    const cell = this._grid[y][x];
    return cell === 'EMPTY' || cell.startsWith('EXPLODE_');
  }

  private applyGravityStep(): boolean {
    let changed = false;
    const processed = new Set<string>();

    // Iterate from bottom up
    for (let y = this.HEIGHT - 2; y >= 0; y--) {
      for (let x = 0; x < this.WIDTH; x++) {
        if (processed.has(`${String(x)},${String(y)}`)) continue;

        const cell = this._grid[y][x];
        if (
          cell === 'EMPTY' ||
          cell.startsWith('VIRUS_') ||
          cell.startsWith('EXPLODE_')
        )
          continue;

        // Handle Horizontal Pills
        if (cell.endsWith('_LEFT')) {
          const right = this._grid[y][x + 1];
          // If right partner is empty below AND left is empty below
          if (
            right.endsWith('_RIGHT') &&
            this.isTraversable(x, y + 1) &&
            this.isTraversable(x + 1, y + 1)
          ) {
            this._grid[y + 1][x] = cell;
            this._grid[y + 1][x + 1] = right;
            this._grid[y][x] = 'EMPTY';
            this._grid[y][x + 1] = 'EMPTY';
            processed.add(`${String(x)},${String(y)}`);
            processed.add(`${String(x + 1)},${String(y)}`);
            changed = true;
          }
        } else if (cell.endsWith('_TOP')) {
          // Handle Vertical Pills: Partner is at y+1.
          // Since we iterate bottom up, we'll see BOTTOM first?
          // No, we go y = HEIGHT-2 down to 0.
          // Row 15 is bottom. y=14 is HEIGHT-2.
          // If y=14 is TOP, y+1=15 is BOTTOM.
          // Wait, if it's a vertical pill, BOTTOM is below TOP.
          // If BOTTOM is at 15, it can't fall.
          // If BOTTOM is at 14, and 15 is EMPTY, it falls.
          // When BOTTOM falls, TOP at 13 falls too.
          // Actually, let's handle BOTTOM first in the loop.
        } else if (cell.endsWith('_BOTTOM')) {
          const top = this._grid[y - 1][x];
          if (top.endsWith('_TOP') && this.isTraversable(x, y + 1)) {
            this._grid[y + 1][x] = cell;
            this._grid[y][x] = top;
            this._grid[y - 1][x] = 'EMPTY';
            processed.add(`${String(x)},${String(y)}`);
            processed.add(`${String(x)},${String(y - 1)}`);
            changed = true;
          }
        } else if (
          !cell.endsWith('_LEFT') &&
          !cell.endsWith('_RIGHT') &&
          !cell.endsWith('_TOP') &&
          !cell.endsWith('_BOTTOM')
        ) {
          // Single independent segment
          if (this.isTraversable(x, y + 1)) {
            this._grid[y + 1][x] = cell;
            this._grid[y][x] = 'EMPTY';
            processed.add(`${String(x)},${String(y)}`);
            changed = true;
          }
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
      // Spec 3.6.7: Chained clears also use FLASHING animation
      let virusesClearedCount = 0;
      toRemove.forEach((pos) => {
        const [x, y] = pos.split(',').map(Number);
        const cell = this._grid[y][x];
        if (cell.startsWith('VIRUS_')) {
          virusesClearedCount++;
        }

        // Breaking logic: If we remove a segment, its neighbor might need to break
        if (cell.startsWith('PILL_')) {
          if (cell.endsWith('_LEFT')) {
            const right = this._grid[y][x + 1];
            if (
              right.endsWith('_RIGHT') &&
              !toRemove.has(`${String(x + 1)},${String(y)}`)
            ) {
              this._grid[y][x + 1] = right.replace('_RIGHT', '') as CellType;
            }
          } else if (cell.endsWith('_RIGHT')) {
            const left = this._grid[y][x - 1];
            if (
              left.endsWith('_LEFT') &&
              !toRemove.has(`${String(x - 1)},${String(y)}`)
            ) {
              this._grid[y][x - 1] = left.replace('_LEFT', '') as CellType;
            }
          } else if (cell.endsWith('_TOP')) {
            const bottom = this._grid[y + 1][x];
            if (
              bottom.endsWith('_BOTTOM') &&
              !toRemove.has(`${String(x)},${String(y + 1)}`)
            ) {
              this._grid[y + 1][x] = bottom.replace('_BOTTOM', '') as CellType;
            }
          } else if (cell.endsWith('_BOTTOM')) {
            const top = this._grid[y - 1][x];
            if (
              top.endsWith('_TOP') &&
              !toRemove.has(`${String(x)},${String(y - 1)}`)
            ) {
              this._grid[y - 1][x] = top.replace('_TOP', '') as CellType;
            }
          }
        }

        // Convert to explosion cell type
        const color = this.getMatchColor(cell);
        if (color) {
          this._grid[y][x] = `EXPLODE_${color}` as CellType;
        }
      });

      // Award points for viruses in chain (Spec 5.1/3.2.2)
      if (virusesClearedCount > 0) {
        const basePoints =
          this._speed === 'LOW' ? 100 : this._speed === 'MED' ? 200 : 300;
        const multiplier = 2 ** (virusesClearedCount - 1);
        this._score += basePoints * virusesClearedCount * multiplier;
      }

      // Store cells to clear after flash and enter FLASHING
      this._cellsToFlash = toRemove;
      this._status = 'FLASHING';
      this._flashTimer = 0;

      return true; // Return true to indicate matches were found
    }
    return false;
  }

  public tick(dtMs: number) {
    const deltaMs = Math.min(dtMs, 250); // Cap at 250ms (one cascade step) to allow progress during lag
    if (this._status === 'FLASHING') {
      this._flashTimer += deltaMs;
      if (this._flashTimer >= this.FLASH_DURATION) {
        this._cellsToFlash.forEach((pos) => {
          const [x, y] = pos.split(',').map(Number);
          this._grid[y][x] = 'EMPTY';
        });
        this._cellsToFlash.clear();

        this._virusCount = this.countViruses();
        if (this._virusCount === 0) {
          this._status = 'WIN_ANIMATION';
          this._winAnimRow = -1;
          this._winAnimTimer = 100;
          this._winAnimCells.clear();
        } else {
          this._status = 'CASCADING';
          this._cascadeTimer = 0;
        }

        void audioManager.playSFX('pop');
      }
    } else if (this._status === 'WIN_ANIMATION') {
      this._winAnimTimer += deltaMs;
      for (const [pos, ttl] of Array.from(this._winAnimCells.entries())) {
        const newTTL = ttl - deltaMs;
        if (newTTL <= 0) {
          const [x, y] = pos.split(',').map(Number);
          this._grid[y][x] = 'EMPTY';
          this._winAnimCells.delete(pos);
        } else {
          this._winAnimCells.set(pos, newTTL);
        }
      }
      if (this._winAnimTimer >= 100) {
        this._winAnimTimer = 0;
        this._winAnimRow++;
        if (this._winAnimRow < this.HEIGHT) {
          for (let x = 0; x < this.WIDTH; x++) {
            const cell = this._grid[this._winAnimRow][x];
            if (cell !== 'EMPTY') {
              const color = cell.split('_')[1] || 'R';
              this._grid[this._winAnimRow][x] = `EXPLODE_${color}` as CellType;
              this._winAnimCells.set(
                `${String(x)},${String(this._winAnimRow)}`,
                200,
              );
            }
          }
        } else if (this._winAnimCells.size === 0) {
          this._status = 'VICTORY';
        }
      }
    } else if (this._status === 'CASCADING') {
      this._cascadeTimer += deltaMs;
      if (this._cascadeTimer >= 250) {
        this._cascadeTimer = 0;
        const moved = this.applyGravityStep();
        if (!moved) {
          const matchesFound = this.checkMatchesAfterGravity();
          if (matchesFound) {
            this._cascadeTimer = 0;
          } else {
            const status = this._status as string;
            if (status !== 'VICTORY' && status !== 'WIN_ANIMATION') {
              this.spawnPill();
              this._status = 'PLAYING';
            }
          }
        }
      }
    } else if (this._status === 'PLAYING' && this._activePill) {
      this._dropTimer += deltaMs;
      const dropInterval = this.getDropInterval();
      if (this._dropTimer >= dropInterval) {
        this._dropTimer = 0;
        if (!this.movePill(0, 1)) {
          if (!this._isLocking) {
            this._isLocking = true;
            this._lockTimer = 0;
          }
        }
      }
      if (this._isLocking) {
        this._lockTimer += deltaMs;
        if (this._lockTimer >= this.LOCK_DELAY) {
          this.lockPill();
        }
      }
    }
  }
}

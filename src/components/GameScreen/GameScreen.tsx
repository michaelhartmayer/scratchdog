import { useRef, useState, useCallback, useEffect } from 'react';
import { Application, Text as PixiText, Container, Sprite, Texture, Assets, Graphics, ColorMatrixFilter } from 'pixi.js';
import { PauseMenu } from '../PauseMenu';
import { Text } from '../DesignSystem/Text';
import { useGameMusic } from '../../hooks/useGameMusic';
import { usePixiApp } from '../../hooks/usePixiApp';
import { useKeyboardInput } from '../../hooks/useKeyboardInput';
import { DrMarioEngine } from '../../game/DrMarioEngine';
import { createStarfield } from '../../effects/Starfield';
import { ART_ZOOM, ART_BLEND, ART_TINT, COMBO_MESSAGES } from '../../art-override';
import { useGameScreen } from '../../hooks/useGameScreen';
import { exposeE2EState } from '../../utils/env-utils';
import './GameScreen.css';

// Emoji mapping for cell types


const VIDEO_PATHS = {
  VIRUS_R: '/video-ref/red-dwarf.mp4',
  VIRUS_Y: '/video-ref/yellow-nebula.mp4',
  VIRUS_B: '/video-ref/blue-hole.mp4',
};

// Emoji mapping for pill colors (for active pill)
const PILL_IMAGES: Record<string, string> = {
  R: '/assets/gems/red.png',
  Y: '/assets/gems/yellow.png',
  B: '/assets/gems/blue.png',
};

const SPARKLE_IMAGES: Record<string, string> = {
  R: '/assets/gems/sparkle_green.png',
  Y: '/assets/gems/sparkle_gold.png',
  B: '/assets/gems/sparkle_blue.png',
};

interface GameScreenProps {
  onMainMenu: () => void;
  onGameOver?: () => void;
}

export const GameScreen = ({ onMainMenu, onGameOver }: GameScreenProps) => {
  const [paused, setPaused] = useState(false);
  const [score, setScore] = useState(0);
  const [virusCount, setVirusCount] = useState(0);
  const [fps, setFps] = useState(0);
  const pixiRootRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null); // Still used for positioning
  // Particle System State
  const particlesRef = useRef<{
    sprite: Sprite | Graphics;
    vx: number;
    vy: number;
    life: number;
    maxLife: number;
    rotSpeed: number;
  }[]>([]);
  const activeExplosionsRef = useRef<Set<string>>(new Set());
  const trailHistoryRef = useRef<{ x: number; y: number; color1: string; color2: string; orientation: string; alpha: number }[]>([]);

  const engineRef = useRef<DrMarioEngine>(new DrMarioEngine());
  const pausedRef = useRef(paused);
  useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);

  useGameScreen(paused, setPaused);
  const { fadeOutAndExecute } = useGameMusic();

  const handleMainMenu = () => {
    fadeOutAndExecute(onMainMenu);
  };

  const handleGameOver = useCallback(() => {
    if (onGameOver) {
      fadeOutAndExecute(onGameOver);
    }
  }, [onGameOver, fadeOutAndExecute]);

  // Keyboard input handler
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (paused) return;

      switch (e.key) {
        case 'ArrowLeft':
          engineRef.current.input('LEFT');
          break;
        case 'ArrowRight':
          engineRef.current.input('RIGHT');
          break;
        case 'ArrowDown':
          engineRef.current.input('DOWN');
          break;
        case 'ArrowUp':
        case ' ':
          engineRef.current.input('HARD_DROP');
          break;
        case 'z':
        case 'Z':
          engineRef.current.input('ROTATE_CCW');
          break;
        case 'x':
        case 'X':
          engineRef.current.input('ROTATE_CW');
          break;
      }
    },
    [paused],
  );

  useKeyboardInput(handleKeyDown, paused);

  const onInitPixi = useCallback(
    async (app: Application) => {
      // Preload Assets
      const [virusAssets] = await Promise.all([
        Assets.load(Object.values(VIDEO_PATHS)),
        Assets.load(Object.values(PILL_IMAGES)),
        Assets.load(Object.values(SPARKLE_IMAGES)),
      ]).catch((err) => {
        console.error('Asset load error:', err);
        return [{}]; // Fallback
      });

      // Enable Looping for Video Sources
      Object.values(virusAssets).forEach((asset) => {
        if (asset instanceof Texture && asset.source.resource instanceof HTMLVideoElement) {
          asset.source.resource.loop = true;
          asset.source.resource.muted = true;
          asset.source.resource.playbackRate = 0.5; // Slow down videos
        }
      });

      // 0. Initialize Starfield (V7 Optimized)
      const starfield = createStarfield(app, {
        width: window.innerWidth,
        height: window.innerHeight,
      });
      app.stage.addChildAt(starfield.container, 0);

      // Initialize Game Engine (Adjusted Difficulty)
      engineRef.current.initializeLevel(2, 'LOW');
      setScore(engineRef.current.state.score);
      setVirusCount(engineRef.current.state.virusCount);

      // 1. Create Glass Background for the bottle area
      const glassG = new Graphics();
      app.stage.addChildAt(glassG, 1);

      // Container for game elements (The Board)
      const boardContainer = new Container();
      boardContainer.sortableChildren = true;
      app.stage.addChildAt(boardContainer, 2);

      // Update function to align board with HTML bottle
      let lastRect = { x: 0, y: 0, w: 0, h: 0 };
      const alignBoard = () => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();

        // Optimized check
        if (
          Math.abs(rect.left - lastRect.x) < 0.1 &&
          Math.abs(rect.top - lastRect.y) < 0.1 &&
          Math.abs(rect.width - lastRect.w) < 0.1 &&
          Math.abs(rect.height - lastRect.h) < 0.1
        ) {
          return;
        }
        lastRect = { x: rect.left, y: rect.top, w: rect.width, h: rect.height };

        glassG.clear()
          .roundRect(rect.left - 8, rect.top - 8, rect.width + 16, rect.height + 16, 24)
          .fill({ color: 0xffffff, alpha: 0.05 })
          .stroke({ color: 0xffffff, alpha: 0.15, width: 2 });

        boardContainer.position.set(rect.left, rect.top);
        starfield.resize(window.innerWidth, window.innerHeight);
      };

      // Initial alignment
      alignBoard();

      // Trail Container (Behind Active Pill)
      const trailGraphics = new Graphics();
      boardContainer.addChild(trailGraphics);

      // Container for active pill
      const pillContainer = new Container();
      boardContainer.addChild(pillContainer);

      // Debug Graphics Layer (On top)
      const debugGraphics = new Graphics();
      boardContainer.addChild(debugGraphics);

      const CELL_SIZE = 40;

      // Grid visualization
      const sprites: (Sprite | Container | null)[][] = Array.from({ length: 16 }, () =>
        Array.from({ length: 8 }, (): (Sprite | Container | null) => null),
      );
      const cellTypes: (string | null)[][] = Array.from({ length: 16 }, () =>
        Array.from({ length: 8 }, (): string | null => null),
      );

      // Active Pill Sprites (Reuse)
      let activePillSprite1: Sprite | null = null;
      let activePillSprite2: Sprite | null = null;

      const shimmerFilter = new ColorMatrixFilter();
      let shimmerTime = 0;

      let frameCount = 0;
      let lastFpsUpdate = performance.now();

      // Combo Text Overlay
      const comboText = new PixiText({
        text: '',
        style: {
          fontFamily: 'Arial Black', // Thicker font
          fontSize: 48,
          fontWeight: '900',
          fill: 0xffd700, // Gold default
          stroke: { color: 0x4a1850, width: 8, join: 'round' }, // Deep purple stroke
          dropShadow: {
            color: 0x000000,
            blur: 4,
            angle: Math.PI / 6,
            distance: 6,
          },
          align: 'center',
        },
      });
      comboText.anchor.set(0.5);
      comboText.position.set(CELL_SIZE * 4, CELL_SIZE * 8); // Middle of board
      comboText.zIndex = 1000; // Render on top
      comboText.visible = false;
      boardContainer.addChild(comboText);

      // Animation State
      const comboAnim = {
        active: false,
        timer: 0,
        phase: 'POP', // 'POP', 'WAIT', 'DISPERSE'
      };
      let lastComboCount = 0;
      let lastCascadeCount = 0;

      app.ticker.add(() => {
        const now = performance.now();
        frameCount++;
        if (now - lastFpsUpdate > 1000) {
          setFps(Math.round((frameCount * 1000) / (now - lastFpsUpdate)));
          frameCount = 0;
          lastFpsUpdate = now;
        }

        const deltaMs = app.ticker.deltaMS;
        const deltaSec = deltaMs / 1000;

        // Sync board position
        alignBoard();

        // --- Combo Logic ---
        const currentCombo = engineRef.current.state.comboCount;
        const currentCascade = engineRef.current.state.cascadeCount;

        // Trigger if combo count increased OR if chain step occurred (even if only pills cleared)
        if (
          (currentCombo > lastComboCount || currentCascade > lastCascadeCount) &&
          currentCombo >= 2
        ) {
          // Find matching config (High to Low, robust sort)
          const config = [...COMBO_MESSAGES]
            .sort((a, b) => b.threshold - a.threshold)
            .find((c) => currentCombo >= c.threshold);
          if (config) {
            comboText.text = config.text;
            comboText.style.fill = config.color;
            comboText.visible = true;

            // Reset Animation
            comboAnim.active = true;
            comboAnim.timer = 0;
            comboAnim.phase = 'POP';
          }
        }
        lastComboCount = currentCombo;
        lastCascadeCount = currentCascade;

        if (comboAnim.active) {
          comboAnim.timer += deltaSec;

          if (comboAnim.phase === 'POP') {
            // Elastic Pop Effect
            const dur = 0.4;
            const t = Math.min(1, comboAnim.timer / dur);

            // Elastic Out Ease
            const c4 = (2 * Math.PI) / 3;
            const ease = t === 0 ? 0 : t === 1 ? 1 : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;

            comboText.scale.set(ease * 1.5); // Scale to 1.5
            comboText.alpha = 1;

            if (t >= 1) {
              comboAnim.phase = 'WAIT';
              comboAnim.timer = 0;
            }
          } else if (comboAnim.phase === 'WAIT') {
            // Brief hold
            if (comboAnim.timer > 0.4) {
              comboAnim.phase = 'DISPERSE';
              comboAnim.timer = 0;
            }
          } else if (comboAnim.phase === 'DISPERSE') {
            // Fade and Expand
            const dur = 0.3;
            const t = Math.min(1, comboAnim.timer / dur);

            comboText.alpha = 1 - t;
            comboText.scale.set(1.5 + t * 1.0); // Expand from 1.5 to 2.5

            if (t >= 1) {
              comboAnim.active = false;
              comboText.visible = false;
            }
          }
        }
        // -------------------

        // Starfield update
        starfield.update(deltaMs);

        // Debug Box Update
        debugGraphics.clear();

        // Animate Shimmer (Bright Pulse)
        shimmerTime += 0.1;
        const brightness = 1.2 + Math.sin(shimmerTime) * 0.3; // Pulse between 0.9 and 1.5
        shimmerFilter.brightness(brightness, false);

        // Update Particles
        for (let i = particlesRef.current.length - 1; i >= 0; i--) {
          const p = particlesRef.current[i];
          p.life -= deltaSec;
          p.sprite.x += p.vx * deltaSec * 60;
          p.sprite.y += p.vy * deltaSec * 60;
          p.sprite.rotation += p.rotSpeed * deltaSec;
          p.sprite.alpha = p.life / p.maxLife;
          // Scale effect for bursts
          if (p.sprite instanceof Sprite && (p.sprite as any).isBurst) {
            const progress = 1 - (p.life / p.maxLife);
            p.sprite.scale.set(0.2 + progress * 0.4); // Grow from 0.2 to 0.6
          }

          if (p.life <= 0) {
            boardContainer.removeChild(p.sprite);
            particlesRef.current.splice(i, 1);
          }
        }

        if (!pausedRef.current) {
          engineRef.current.tick(deltaMs);

          const state = engineRef.current.state;
          setScore(state.score);
          setVirusCount(state.virusCount);
          exposeE2EState('DRMARIO_STATE', state);
          exposeE2EState('DRMARIO_ENGINE', engineRef.current);

          if (state.status === 'GAME_OVER' && onGameOver) {
            handleGameOver();
          }

          // Update Grid Sprites
          state.grid.forEach((row, y) => {
            row.forEach((cell, x) => {
              const videoUrl = VIDEO_PATHS[cell as keyof typeof VIDEO_PATHS];
              const existingSprite = sprites[y][x];
              const existingCellType = cellTypes[y][x];
              const cellTypeChanged = existingCellType !== null && existingCellType !== cell;

              // --- 1. HANDLE EXPLOSIONS (Particles) ---
              if (cell.startsWith('EXPLODE_')) {
                const colorKey = cell.split('_')[1];
                const sparkleImage = SPARKLE_IMAGES[colorKey];
                const key = `${x},${y}`;

                if (!activeExplosionsRef.current.has(key) && sparkleImage) {
                  activeExplosionsRef.current.add(key);

                  // 1. Spawn Main Burst
                  const texture = Texture.from(sparkleImage);
                  const burst = new Sprite(texture);
                  burst.anchor.set(0.5);
                  burst.x = x * CELL_SIZE + CELL_SIZE / 2;
                  burst.y = y * CELL_SIZE + CELL_SIZE / 2;
                  burst.blendMode = 'add';
                  burst.scale.set(0.2); // Start tiny

                  // Force Red tint for Red explosions (using Gold asset fallback)
                  if (colorKey === 'R') {
                    burst.tint = 0xff0000;
                  }

                  (burst as any).isBurst = true;
                  boardContainer.addChild(burst);

                  particlesRef.current.push({
                    sprite: burst,
                    vx: 0,
                    vy: 0,
                    life: 0.4, // Short life
                    maxLife: 0.4,
                    rotSpeed: Math.random() * 2 - 1
                  });

                  // 2. Spawn Mini Particles
                  const particleColor = colorKey === 'R' ? 0xff0000 : (colorKey === 'Y' ? 0xffd700 : 0x00ffff); // Red, Gold, Neon Blue
                  for (let i = 0; i < 6; i++) { // Fewer particles
                    const dot = new Graphics().circle(0, 0, 1 + Math.random() * 1.5).fill({ color: particleColor }); // Tiny dots
                    dot.x = x * CELL_SIZE + CELL_SIZE / 2;
                    dot.y = y * CELL_SIZE + CELL_SIZE / 2;
                    boardContainer.addChild(dot);

                    const angle = Math.random() * Math.PI * 2;
                    const speed = 0.5 + Math.random() * 1; // Very slow, contained

                    particlesRef.current.push({
                      sprite: dot,
                      vx: Math.cos(angle) * speed,
                      vy: Math.sin(angle) * speed,
                      life: 0.4 + Math.random() * 0.2, // Short life
                      maxLife: 0.6,
                      rotSpeed: 0
                    });
                  }
                }

                if (existingSprite) {
                  boardContainer.removeChild(existingSprite);
                  sprites[y][x] = null;
                }
              } else {
                activeExplosionsRef.current.delete(`${x},${y}`);
              }

              // --- 3. PRE-CALC PILL ART ---
              let pillColor: string | null = null;
              if (cell.startsWith('PILL_')) {
                pillColor = cell.split('_')[1];
              }
              const gemImage = pillColor ? PILL_IMAGES[pillColor] : null;

              // --- 2. HANDLE VIRUS VIDEOS ---
              if (videoUrl) {
                if (existingSprite && (cellTypeChanged || !(existingSprite instanceof Container && (existingSprite as any).isVideo))) {
                  boardContainer.removeChild(existingSprite);
                  sprites[y][x] = null;
                  cellTypes[y][x] = null;
                }

                if (!sprites[y][x]) {
                  const texture = Texture.from(videoUrl);
                  const zoom = ART_ZOOM[cell as keyof typeof ART_ZOOM] || 1.0;
                  const blend = ART_BLEND[cell as keyof typeof ART_BLEND] || 'screen';
                  const sprite = new Sprite(texture);
                  sprite.width = CELL_SIZE * zoom;
                  sprite.height = CELL_SIZE * zoom;
                  sprite.anchor.set(0.5);
                  sprite.x = 0;
                  sprite.y = 0;
                  sprite.blendMode = blend as any;

                  // Apply tint from configuration
                  const tint = ART_TINT[cell as keyof typeof ART_TINT];
                  if (tint !== undefined) {
                    sprite.tint = tint;
                  }

                  const container = new Container();
                  const mask = new Graphics().rect(-CELL_SIZE / 2, -CELL_SIZE / 2, CELL_SIZE, CELL_SIZE).fill(0xffffff);
                  container.mask = mask;
                  container.addChild(mask);
                  container.addChild(sprite);
                  container.position.set(x * CELL_SIZE + CELL_SIZE / 2, y * CELL_SIZE + CELL_SIZE / 2);
                  (container as any).isVideo = true;
                  boardContainer.addChild(container);
                  sprites[y][x] = container;
                  cellTypes[y][x] = cell;
                }
              } else if (gemImage) {
                if (existingSprite && (cellTypeChanged || !(existingSprite instanceof Container && !(existingSprite as any).isVideo))) {
                  boardContainer.removeChild(existingSprite);
                  sprites[y][x] = null;
                  cellTypes[y][x] = null;
                }

                if (!sprites[y][x]) {
                  const texture = Texture.from(gemImage);
                  const zoom = ART_ZOOM[`PILL_${pillColor}`] || 1.0;
                  const blend = ART_BLEND[`PILL_${pillColor}`] || 'add';
                  const sprite = new Sprite(texture);
                  sprite.width = CELL_SIZE * zoom;
                  sprite.height = CELL_SIZE * zoom;
                  sprite.anchor.set(0.5);
                  sprite.x = 0;
                  sprite.y = 0;
                  sprite.filters = [shimmerFilter];

                  const container = new Container();
                  const mask = new Graphics().rect(-CELL_SIZE / 2, -CELL_SIZE / 2, CELL_SIZE, CELL_SIZE).fill(0xffffff);
                  container.mask = mask;
                  container.addChild(mask);
                  container.addChild(sprite);
                  container.position.set(x * CELL_SIZE + CELL_SIZE / 2, y * CELL_SIZE + CELL_SIZE / 2);
                  container.blendMode = blend as any;
                  boardContainer.addChild(container);
                  sprites[y][x] = container;
                  cellTypes[y][x] = cell;
                }
              } else {
                // --- 4. CLEANUP / DEFAULT ---
                if (existingSprite) {
                  boardContainer.removeChild(existingSprite);
                  sprites[y][x] = null;
                  cellTypes[y][x] = null;
                }
              }

              /*
              // Debug Box for Grid Items
              if (cell !== 'EMPTY') {
                debugGraphics.rect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE)
                  .stroke({ color: 0x00ff00, width: 1, alpha: 0.8 });
              }
              */
            });
          });

          // Render Active Pill & Trail
          const pill = state.activePill;
          trailGraphics.clear();

          if (pill) {
            // Update History
            const last = trailHistoryRef.current[trailHistoryRef.current.length - 1];
            if (!last || last.x !== pill.x || last.y !== pill.y) {
              trailHistoryRef.current.push({
                x: pill.x, y: pill.y, color1: pill.color1, color2: pill.color2, orientation: pill.orientation, alpha: 0.6 // Start alpha
              });
              if (trailHistoryRef.current.length > 8) trailHistoryRef.current.shift();
            }

            // Draw Trail
            trailHistoryRef.current.forEach((t) => {
              t.alpha -= 0.02; // Fade out
              const color1 = t.color1 === 'R' ? 0xff0000 : (t.color1 === 'Y' ? 0xffff00 : 0x0000ff);
              const color2 = t.color2 === 'R' ? 0xff0000 : (t.color2 === 'Y' ? 0xffff00 : 0x0000ff);

              trailGraphics.rect(t.x * CELL_SIZE + 4, t.y * CELL_SIZE + 4, CELL_SIZE - 8, CELL_SIZE - 8).fill({ color: color1, alpha: Math.max(0, t.alpha) });
              if (t.orientation === 'HORIZONTAL') {
                trailGraphics.rect((t.x + 1) * CELL_SIZE + 4, t.y * CELL_SIZE + 4, CELL_SIZE - 8, CELL_SIZE - 8).fill({ color: color2, alpha: Math.max(0, t.alpha) });
              } else {
                trailGraphics.rect(t.x * CELL_SIZE + 4, (t.y + 1) * CELL_SIZE + 4, CELL_SIZE - 8, CELL_SIZE - 8).fill({ color: color2, alpha: Math.max(0, t.alpha) });
              }
            });
            // Cleanup faded trail points
            trailHistoryRef.current = trailHistoryRef.current.filter(t => t.alpha > 0);

            // Active Pill Sprites
            if (!activePillSprite1) {
              const mask = new Graphics().rect(-CELL_SIZE / 2, -CELL_SIZE / 2, CELL_SIZE, CELL_SIZE).fill(0xffffff);
              const container = new Container();
              container.mask = mask;
              container.addChild(mask);

              const sprite = new Sprite(Texture.from(PILL_IMAGES[pill.color1]));
              sprite.anchor.set(0.5);
              sprite.filters = [shimmerFilter];
              container.addChild(sprite);
              container.blendMode = (ART_BLEND[`PILL_${pill.color1}`] || 'add') as any;

              activePillSprite1 = sprite;
              (activePillSprite1 as any).parentContainer = container;
              pillContainer.addChild(container);
            }
            if (!activePillSprite2) {
              const mask = new Graphics().rect(-CELL_SIZE / 2, -CELL_SIZE / 2, CELL_SIZE, CELL_SIZE).fill(0xffffff);
              const container = new Container();
              container.mask = mask;
              container.addChild(mask);

              const sprite = new Sprite(Texture.from(PILL_IMAGES[pill.color2]));
              sprite.anchor.set(0.5);
              sprite.filters = [shimmerFilter];
              container.addChild(sprite);
              container.blendMode = (ART_BLEND[`PILL_${pill.color2}`] || 'add') as any;

              activePillSprite2 = sprite;
              (activePillSprite2 as any).parentContainer = container;
              pillContainer.addChild(container);
            }

            const zoom1 = ART_ZOOM[`PILL_${pill.color1}`] || 1.0;
            const zoom2 = ART_ZOOM[`PILL_${pill.color2}`] || 1.0;

            activePillSprite1.texture = Texture.from(PILL_IMAGES[pill.color1]);
            activePillSprite1.width = CELL_SIZE * zoom1;
            activePillSprite1.height = CELL_SIZE * zoom1;
            activePillSprite1.x = 0; // Relative to container center
            activePillSprite1.y = 0;
            (activePillSprite1 as any).parentContainer.position.set(pill.x * CELL_SIZE + CELL_SIZE / 2, pill.y * CELL_SIZE + CELL_SIZE / 2);
            (activePillSprite1 as any).parentContainer.blendMode = (ART_BLEND[`PILL_${pill.color1}`] || 'add') as any;

            if (pill.orientation === 'HORIZONTAL') {
              activePillSprite2.texture = Texture.from(PILL_IMAGES[pill.color2]);
              activePillSprite2.width = CELL_SIZE * zoom2;
              activePillSprite2.height = CELL_SIZE * zoom2;
              activePillSprite2.x = 0;
              activePillSprite2.y = 0;
              (activePillSprite2 as any).parentContainer.position.set((pill.x + 1) * CELL_SIZE + CELL_SIZE / 2, pill.y * CELL_SIZE + CELL_SIZE / 2);
              (activePillSprite2 as any).parentContainer.blendMode = (ART_BLEND[`PILL_${pill.color2}`] || 'add') as any;
            } else {
              activePillSprite2.texture = Texture.from(PILL_IMAGES[pill.color2]);
              activePillSprite2.width = CELL_SIZE * zoom2;
              activePillSprite2.height = CELL_SIZE * zoom2;
              activePillSprite2.x = 0;
              activePillSprite2.y = 0;
              (activePillSprite2 as any).parentContainer.position.set(pill.x * CELL_SIZE + CELL_SIZE / 2, (pill.y + 1) * CELL_SIZE + CELL_SIZE / 2);
              (activePillSprite2 as any).parentContainer.blendMode = (ART_BLEND[`PILL_${pill.color2}`] || 'add') as any;
            }

            /*
            // Debug Boxes for Active Pill
            debugGraphics.rect(pill.x * CELL_SIZE, pill.y * CELL_SIZE, CELL_SIZE, CELL_SIZE)
              .stroke({ color: 0x00ff00, width: 1, alpha: 0.8 });
            if (pill.orientation === 'HORIZONTAL') {
              debugGraphics.rect((pill.x + 1) * CELL_SIZE, pill.y * CELL_SIZE, CELL_SIZE, CELL_SIZE)
                .stroke({ color: 0x00ff00, width: 1, alpha: 0.8 });
            } else {
              debugGraphics.rect(pill.x * CELL_SIZE, (pill.y + 1) * CELL_SIZE, CELL_SIZE, CELL_SIZE)
                .stroke({ color: 0x00ff00, width: 1, alpha: 0.8 });
            }
            */
          } else {
            // Cleanup if no active pill
            if (activePillSprite1) { pillContainer.removeChild((activePillSprite1 as any).parentContainer); activePillSprite1 = null; }
            if (activePillSprite2) { pillContainer.removeChild((activePillSprite2 as any).parentContainer); activePillSprite2 = null; }
            // Fade remaining trail
            trailHistoryRef.current.forEach((t) => t.alpha -= 0.05);
            trailHistoryRef.current.forEach((t) => {
              const color1 = t.color1 === 'R' ? 0xff0000 : (t.color1 === 'Y' ? 0xffff00 : 0x0000ff);
              const color2 = t.color2 === 'R' ? 0xff0000 : (t.color2 === 'Y' ? 0xffff00 : 0x0000ff);

              trailGraphics.rect(t.x * CELL_SIZE + 4, t.y * CELL_SIZE + 4, CELL_SIZE - 8, CELL_SIZE - 8).fill({ color: color1, alpha: Math.max(0, t.alpha) });
              if (t.orientation === 'HORIZONTAL') {
                trailGraphics.rect((t.x + 1) * CELL_SIZE + 4, t.y * CELL_SIZE + 4, CELL_SIZE - 8, CELL_SIZE - 8).fill({ color: color2, alpha: Math.max(0, t.alpha) });
              } else {
                trailGraphics.rect(t.x * CELL_SIZE + 4, (t.y + 1) * CELL_SIZE + 4, CELL_SIZE - 8, CELL_SIZE - 8).fill({ color: color2, alpha: Math.max(0, t.alpha) });
              }
            });
            trailHistoryRef.current = trailHistoryRef.current.filter(t => t.alpha > 0);
          }
        }
      });
    },
    [onGameOver, handleGameOver],
  );

  usePixiApp({
    containerRef: pixiRootRef,
    onInit: onInitPixi,
    options: {
      width: window.innerWidth,
      height: window.innerHeight,
      backgroundAlpha: 1, // Solid base
    },
  });

  return (
    <div className="game-screen fade-in" data-testid="game-screen" style={{ position: 'relative', overflow: 'hidden' }}>
      <div
        ref={pixiRootRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 0,
          pointerEvents: 'none',
        }}
      />

      <div
        className="hud"
        style={{
          position: 'absolute',
          top: '20px',
          zIndex: 10,
          color: 'white',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
          maxWidth: '400px',
          padding: '0 20px',
        }}
      >
        <div className="glass-panel" style={{ padding: '10px 15px' }}>
          <div style={{ marginBottom: '4px' }}>
            <Text variant="overline">SCORE</Text>
          </div>
          <Text variant="heading">{score}</Text>
        </div>



        <div
          className="glass-panel"
          style={{ padding: '10px 15px', textAlign: 'right' }}
        >
          <div style={{ marginBottom: '4px' }}>
            <Text variant="overline">VIRUSES:</Text>
          </div>
          <Text variant="heading">{virusCount}</Text>
        </div>
      </div>

      <div id="pill-bottle" style={{ zIndex: 5 }}>
        <div id="bottle-neck" />
        <div
          ref={containerRef}
          className="game-center"
          style={{
            width: '320px',
            height: '640px',
            borderRadius: '12px',
            overflow: 'visible',
            backgroundColor: 'transparent',
            position: 'relative',
          }}
        />
      </div>

      {paused && (
        <PauseMenu
          onResume={() => {
            setPaused(false);
          }}
          onSave={() => {
            console.log('Saved');
          }}
          onMainMenu={handleMainMenu}
        />
      )}

      {/* FPS Meter - Small, Neon Green, Unobtrusive */}
      <div
        style={{
          position: 'fixed',
          top: '10px',
          right: '15px',
          color: '#39FF14', // Neon Green
          fontFamily: 'monospace',
          fontSize: '12px',
          fontWeight: 'bold',
          textShadow: '0 0 5px rgba(57, 255, 20, 0.5)',
          zIndex: 1000,
          pointerEvents: 'none',
          opacity: 0.8,
        }}
      >
        FPS: {fps}
      </div>
    </div>
  );
};

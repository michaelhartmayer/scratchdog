import { useRef, useState, useCallback } from 'react';
import { Application, Text, Container } from 'pixi.js';
import { PauseMenu } from '../PauseMenu';
import { useGameScreen } from '../../hooks/useGameScreen';
import { usePixiApp } from '../../hooks/usePixiApp';
import { useKeyboardInput } from '../../hooks/useKeyboardInput';
import { DrMarioEngine, CellType } from '../../game/DrMarioEngine';
import { exposeE2EState } from '../../utils/env-utils';
import './GameScreen.css';

// Emoji mapping for cell types
const CELL_EMOJI: Record<CellType, string> = {
  EMPTY: '',
  VIRUS_R: '👹',
  VIRUS_Y: '👻',
  VIRUS_B: '👾',
  PILL_R: '🔴',
  PILL_Y: '🟡',
  PILL_B: '🔵',
  EXPLODE_R: '💥',
  EXPLODE_Y: '💥',
  EXPLODE_B: '💥',
};

// Emoji mapping for pill colors (for active pill)
const PILL_COLOR_EMOJI: Record<string, string> = {
  R: '🔴',
  Y: '🟡',
  B: '🔵',
};

interface GameScreenProps {
  onMainMenu: () => void;
  onGameOver?: () => void;
}

export const GameScreen = ({ onMainMenu, onGameOver }: GameScreenProps) => {
  const [paused, setPaused] = useState(false);
  const [score, setScore] = useState(0);
  const [virusCount, setVirusCount] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<DrMarioEngine>(new DrMarioEngine());

  useGameScreen(setPaused);

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
    (app: Application) => {
      // Initialize Game Engine
      engineRef.current.initializeLevel(0, 'LOW');
      setScore(engineRef.current.state.score);
      setVirusCount(engineRef.current.state.virusCount);

      // Container for game elements
      const gameContainer = new Container();
      app.stage.addChild(gameContainer);

      // Container for active pill (rendered separately)
      const pillContainer = new Container();
      app.stage.addChild(pillContainer);

      // Text Sprites Cache for grid
      const sprites: (Text | null)[][] = Array.from(
        { length: 16 },
        (): (Text | null)[] =>
          Array.from({ length: 8 }, (): Text | null => null),
      );

      // Active pill sprites
      let pillSprite1: Text | null = null;
      let pillSprite2: Text | null = null;

      const CELL_SIZE = 32;
      let lastTime = performance.now();

      // Game Loop
      app.ticker.add(() => {
        const now = performance.now();
        const deltaMs = now - lastTime;
        lastTime = now;

        if (!paused) {
          engineRef.current.tick(deltaMs);

          const state = engineRef.current.state;

          // Expose state for E2E testing (Spec 7.1)
          exposeE2EState('DRMARIO_STATE', state);
          exposeE2EState('DRMARIO_ENGINE', engineRef.current);

          // Update React state for HUD
          setScore(state.score);
          setVirusCount(state.virusCount);

          // Handle game over
          if (state.status === 'GAME_OVER' && onGameOver) {
            onGameOver();
          }

          // Render Grid
          const grid = state.grid;
          grid.forEach((row, y) => {
            row.forEach((cell, x) => {
              const existingSprite = sprites[y][x];
              const emoji = CELL_EMOJI[cell];

              if (cell === 'EMPTY' && existingSprite) {
                gameContainer.removeChild(existingSprite);
                sprites[y][x] = null;
              } else if (cell !== 'EMPTY' && !existingSprite) {
                const text = new Text({
                  text: emoji,
                  style: { fontSize: CELL_SIZE - 4 },
                });
                text.x = x * CELL_SIZE;
                text.y = y * CELL_SIZE;
                gameContainer.addChild(text);
                sprites[y][x] = text;
              } else if (existingSprite && existingSprite.text !== emoji) {
                existingSprite.text = emoji;
              }
            });
          });

          // Render Active Pill
          const pill = state.activePill;
          if (pill) {
            // Create or update pill sprites
            if (!pillSprite1) {
              pillSprite1 = new Text({
                text: '',
                style: { fontSize: CELL_SIZE - 4 },
              });
              pillContainer.addChild(pillSprite1);
            }
            if (!pillSprite2) {
              pillSprite2 = new Text({
                text: '',
                style: { fontSize: CELL_SIZE - 4 },
              });
              pillContainer.addChild(pillSprite2);
            }

            pillSprite1.text = PILL_COLOR_EMOJI[pill.color1];
            pillSprite1.x = pill.x * CELL_SIZE;
            pillSprite1.y = pill.y * CELL_SIZE;

            if (pill.orientation === 'HORIZONTAL') {
              pillSprite2.text = PILL_COLOR_EMOJI[pill.color2];
              pillSprite2.x = (pill.x + 1) * CELL_SIZE;
              pillSprite2.y = pill.y * CELL_SIZE;
            } else {
              pillSprite2.text = PILL_COLOR_EMOJI[pill.color2];
              pillSprite2.x = pill.x * CELL_SIZE;
              pillSprite2.y = (pill.y + 1) * CELL_SIZE;
            }
          } else if (pillSprite1 && pillSprite2) {
            pillSprite1.text = '';
            pillSprite2.text = '';
          }
        }
      });
    },
    [onGameOver, paused],
  );

  usePixiApp({ containerRef, onInit: onInitPixi });

  return (
    <div className="game-screen fade-in" data-testid="game-screen">
      <div
        className="hud"
        style={{
          color: 'white',
          display: 'flex',
          justifyContent: 'space-between',
          padding: '10px 20px',
        }}
      >
        <div>SCORE: {score}</div>
        <div>VIRUSES: {virusCount}</div>
      </div>

      {/* PixiJS Container */}
      <div
        ref={containerRef}
        className="game-center"
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
        }}
      />

      {paused && (
        <PauseMenu
          onResume={() => {
            setPaused(false);
          }}
          onSave={() => {
            console.log('Saved');
          }}
          onMainMenu={onMainMenu}
        />
      )}
    </div>
  );
};

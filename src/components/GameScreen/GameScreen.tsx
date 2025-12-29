import { useRef, useState, useCallback } from 'react';
import { Application, Text as PixiText, Container } from 'pixi.js';
import { PauseMenu } from '../PauseMenu';
import { Text } from '../DesignSystem/Text';
import { useGameScreen } from '../../hooks/useGameScreen';
import { usePixiApp } from '../../hooks/usePixiApp';
import { useKeyboardInput } from '../../hooks/useKeyboardInput';
import { DrMarioEngine, CellType, PillColor } from '../../game/DrMarioEngine';
import { exposeE2EState } from '../../utils/env-utils';
import './GameScreen.css';

// Emoji mapping for cell types
const CELL_EMOJI: Record<CellType, string> = {
  EMPTY: '',
  VIRUS_R: '👹',
  VIRUS_Y: '👻',
  VIRUS_B: '👾',
  PILL_R: '🔴',
  PILL_R_LEFT: '🔴',
  PILL_R_RIGHT: '🔴',
  PILL_R_TOP: '🔴',
  PILL_R_BOTTOM: '🔴',
  PILL_Y: '🟡',
  PILL_Y_LEFT: '🟡',
  PILL_Y_RIGHT: '🟡',
  PILL_Y_TOP: '🟡',
  PILL_Y_BOTTOM: '🟡',
  PILL_B: '🔵',
  PILL_B_LEFT: '🔵',
  PILL_B_RIGHT: '🔵',
  PILL_B_TOP: '🔵',
  PILL_B_BOTTOM: '🔵',
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
  const [nextPill, setNextPill] = useState<{
    color1: PillColor;
    color2: PillColor;
  } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<DrMarioEngine>(new DrMarioEngine());

  useGameScreen(paused, setPaused);

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
      setNextPill(engineRef.current.state.nextPill);

      // Container for game elements
      const gameContainer = new Container();
      app.stage.addChild(gameContainer);

      // Container for active pill (rendered separately)
      const pillContainer = new Container();
      app.stage.addChild(pillContainer);

      const CELL_SIZE = 32;

      // Text Sprites Cache for grid
      const sprites: (PixiText | null)[][] = Array.from(
        { length: 16 },
        (): (PixiText | null)[] =>
          Array.from({ length: 8 }, (): PixiText | null => null),
      );

      let pillSprite1: PixiText | null = null;
      let pillSprite2: PixiText | null = null;

      app.ticker.add(() => {
        if (!paused) {
          const deltaMs = app.ticker.deltaMS;
          engineRef.current.tick(deltaMs);

          const state = engineRef.current.state;
          setScore(state.score);
          setVirusCount(state.virusCount);
          setNextPill(state.nextPill);
          exposeE2EState('DRMARIO_STATE', state);
          exposeE2EState('DRMARIO_ENGINE', engineRef.current);

          if (state.status === 'GAME_OVER' && onGameOver) {
            onGameOver();
          }

          // Update Grid Sprites
          state.grid.forEach((row, y) => {
            row.forEach((cell, x) => {
              const emoji = CELL_EMOJI[cell];
              const existingSprite = sprites[y][x];

              if (!emoji) {
                if (existingSprite) {
                  gameContainer.removeChild(existingSprite);
                  sprites[y][x] = null;
                }
                return;
              }

              // Create or update text sprite
              if (!existingSprite) {
                const text = new PixiText({
                  text: emoji,
                  style: { fontSize: CELL_SIZE - 4 },
                });
                text.x = x * CELL_SIZE;
                text.y = y * CELL_SIZE;
                gameContainer.addChild(text);
                sprites[y][x] = text;
              } else if (existingSprite.text !== emoji) {
                existingSprite.text = emoji;
              }
            });
          });

          // Render Active Pill
          const pill = state.activePill;
          if (pill) {
            // Create or update pill sprites
            if (!pillSprite1) {
              pillSprite1 = new PixiText({
                text: '',
                style: { fontSize: CELL_SIZE - 4 },
              });
              pillContainer.addChild(pillSprite1);
            }
            if (!pillSprite2) {
              pillSprite2 = new PixiText({
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
          alignItems: 'center',
          width: '100%',
          maxWidth: '400px',
          marginBottom: '20px',
          padding: '10px 20px',
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
          style={{ padding: '10px 15px', textAlign: 'center' }}
        >
          <div style={{ marginBottom: '4px' }}>
            <Text variant="overline">NEXT</Text>
          </div>
          <div
            style={{ display: 'flex', gap: '4px', justifyContent: 'center' }}
          >
            {nextPill ? (
              <>
                <div
                  className={`pill-segment ${nextPill.color1.toLowerCase()}`}
                  style={{ width: '16px', height: '16px', borderRadius: '50%' }}
                />
                <div
                  className={`pill-segment ${nextPill.color2.toLowerCase()}`}
                  style={{ width: '16px', height: '16px', borderRadius: '50%' }}
                />
              </>
            ) : (
              <div
                style={{
                  width: '36px',
                  height: '16px',
                  background: 'rgba(255,255,255,0.05)',
                  borderRadius: '8px',
                }}
              />
            )}
          </div>
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

      <div id="pill-bottle">
        <div id="bottle-neck" />
        <div
          ref={containerRef}
          className="game-center"
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: '12px',
            overflow: 'hidden',
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
          onMainMenu={onMainMenu}
        />
      )}
    </div>
  );
};

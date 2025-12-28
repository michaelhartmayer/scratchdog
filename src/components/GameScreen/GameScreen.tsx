import { useState } from 'react';
import { PauseMenu } from '../PauseMenu';
import { Button } from '../DesignSystem/Button';
import { useGameScreen } from '../../hooks/useGameScreen';
import './GameScreen.css';

interface GameScreenProps {
  onMainMenu: () => void;
  onGameOver?: () => void;
}

export const GameScreen = ({ onMainMenu, onGameOver }: GameScreenProps) => {
  const [paused, setPaused] = useState(false);

  useGameScreen(setPaused);

  return (
    <div className="game-screen fade-in" data-testid="game-screen">
      <div className="hud">HUD TBD</div>
      <div className="game-center">Game TBD</div>
      {/* Temporary button for testing Game Over */}
      <Button
        onClick={onGameOver}
        style={{ position: 'absolute', bottom: 10, right: 10, opacity: 0.5 }}
        data-testid="trigger-game-over"
      >
        Debug: Game Over
      </Button>
      {paused && (
        <PauseMenu
          onResume={() => setPaused(false)}
          onSave={() => console.log('Saved')}
          onMainMenu={onMainMenu}
        />
      )}
    </div>
  );
};

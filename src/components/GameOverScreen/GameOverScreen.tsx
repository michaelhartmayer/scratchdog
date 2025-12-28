import { useCallback, useState } from 'react';
import { useGameOverScreen } from '../../hooks/useGameOverScreen';
import './GameOverScreen.css';

interface GameOverScreenProps {
  onMainMenu: () => void;
}

export const GameOverScreen = ({ onMainMenu }: GameOverScreenProps) => {
  const [phase, setPhase] = useState(0);

  const handleClick = useCallback(() => {
    onMainMenu();
  }, [onMainMenu]);

  useGameOverScreen(setPhase, onMainMenu, handleClick);

  return (
    <div
      className="game-over-screen"
      onClick={handleClick}
      data-testid="game-over-screen"
    >
      <div className={`game-over-text phase-${phase}`}>Game Over</div>
    </div>
  );
};

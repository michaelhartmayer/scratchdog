import { Button } from '../DesignSystem/Button';
import './MainMenu.css';

interface MainMenuProps {
  onNewGame: () => void;
  onContinue: () => void;
  onOptions: () => void;
}

export const MainMenu = ({
  onNewGame,
  onContinue,
  onOptions,
}: MainMenuProps) => {
  // Placeholder for check, defaulting to false for now based on spec 2.3.1 (greyed out if no save)
  // For E2E we might want to mock this or use localStorage logic
  const hasSave = localStorage.getItem('scratch_dog_save') !== null;

  return (
    <div className="main-menu" data-testid="main-menu">
      <h1 className="menu-title">Main Menu</h1>
      <div className="menu-items">
        <Button onClick={onNewGame} className="menu-btn">
          New Game
        </Button>
        <Button disabled={!hasSave} onClick={onContinue} className="menu-btn">
          Continue Game
        </Button>
        <Button onClick={onOptions} className="menu-btn">
          Options
        </Button>
      </div>
    </div>
  );
};

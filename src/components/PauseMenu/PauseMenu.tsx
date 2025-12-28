import { Button } from '../DesignSystem/Button';
import './PauseMenu.css';

interface PauseMenuProps {
  onResume: () => void;
  onSave: () => void;
  onMainMenu: () => void;
}

export const PauseMenu = ({ onResume, onSave, onMainMenu }: PauseMenuProps) => {
  return (
    <div className="pause-menu-scrim" data-testid="pause-menu">
      <div className="pause-menu-container">
        <Button onClick={onResume}>Resume</Button>
        <Button onClick={onSave}>Save Game</Button>
        <Button variant="secondary" onClick={onMainMenu}>
          Main Menu
        </Button>
      </div>
    </div>
  );
};

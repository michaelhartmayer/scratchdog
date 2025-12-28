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
        <button onClick={onResume}>Resume</button>
        <button onClick={onSave}>Save Game</button>
        <button onClick={onMainMenu}>Main Menu</button>
      </div>
    </div>
  );
};

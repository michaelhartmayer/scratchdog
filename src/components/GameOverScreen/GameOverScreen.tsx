import { useEffect, useState } from 'react';
import './GameOverScreen.css';

interface GameOverScreenProps {
  onMainMenu: () => void;
}

export const GameOverScreen = ({ onMainMenu }: GameOverScreenProps) => {
  // Phases: 'fade-in-black', 'show-text', 'fade-out-black', 'done'
  // Spec:
  // 4.1 Fades to black (2s) - Wait, screen is already game?
  // "The screen fades to black for 2 seconds" implies a transition FROM game TO black.
  // "The screen displays the words Game Over for 2 seconds"
  // "The screen fades to black for 2 seconds" - Wait, if it displays Game Over, maybe white text on black? Then fades to black means text fades out?
  // Or 4.3 maybe implies return?
  // 4.4 After fade out, return to main menu.

  // Simplification for now:
  // 1. Component mounts. Full black overlay opacity 0 -> 1 (2s).
  // 2. Show "Game Over" (2s).
  // 3. Fade out "Game Over" or just wait?
  // "The screen fades to black for 2 seconds" -> Maybe "Game Over" fades out.

  const [phase, setPhase] = useState(0);

  useEffect(() => {
    // 0 -> 1: Fade to black (2s)
    const t1 = setTimeout(() => setPhase(1), 2000);
    // 1 -> 2: Display "Game Over" (2s + previous)
    const t2 = setTimeout(() => setPhase(2), 4000);
    // 2 -> 3: Fade to black (2s + previous). Effectively text fades out?
    const t3 = setTimeout(() => setPhase(3), 6000);
    // 3 -> Done
    const t4 = setTimeout(() => onMainMenu(), 8000); // 2s fade out then switch?

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [onMainMenu]);

  const handleClick = () => {
    onMainMenu();
  };

  useEffect(() => {
    const handleKeyDown = () => handleClick();
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

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

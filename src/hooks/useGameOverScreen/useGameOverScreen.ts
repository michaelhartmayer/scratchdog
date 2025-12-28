import { useEffect } from 'react';

export const useGameOverScreen = (
  setPhase: (phase: number) => void,
  onMainMenu: () => void,
  handleClick: () => void,
) => {
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
  }, [setPhase, onMainMenu]);

  useEffect(() => {
    const handleKeyDown = () => handleClick();
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleClick]);
};

import { useEffect } from 'react';

export const useKeyboardInput = (
  handleKeyDown: (e: KeyboardEvent) => void,
  paused: boolean,
) => {
  useEffect(() => {
    if (paused) return;
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown, paused]);
};

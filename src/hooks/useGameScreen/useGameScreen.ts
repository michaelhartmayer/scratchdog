import { useEffect } from 'react';

import { audioManager } from '../../audio/AudioManager';

export const useGameScreen = (
  paused: boolean,
  setPaused: (paused: boolean) => void,
) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setPaused(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [setPaused]);

  // Audio pause sync
  useEffect(() => {
    audioManager.setPaused(paused);
  }, [paused]);
};

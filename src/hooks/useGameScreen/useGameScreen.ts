import { useEffect, useRef } from 'react';

import { audioManager } from '../../audio/AudioManager';

export const useGameScreen = (
  paused: boolean,
  setPaused: (paused: boolean) => void,
) => {
  const prevPausedRef = useRef(paused);

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

  // Audio pause sync and pause sound
  useEffect(() => {
    if (paused && !prevPausedRef.current) {
      void audioManager.playSFX('pause');
    }

    audioManager.setPaused(paused);
    prevPausedRef.current = paused;
  }, [paused]);
};

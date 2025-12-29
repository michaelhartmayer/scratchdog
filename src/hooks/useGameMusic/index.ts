import { useEffect, useCallback } from 'react';
import { audioManager } from '../../audio/AudioManager';

export const useGameMusic = () => {
  useEffect(() => {
    void audioManager.fadeInMusic('falling-falling-falling', 1000);
    return () => {
      // Optional cleanup - usually handled by explicit fadeOutAndExecute
    };
  }, []);

  const fadeOutAndExecute = useCallback((callback: () => void) => {
    audioManager.fadeOutMusic(1000);
    setTimeout(callback, 1000);
  }, []);

  return { fadeOutAndExecute };
};

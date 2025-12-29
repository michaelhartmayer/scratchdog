import { useEffect } from 'react';
import { audioManager } from '../../audio/AudioManager';

export const useMainMenuMusic = () => {
  useEffect(() => {
    void audioManager.fadeInMusic('intro', 1000);
  }, []);

  const fadeOutAndExecute = (callback: () => void) => {
    audioManager.fadeOutMusic(1000);
    setTimeout(callback, 1000);
  };

  return { fadeOutAndExecute };
};

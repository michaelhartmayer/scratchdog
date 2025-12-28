import { useEffect, useCallback } from 'react';

export const useSplashScreen = (
  fadingOut: boolean,
  setFadingOut: (value: boolean) => void,
  onComplete: () => void,
) => {
  useEffect(() => {
    // Start fade out after some time
    const timer = setTimeout(() => {
      setFadingOut(true);
    }, 2000);

    return () => {
      clearTimeout(timer);
    };
  }, [setFadingOut]);

  useEffect(() => {
    if (fadingOut) {
      const timer = setTimeout(() => {
        onComplete();
      }, 1000); // 1s fade out
      return () => {
        clearTimeout(timer);
      };
    }
  }, [fadingOut, onComplete]);

  const handleInteraction = useCallback(() => {
    onComplete();
  }, [onComplete]);

  useEffect(() => {
    const handleKeyDown = () => {
      handleInteraction();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleInteraction]);

  return { handleInteraction };
};

import { useCallback, useEffect, useState } from 'react';
import './SplashScreen.css';

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen = ({ onComplete }: SplashScreenProps) => {
  const [fadingOut, setFadingOut] = useState(false);

  useEffect(() => {
    // Start fade out after some time
    const timer = setTimeout(() => {
      setFadingOut(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (fadingOut) {
      const timer = setTimeout(() => {
        onComplete();
      }, 1000); // 1s fade out
      return () => clearTimeout(timer);
    }
  }, [fadingOut, onComplete]);

  const handleInteraction = useCallback(() => {
    onComplete();
  }, [onComplete]);

  useEffect(() => {
    const handleKeyDown = () => handleInteraction();
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleInteraction]);

  return (
    <div
      className={`splash-screen ${fadingOut ? 'fade-out' : 'fade-in'}`}
      onClick={handleInteraction}
      data-testid="splash-screen"
    >
      <div className="splash-title">Scratch Dog</div>
      <div className="splash-footer">Press any key to Continue</div>
    </div>
  );
};

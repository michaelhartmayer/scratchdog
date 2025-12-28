import { useState } from 'react';
import { useSplashScreen } from '../../hooks/useSplashScreen';
import './SplashScreen.css';

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen = ({ onComplete }: SplashScreenProps) => {
  const [fadingOut, setFadingOut] = useState(false);

  const { handleInteraction } = useSplashScreen(
    fadingOut,
    setFadingOut,
    onComplete,
  );

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

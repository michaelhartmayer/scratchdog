import { useState, useEffect } from 'react';
import { SplashScreen } from './components/SplashScreen';
import { MainMenu } from './components/MainMenu';
import { GameScreen } from './components/GameScreen';
import { GameOverScreen } from './components/GameOverScreen';
import { OptionsModal } from './components/OptionsModal';
import { DesignSystemPage } from './components/DesignSystemPage';

type Screen = 'SPLASH' | 'MENU' | 'GAME' | 'GAMEOVER' | 'DESIGN_SYSTEM';

function App() {
  const [screen, setScreen] = useState<Screen>('SPLASH');
  const [showOptions, setShowOptions] = useState(false);

  // Simple routing for /design-system
  useEffect(() => {
    if (window.location.pathname === '/design-system') {
      setScreen('DESIGN_SYSTEM');
    }
  }, []);

  if (screen === 'DESIGN_SYSTEM') {
    return <DesignSystemPage />;
  }

  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden' }}>
      {screen === 'SPLASH' && (
        <SplashScreen onComplete={() => setScreen('MENU')} />
      )}

      {screen === 'MENU' && (
        <MainMenu
          onNewGame={() => setScreen('GAME')}
          onContinue={() => setScreen('GAME')}
          onOptions={() => setShowOptions(true)}
        />
      )}

      {screen === 'GAME' && (
        <GameScreen
          onMainMenu={() => setScreen('MENU')}
          onGameOver={() => setScreen('GAMEOVER')}
        />
      )}

      {screen === 'GAMEOVER' && (
        <GameOverScreen onMainMenu={() => setScreen('MENU')} />
      )}

      {showOptions && <OptionsModal onClose={() => setShowOptions(false)} />}
    </div>
  );
}

export default App;

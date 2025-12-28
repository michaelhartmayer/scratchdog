import { useState } from 'react';
import { SplashScreen } from './components/SplashScreen';
import { MainMenu } from './components/MainMenu';
import { GameScreen } from './components/GameScreen';
import { GameOverScreen } from './components/GameOverScreen';
import { OptionsModal } from './components/OptionsModal';

type Screen = 'SPLASH' | 'MENU' | 'GAME' | 'GAMEOVER';

function App() {
  const [screen, setScreen] = useState<Screen>('SPLASH');
  const [showOptions, setShowOptions] = useState(false);

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

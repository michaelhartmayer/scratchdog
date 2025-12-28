import { useEffect } from 'react';

type Screen = 'SPLASH' | 'MENU' | 'GAME' | 'GAMEOVER' | 'DESIGN_SYSTEM';

export const useRouting = (setScreen: (screen: Screen) => void) => {
    useEffect(() => {
        if (window.location.pathname === '/design-system') {
            setScreen('DESIGN_SYSTEM');
        }
    }, [setScreen]);
};

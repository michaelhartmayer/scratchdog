import { useRef, useEffect } from 'react';
import { Application } from 'pixi.js';

interface UsePixiAppProps {
  containerRef: React.RefObject<HTMLDivElement>;
  onInit: (app: Application) => void;
}

export const usePixiApp = ({ containerRef, onInit }: UsePixiAppProps) => {
  const appRef = useRef<Application | null>(null);

  useEffect(() => {
    let cancelled = false;

    const initPixi = async () => {
      const container = containerRef.current;
      if (!container) return;

      const app = new Application();
      await app.init({
        width: 8 * 32,
        height: 16 * 32,
        backgroundAlpha: 0,
      });

      if (cancelled) {
        app.destroy(true, { children: true, texture: true });
        return;
      }

      // Check again because of async gap
      containerRef.current.appendChild(app.canvas);
      appRef.current = app;
      onInit(app);
    };

    void initPixi().catch((err: unknown) => {
      console.error('Failed to initialize PixiJS:', err);
    });

    return () => {
      cancelled = true;
      if (appRef.current) {
        appRef.current.destroy(true, { children: true, texture: true });
        appRef.current = null;
      }
    };
  }, [containerRef, onInit]);

  return appRef;
};

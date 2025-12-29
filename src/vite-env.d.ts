/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_E2E_MODE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare global {
  interface Window {
    getE2EState: (key: string) => unknown;
  }
}

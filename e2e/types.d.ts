export {};

declare global {
  interface Window {
    getE2EState: (key: string) => unknown;
  }
}

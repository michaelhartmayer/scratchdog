/**
 * E2E Testing Environment Utilities
 *
 * Spec 7.1.6: State exposure must use helper functions from /src/utils/env-utils
 */

// Extend Window interface for E2E state keys
declare global {
  interface Window {
    [key: `__${string}__`]: unknown;
    getE2EState: (key: string) => unknown;
  }
}

/**
 * Spec 7.1.6.1: Returns true when running in E2E test mode
 * Checks both DEV mode and VITE_E2E_MODE environment variable
 */
export function isE2EMode(): boolean {
  return import.meta.env.DEV && import.meta.env.VITE_E2E_MODE === 'true';
}

/**
 * Spec 7.1.6.2: Exposes state to window for E2E testing
 * Only exposes when in E2E mode (DEV + VITE_E2E_MODE)
 * Uses double-underscore naming convention per Spec 7.1.3
 */
export function exposeE2EState(key: string, state: unknown): void {
  if (isE2EMode()) {
    const stateKey = `__${key}__` as const;
    window[stateKey] = state;
  }
}

/**
 * Spec 7.1.6.3: Retrieves exposed state (for use in Playwright tests)
 * Returns undefined if not in E2E mode or state doesn't exist
 */
export function getE2EState(key: string): unknown {
  if (isE2EMode()) {
    const stateKey = `__${key}__` as const;
    return window[stateKey];
  }
  return undefined;
}

// Expose to window for E2E tests to call safely (Spec 7.1.6.3)
if (isE2EMode()) {
  window.getE2EState = getE2EState;
}

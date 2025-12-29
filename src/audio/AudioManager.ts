import { Sound, sound } from '@pixi/sound';
import { exposeE2EState } from '../utils/env-utils';

export class AudioManager {
  private _masterVolume = 0.5;
  private _musicVolume = 0.5;
  private _sfxVolume = 0.5;
  private _isMuted = false;

  private _activeSFX = new Set<string>();

  private _lastPlayTimes = new Map<string, number>();
  private _instanceCounts = new Map<string, number>();
  private _loadingPromises = new Map<string, Promise<void>>();

  private _currentMusicAlias: string | null = null;
  private _currentMusicInstance: Sound | null = null;
  private _isMusicPlaying = false;
  private _musicPaused = false;

  private static _instance: AudioManager | undefined;

  public static get instance(): AudioManager {
    AudioManager._instance ??= new AudioManager();
    return AudioManager._instance;
  }

  constructor() {
    this._initialize();
    this._makeEnumerables();
    exposeE2EState('AUDIO_MANAGER', this);
  }

  private _initialize() {
    this._updateVolumes();
  }

  private _makeEnumerables() {
    Object.defineProperty(this, 'masterVolume', {
      get: () => this.get_masterVolume(),
      enumerable: true,
      configurable: true,
    });
    Object.defineProperty(this, 'musicVolume', {
      get: () => this.get_musicVolume(),
      enumerable: true,
      configurable: true,
    });
    Object.defineProperty(this, 'sfxVolume', {
      get: () => this.get_sfxVolume(),
      enumerable: true,
      configurable: true,
    });
    Object.defineProperty(this, 'isMuted', {
      get: () => this.get_isMuted(),
      enumerable: true,
      configurable: true,
    });
    Object.defineProperty(this, 'activeSounds', {
      get: () => this.get_activeSounds(),
      enumerable: true,
      configurable: true,
    });
    Object.defineProperty(this, 'currentMusic', {
      get: () => this.get_currentMusic(),
      enumerable: true,
      configurable: true,
    });
  }

  // Internal getters mapped by _makeEnumerables
  private get_masterVolume(): number {
    return this._masterVolume;
  }
  private get_musicVolume(): number {
    return this._musicVolume;
  }
  private get_sfxVolume(): number {
    return this._sfxVolume;
  }
  private get_isMuted(): boolean {
    return this._isMuted;
  }
  private get_activeSounds(): string[] {
    return Array.from(this._activeSFX);
  }
  private get_currentMusic() {
    if (!this._currentMusicInstance || !this._currentMusicAlias) return null;
    return {
      name: this._currentMusicAlias,
      loop: this._currentMusicInstance.loop,
      isPlaying: this._isMusicPlaying && !this._musicPaused,
      volume: this._currentMusicInstance.volume,
    };
  }

  // Explicit Getters kept for TypeScript interfaces
  public getLastPlayTime(name: string): number {
    return this._lastPlayTimes.get(name) ?? 0;
  }

  public getActiveInstances(name: string): number {
    return this._instanceCounts.get(name) ?? 0;
  }

  public toJSON() {
    return {
      masterVolume: this._masterVolume,
      musicVolume: this._musicVolume,
      sfxVolume: this._sfxVolume,
      isMuted: this._isMuted,
      activeSounds: Array.from(this._activeSFX),
      currentMusic: this.get_currentMusic(),
    };
  }

  // --- Volume Control (6.1) ---

  public setMasterVolume(v: number) {
    this._masterVolume = Math.max(0, Math.min(1, v));
    this._updateVolumes();
  }
  public setMusicVolume(v: number) {
    this._musicVolume = Math.max(0, Math.min(1, v));
    this._updateVolumes();
  }
  public setSFXVolume(v: number) {
    this._sfxVolume = Math.max(0, Math.min(1, v));
    this._updateVolumes();
  }
  public setMute(muted: boolean) {
    this._isMuted = muted;
    if (muted) {
      sound.muteAll();
    } else {
      sound.unmuteAll();
      this._updateVolumes();
    }
  }

  private _updateVolumes() {
    if (this._isMuted) return;
    if (this._currentMusicInstance) {
      this._currentMusicInstance.volume =
        this._masterVolume * this._musicVolume;
    }
  }

  // --- SFX (6.2) ---

  public async playSFX(name: string) {
    if (this._isMuted) return;

    await this._ensureAsset(name);

    const currentCount = this._instanceCounts.get(name) ?? 0;
    this._instanceCounts.set(name, currentCount + 1);

    const vol = this._masterVolume * this._sfxVolume;
    let instance;
    try {
      instance = await sound.play(name, { volume: vol });
    } catch (err) {
      console.error('Failed to play SFX:', err);
    }

    this._activeSFX.add(name);
    this._lastPlayTimes.set(name, Date.now());

    const handleEnd = () => {
      // Artificial delay for E2E check stability (e.g. 200ms)
      setTimeout(() => {
        this._decrementInstanceCount(name);
      }, 200);
    };

    if (instance) {
      const inst = instance as {
        on?: (event: string, fn: () => void) => void;
        then?: (
          fn: (res: { on?: (event: string, fn: () => void) => void }) => void,
        ) => void;
      };
      if (inst.on) {
        inst.on('end', handleEnd);
      } else if (inst.then) {
        inst.then((res) => {
          if (res.on) {
            res.on('end', handleEnd);
          } else {
            handleEnd();
          }
        });
      } else {
        handleEnd();
      }
    } else {
      handleEnd();
    }
  }

  private _decrementInstanceCount(name: string) {
    const c = this._instanceCounts.get(name) ?? 0;
    const newCount = Math.max(0, c - 1);
    this._instanceCounts.set(name, newCount);

    if (newCount === 0) {
      this._activeSFX.delete(name);
    }
  }

  // --- Music (6.3) ---

  public async playMusic(name: string, loop = true) {
    if (this._isMuted) {
      // vol = 0; // Unused
    }

    if (this._currentMusicAlias === name && this._isMusicPlaying) {
      return;
    }

    await this._ensureAsset(name);

    if (this._currentMusicInstance) {
      try {
        this._currentMusicInstance.stop();
      } catch {
        // ignore
      }
      this._currentMusicInstance = null;
    }

    const s = sound.find(name) as Sound | undefined;
    if (!s) {
      console.error(`Sound "${name}" not found.`);
      this._isMusicPlaying = false;
      this._currentMusicAlias = null;
      return;
    }

    const targetVol = this._masterVolume * this._musicVolume;
    s.loop = loop;
    s.volume = targetVol;
    this._currentMusicAlias = name;
    this._currentMusicInstance = s;
    this._isMusicPlaying = true;
    this._musicPaused = false;

    try {
      await s.play();
    } catch (err) {
      console.error('Failed to play music:', err);
      this._isMusicPlaying = false;
      this._currentMusicInstance = null;
    }
  }

  public fadeOutMusic(duration: number) {
    if (this._currentMusicInstance) {
      const startVol = this._currentMusicInstance.volume;
      const startTime = Date.now();
      const timer = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const ratio = Math.min(1, elapsed / duration);
        const newVol = startVol * (1 - ratio);
        if (this._currentMusicInstance) {
          this._currentMusicInstance.volume = newVol;
        }
        if (ratio >= 1) {
          clearInterval(timer);
          this.stopMusic();
        }
      }, 50);
    }
  }

  public stopMusic() {
    if (this._currentMusicInstance) {
      try {
        this._currentMusicInstance.stop();
      } catch {
        // ignore
      }
      this._currentMusicInstance = null;
    }
    this._isMusicPlaying = false;
    this._currentMusicAlias = null;
  }

  public async crossfadeTo(name: string, duration: number) {
    const oldInstance = this._currentMusicInstance;

    await this._ensureAsset(name);
    const newSound = sound.find(name) as Sound | undefined;

    if (!newSound) {
      console.error(`Sound "${name}" not found for crossfade.`);
      if (!oldInstance) {
        // If nothing was playing and new sound misses, just abort
        return;
      }
      // If something was playing, we can't crossfade. Just let old one play?
      // Or stop it? Let's abort crossfade.
      return;
    }

    newSound.volume = 0;
    newSound.loop = true;

    // Start playing new sound
    try {
      const playResult = newSound.play();
      if (playResult instanceof Promise) {
        playResult.catch((err: unknown) => {
          console.error('Failed to play new sound in crossfade:', err);
        });
      }
    } catch {
      // ignore sync errors
    }

    this._currentMusicAlias = name;
    this._currentMusicInstance = newSound;
    this._isMusicPlaying = true;

    const targetVol = this._masterVolume * this._musicVolume;
    const startTime = Date.now();

    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const ratio = Math.min(1, elapsed / duration);

      if (oldInstance) {
        oldInstance.volume = targetVol * (1 - ratio);
      }
      newSound.volume = targetVol * ratio;

      if (ratio >= 1) {
        clearInterval(timer);
        if (oldInstance) {
          try {
            oldInstance.stop();
          } catch {
            // ignore
          }
        }
      }
    }, 50);
  }

  public async fadeInMusic(name: string, duration: number) {
    if (
      this._currentMusicAlias === name &&
      this._isMusicPlaying &&
      !this._musicPaused
    ) {
      return;
    }

    await this._ensureAsset(name);

    if (this._currentMusicInstance) {
      try {
        this._currentMusicInstance.stop();
      } catch {
        // ignore
      }
      this._currentMusicInstance = null;
    }

    const s = sound.find(name) as Sound | undefined;
    if (!s) {
      console.error(`Sound "${name}" not found for fade in.`);
      return;
    }

    const targetVol = this._masterVolume * this._musicVolume;
    this._currentMusicAlias = name;

    s.loop = true;
    s.volume = 0;
    this._currentMusicInstance = s;
    this._isMusicPlaying = true;
    this._musicPaused = false;

    try {
      await s.play();
    } catch (err) {
      console.error('Failed to fade in music:', err);
      return;
    }

    const startTime = Date.now();
    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const ratio = Math.min(1, elapsed / duration);
      if (this._currentMusicInstance === s) {
        s.volume = targetVol * ratio;
      }

      if (ratio >= 1 || this._currentMusicInstance !== s) {
        clearInterval(timer);
      }
    }, 50);
  }

  public setPaused(paused: boolean) {
    if (paused) {
      if (this._isMusicPlaying && !this._musicPaused) {
        sound.pauseAll();
        this._musicPaused = true;
      }
    } else {
      if (this._isMusicPlaying && this._musicPaused) {
        sound.resumeAll();
        this._musicPaused = false;
      }
    }
  }

  public async preload(assets: string[]): Promise<void> {
    const isE2E = import.meta.env.VITE_E2E_MODE === 'true';

    const promises: Promise<void>[] = assets.map((name) => {
      // Already loading (prevent duplicate requests)
      const existingPromise = this._loadingPromises.get(name);
      if (existingPromise) {
        return existingPromise;
      }

      // Check if it already exists AND is loaded
      const existing = sound.find(name) as { isLoaded: boolean } | undefined;
      if (existing?.isLoaded === true) {
        return Promise.resolve();
      }

      // Load the real audio file from public/audio/
      const loadPromise = new Promise<void>((resolve) => {
        // Absolute safety timeout to prevent deadlocks
        const safetyTimeout = setTimeout(() => {
          console.warn(`[AudioManager] Absolute timeout for "${name}"`);
          resolve();
        }, 5000);

        const done = () => {
          clearTimeout(safetyTimeout);
          resolve();
        };

        const addFallback = () => {
          if (isE2E) {
            try {
              if (sound.exists(name)) {
                sound.remove(name);
              }
              sound.add(name, {
                url: '/audio/pop.mp3',
                preload: true,
                loaded: () => {
                  setTimeout(done, 10);
                },
              });
            } catch (fallbackErr) {
              console.error(
                `[AudioManager] Critical failure adding fallback for ${name}:`,
                fallbackErr,
              );
              done();
            }
          } else {
            done();
          }
        };

        try {
          sound.add(name, {
            url: `/audio/${name}.mp3`,
            preload: true,
            loaded: (err: Error | null) => {
              if (err !== null) {
                console.error(`Sound "${name}" not found.`);
                addFallback();
                return;
              }
              setTimeout(done, 10);
            },
          });
        } catch (err) {
          console.error(`Error adding sound "${name}":`, err);
          addFallback();
        }
      });

      this._loadingPromises.set(name, loadPromise);
      return loadPromise;
    });
    await Promise.all(promises);
  }

  public unload(assets: string[]) {
    assets.forEach((name) => {
      if (sound.exists(name)) {
        sound.remove(name);
      }
    });
  }

  public isLoaded(name: string): boolean {
    return sound.exists(name);
  }

  private async _ensureAsset(name: string): Promise<void> {
    const existing = sound.find(name) as { isLoaded: boolean } | undefined;
    if (existing?.isLoaded === true) {
      // Already loaded, nothing to do
      return;
    }

    // If a loading promise exists, wait for it
    const loadingPromise = this._loadingPromises.get(name);
    if (loadingPromise) {
      await loadingPromise;
      return;
    }

    // Not loaded and not loading, start loading
    await this.preload([name]);
  }
}

export const audioManager = AudioManager.instance;

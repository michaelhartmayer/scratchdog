/**
 * Cinematic Starfield System (V9.0 - Sacred Restoration)
 * 
 * This is a 1:1 restoration of the visual logic from the "Complete" version,
 * but optimized via a Shared Graphics Buffer to maintain 60FPS.
 */

import { Application, Container, Graphics } from 'pixi.js';

// ============================================================================
// NOISE TABLE (Restoring smooth organic feel)
// ============================================================================
const NOISE_SIZE = 1024;
const NOISE_LOOKUP = new Float32Array(NOISE_SIZE);
for (let i = 0; i < NOISE_SIZE; i++) {
    const t = (i / NOISE_SIZE) * Math.PI * 2;
    NOISE_LOOKUP[i] = (
        Math.sin(t) * 0.5 +
        Math.sin(t * 1.7 + 1.3) * 0.3 +
        Math.sin(t * 0.7 + 2.1) * 0.2
    );
}

function fastNoise(t: number): number {
    const idx = (Math.abs(t * 100) | 0) % NOISE_SIZE;
    return NOISE_LOOKUP[idx];
}

function lerp(a: number, b: number, t: number): number {
    return a + (b - a) * t;
}

// ============================================================================
// SACRED CONSTANTS (Restored 1:1)
// ============================================================================
const PARALLAX = {
    minSpeed: 0.15, maxSpeed: 1.2,
    minSize: 0.6, maxSize: 1.6,
    minTrail: 15, maxTrail: 120,
    minBrightness: 0.4, maxBrightness: 1.0,
    driftFreq: 0.0008, minDriftAmp: 2, maxDriftAmp: 8,
};

const HALO = {
    minScale: 2.5, maxScale: 6.0,
    twinkleRate: 0.00377, minTwinkleAmp: 0.4, maxTwinkleAmp: 0.7,
};

const COLORS = {
    white: 0xffffff,
    yellow: 0xffd700,
    orange: 0xff8c00,
    blue: 0x44aaff,
};

const TRAIL = {
    falloff: 3.0,
    innerWidthMultiplier: 0.5,
    outerWidthMultiplier: 2.5,
    shimmerFreq: 0.0012,
    shimmerAmp: 0.10,
    segments: 10,
};

const SHIMMER = {
    minInterval: 6000, maxInterval: 20000,
    minDuration: 150, maxDuration: 400,
    haloBoost: 0.5, trailBoost: 0.4,
};

const TIERS = {
    background: { size: 0.8, brightness: 0.7, trail: 0.6 },
    mid: { size: 1.0, brightness: 1.0, trail: 1.0 },
    hero: { size: 1.3, brightness: 1.2, trail: 1.5 },
};

// ============================================================================
// TYPES
// ============================================================================
interface Star {
    x: number; y: number; baseX: number; z: number; speed: number;
    coreRadius: number; trailLength: number; brightness: number;
    driftAmp: number; driftPhase: number; turbulenceSeed: number;
    haloRadius: number; twinkleSeed: number; twinkleAmp: number;
    flickerSeed: number; flickerAmp: number;
    color: number;
    shimmerNextTime: number; shimmerDuration: number;
}

export class Starfield {
    private options: { width: number, height: number, starCount: number };
    private stars: Star[] = [];
    private root: Container;

    // THE SACRED BUFFERS (Live Vector Redraw)
    private layerBg: Graphics;
    private layerTrail: Graphics;
    private layerHalo: Graphics;
    private layerCore: Graphics;

    constructor(_app: Application, options: { width: number, height: number, starCount?: number }) {
        this.options = { width: options.width, height: options.height, starCount: options.starCount ?? 150 };
        this.root = new Container();

        // 1. Solid Opaque Background (Kills 30FPS Compositor Lock)
        this.layerBg = new Graphics().rect(0, 0, this.options.width, this.options.height).fill({ color: 0x000000 });
        this.root.addChild(this.layerBg);

        // 2. High-Performance Shared Buffers
        this.layerTrail = new Graphics(); this.layerTrail.blendMode = 'add';
        this.layerHalo = new Graphics(); this.layerHalo.blendMode = 'add';
        this.layerCore = new Graphics();
        this.root.addChild(this.layerTrail, this.layerHalo, this.layerCore);

        this.generateStars();
    }

    private generateStars(): void {
        const colors = Object.values(COLORS);
        for (let i = 0; i < this.options.starCount; i++) {
            const z = Math.random();
            const zE = z * z * (3 - 2 * z);

            const roll = Math.random();
            const tier = roll > 0.95 ? 'hero' : (roll > 0.85 ? 'mid' : 'background');
            const tm = TIERS[tier];

            const colorIndex = Math.floor(Math.pow(z, 1.5) * colors.length);
            const color = colors[Math.min(colorIndex, colors.length - 1)];

            const coreRadius = lerp(PARALLAX.minSize, PARALLAX.maxSize, zE) * tm.size;
            const starX = Math.random() * this.options.width;

            this.stars.push({
                x: starX, y: Math.random() * this.options.height, baseX: starX, z,
                speed: lerp(PARALLAX.minSpeed, PARALLAX.maxSpeed, zE),
                coreRadius,
                trailLength: lerp(PARALLAX.minTrail, PARALLAX.maxTrail, zE) * tm.trail,
                brightness: lerp(PARALLAX.minBrightness, PARALLAX.maxBrightness, z) * tm.brightness,
                driftAmp: lerp(PARALLAX.minDriftAmp, PARALLAX.maxDriftAmp, z),
                driftPhase: Math.random() * 7,
                turbulenceSeed: Math.random() * 1000,
                haloRadius: coreRadius * lerp(HALO.minScale, HALO.maxScale, 1 - z),
                twinkleSeed: Math.random() * 1000,
                twinkleAmp: lerp(HALO.maxTwinkleAmp, HALO.minTwinkleAmp, z),
                flickerSeed: Math.random() * 1000,
                flickerAmp: 0.12 + 0.23 * z,
                shimmerNextTime: performance.now() + lerp(SHIMMER.minInterval, SHIMMER.maxInterval, Math.random()),
                shimmerDuration: lerp(SHIMMER.minDuration, SHIMMER.maxDuration, Math.random()),
                color,
            });
        }
    }

    public update(_dt: number): void {
        const time = performance.now();

        // Clear buffers once per frame
        this.layerTrail.clear();
        this.layerHalo.clear();
        this.layerCore.clear();

        for (const s of this.stars) {
            // Motion
            const turb = 1 + 0.05 * fastNoise(time * 0.00015 + s.turbulenceSeed);
            s.y += s.speed * turb;
            s.x = s.baseX + s.driftAmp * Math.sin(time * PARALLAX.driftFreq + s.driftPhase);

            if (s.y > this.options.height + s.trailLength) {
                s.y = -s.trailLength;
                s.baseX = Math.random() * this.options.width;
            }

            // Shimmer
            let shim = 0;
            if (time >= s.shimmerNextTime) {
                const elapsed = time - s.shimmerNextTime;
                if (elapsed < s.shimmerDuration) shim = 1 - Math.abs(2 * (elapsed / s.shimmerDuration) - 1);
                else {
                    s.shimmerNextTime = time + lerp(SHIMMER.minInterval, SHIMMER.maxInterval, Math.random());
                    s.shimmerDuration = lerp(SHIMMER.minDuration, SHIMMER.maxDuration, Math.random());
                }
            }

            const twink = 1 + s.twinkleAmp * fastNoise(time * HALO.twinkleRate + s.twinkleSeed);
            const flick = 1 + s.flickerAmp * fastNoise(time * 0.0157 + s.flickerSeed);

            // Core Redraw (Sacred Peak Formula)
            this.layerCore.circle(s.x, s.y, s.coreRadius).fill({ color: s.color, alpha: s.brightness });
            this.layerCore.circle(s.x, s.y, s.coreRadius * 0.3).fill({ color: 0xffffff, alpha: s.brightness * 0.8 });

            // Halo Redraw (Sacred Softness)
            const haloAlpha = Math.min(0.7, (s.brightness * 0.2 * twink) + shim * SHIMMER.haloBoost);
            this.layerHalo.circle(s.x, s.y, s.haloRadius * 0.5).fill({ color: s.color, alpha: haloAlpha * 0.6 });
            this.layerHalo.circle(s.x, s.y, s.haloRadius).fill({ color: s.color, alpha: haloAlpha * 0.4 });

            // Trail Redraw (Sacred Tron Segments)
            if (s.y > -s.trailLength) {
                for (let j = 0; j < TRAIL.segments; j++) {
                    const s0 = j / TRAIL.segments;
                    const s1 = (j + 1) / TRAIL.segments;
                    const y0 = s.y - s.trailLength * s0;
                    const y1 = s.y - s.trailLength * s1;

                    const falloff = Math.exp(-TRAIL.falloff * s0);
                    const beamShim = 1 + 0.10 * fastNoise(time * TRAIL.shimmerFreq + s.turbulenceSeed + s0 * 5);
                    const alphaBase = falloff * beamShim * s.brightness;

                    const outerAlpha = Math.min(0.8, (alphaBase * 0.3 * flick) + shim * SHIMMER.trailBoost);
                    const innerAlpha = Math.min(0.9, alphaBase * 0.6 * (1 + (flick - 1) * 0.3));

                    const innerW = Math.max(0.5, s.coreRadius * TRAIL.innerWidthMultiplier * (1 - s0 * 0.7));
                    const outerW = s.coreRadius * TRAIL.outerWidthMultiplier * (1 - s0 * 0.5);

                    // Outer Glow
                    this.layerTrail.moveTo(s.x, y0).lineTo(s.x, y1).stroke({ width: outerW, color: s.color, alpha: outerAlpha });
                    // Inner Core Line
                    this.layerTrail.moveTo(s.x, y0).lineTo(s.x, y1).stroke({ width: innerW, color: 0xffffff, alpha: innerAlpha });
                }
            }
        }
    }

    public get container(): Container { return this.root; }
    public resize(w: number, h: number): void {
        this.options.width = w; this.options.height = h;
        this.layerBg.clear().rect(0, 0, w, h).fill({ color: 0x000000 });
    }
}

export function createStarfield(app: Application, options: { width: number, height: number, starCount?: number }): Starfield {
    return new Starfield(app, options);
}

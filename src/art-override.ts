/**
 * Art Override Configuration
 * Use this to manually adjust the scale/zoom of pill and virus assets 
 * to compensate for inconsistent art sizing.
 */

import { BLEND_MODES } from 'pixi.js';

export const ART_ZOOM: Record<string, number> = {
    // Viruses (Video Assets)
    'VIRUS_R': 1.5,
    'VIRUS_Y': 1.5,
    'VIRUS_B': 1.5,

    // Pills (Image assets)
    'PILL_R': 2.2,
    'PILL_Y': 1.8,
    'PILL_B': 1.4,
};

export const ART_BLEND: Record<string, keyof typeof BLEND_MODES> = {
    // Viruses (Video Assets)
    'VIRUS_R': 'screen',
    'VIRUS_Y': 'screen',
    'VIRUS_B': 'screen',

    // Pills (Image assets)
    'PILL_R': 'screen',
    'PILL_Y': 'screen',
    'PILL_B': 'screen',
};

/**
 * Helper function to convert RGB percentages (0-100) to hex color
 * Example: percentToHex({ r: 100, g: 75, b: 75 }) => 0xffbfbf
 * Values are automatically clamped to 0-100 range.
 */
function percentToHex(rgb: { r: number; g: number; b: number }): number {
    const clamp = (val: number) => Math.max(0, Math.min(100, val));
    const r = Math.round((clamp(rgb.r) / 100) * 255);
    const g = Math.round((clamp(rgb.g) / 100) * 255);
    const b = Math.round((clamp(rgb.b) / 100) * 255);
    return (r << 16) | (g << 8) | b;
}

/**
 * Virus Tint Configuration (Percentage-based)
 * Adjust these percentages to control tint intensity:
 * - 100% = full intensity for that channel
 * - Lower values = less of that color
 * Example: { r: 100, g: 75, b: 75 } = 30% red tint (reduce green/blue by 25%)
 */
export const VIRUS_TINT_PERCENT = {
    'VIRUS_R': { r: 200, g: 70, b: 70 },  // 30% red tint
    'VIRUS_Y': { r: 250, g: 250, b: 0 }, // 30% yellow tint (red + green, less blue)
    'VIRUS_B': { r: 100, g: 100, b: 200 },  // 30% blue tint
};

// Auto-convert percentages to hex values
export const ART_TINT: Record<string, number> = {
    'VIRUS_R': percentToHex(VIRUS_TINT_PERCENT.VIRUS_R),
    'VIRUS_Y': percentToHex(VIRUS_TINT_PERCENT.VIRUS_Y),
    'VIRUS_B': percentToHex(VIRUS_TINT_PERCENT.VIRUS_B),
};

export const AUDIO_VOLUME = {
    MASTER: 0.5,
    MUSIC: 0.7,
    SFX: 1.0,
};

export const ASSET_VOLUME: Record<string, number> = {
    'rotation': 0.8,
    'thud': 0.8,
    'pop': 0.7,
};

/**
 * Combo Text Configuration
 * Customize the text and color for different combo counts.
 * The system checks thresholds from highest to lowest.
 * Example: To change the text for 5+ combos, edit the first item.
 */
export const COMBO_MESSAGES = [
    { threshold: 2, text: "GREAT!", color: 0x00ff00 }, // Green
    { threshold: 3, text: "AWESOME!", color: 0x00ffff }, // Cyan
    { threshold: 4, text: "AMAZING!", color: 0xff00ff }, // Magenta
    { threshold: 5, text: "GODLY!", color: 0xffd700 }, // Gold
];

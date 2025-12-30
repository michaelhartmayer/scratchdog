# Cinematic Starfield Specification (Authoritative)

1. Goal
    1.1. A cinematic, synth-space starfield backdrop rendered over pure black (#000000).
    1.2. Glittering micro-stars in orange, yellow, blue, and white drifting downward with layered parallax depth.
    1.3. Each star has:
        - a stable, non-flickering core
        - a Tron-like luminous trail that flickers gently like candlelight
    1.4. Stars twinkle via their halo/glow only (never via the core), with rare shimmer “ping” events.
    1.5. All motion and light modulation must be smooth, continuous, and organic.
        - No jitter
        - No strobing
        - No per-frame randomness

2. Coordinate Space & Directionality
    2.1. Screen space is 2D.
    2.2. Downward motion means increasing Y in screen coordinates.
    2.3. Trails extend upward (opposite direction of motion).
    2.4. Stars wrap from bottom to top when exiting the screen.

3. Rendering & Composition
    3.1. Background: solid #000000 with no gradients or haze.
    3.2. Blending:
        3.2.1. Use additive or screen blending for halos and trails.
        3.2.2. Core stars may use standard alpha or additive blending.
    3.3. Bloom:
        3.3.1. Bloom applies only to halos and trails.
        3.3.2. Bloom must be clamped or softly tonemapped.
        3.3.3. Black background must remain black (no gray wash).
    3.4. Density:
        3.4.1. Visually rich, but not uniform.
        3.4.2. Preserve negative space to avoid “snow” or static noise look.

4. Layered Parallax (Depth)
    4.1. Use 3–5 depth layers (far, mid, near, hero).
    4.2. Each star has a depth value z ∈ [0..1] or a discrete layer index.
    4.3. Far Layer (z ≈ 0)
        4.3.1. Smallest core radius.
        4.3.2. Lowest brightness.
        4.3.3. Shortest trails.
        4.3.4. Slowest downward velocity.
        4.3.5. Cooler color bias (white/blue).
    4.4. Near Layer (z ≈ 1)
        4.4.1. Larger core radius.
        4.4.2. Brighter halos and trails.
        4.4.3. Longer trails.
        4.4.4. Faster downward velocity.
        4.4.5. Warmer color bias (yellow/orange).
    4.5. Parallax Formulas
        4.5.1. speed = lerp(minSpeed, maxSpeed, smoothstep(z))
        4.5.2. size = lerp(minSize, maxSize, smoothstep(z))
        4.5.3. trailLength = lerp(minTrail, maxTrail, smoothstep(z))

5. Motion (Flowy Downward Drift)
    5.1. Stars move continuously downward.
    5.2. Primary velocity is vertical (positive Y).
    5.3. Lateral Drift
        5.3.1. xOffset(t) = amp(z) * sin(t * freq + phase)
        5.3.2. amp increases slightly with depth but remains subtle.
    5.4. Speed Turbulence
        5.4.1. v(t) = baseSpeed(z) * (1 + 0.05 * smoothNoise(t * 0.15 + seed))
    5.5. All motion modifiers must be continuous and low-frequency.

6. Star Core (Stable Emitter)
    6.1. Core brightness is constant over time (no flicker, no twinkle).
    6.2. Core Shape
        6.2.1. Slightly soft disc with a sharp central peak (small Gaussian).
        6.2.2. Optional subtle ellipticity or rotation per star.
    6.3. Core Parameters
        6.3.1. coreRadiusPx(z): approx. 0.6px (far) → 1.6px (near).
        6.3.2. coreIntensity: depth-scaled, with tiny per-star static variation.

7. Halo / Glow (Twinkle Domain)
    7.1. Twinkle affects halo only, never the core.
    7.2. haloRadius = coreRadius * haloScale (2.5× to 6×).
    7.3. Twinkle Formula
        7.3.1. twinkle = 1 + twinkleAmp(z) * smoothNoise(t * twinkleRate + seed)
        7.3.2. twinkleRate: 0.3–0.9 Hz.
        7.3.3. twinkleAmp: small; far stars slightly stronger than near.
    7.4. Apply twinkle to haloIntensity and/or haloRadius only.

8. Tron Trail (Primary Visual Feature)
    8.1. Each star emits a trail extending upward.
    8.2. Trail Structure
        8.2.1. Thin, sharp inner core line.
        8.2.2. Wider, softer outer glow.
        8.2.3. Inner line trends slightly whiter than star color.
    8.3. Trail Length
        8.3.1. Depth-dependent (near stars have longer trails).
    8.4. Intensity & Width Profile
        8.4.1. s ∈ [0..1] where s=0 at star, s=1 at trail end.
        8.4.2. brightness(s) = exp(-falloff * s).
        8.4.3. width(s) = lerp(maxWidthNear, minWidthFar, s).
    8.5. Along-Trail Shimmer
        8.5.1. shimmer(s,t) = 1 + 0.10 * smoothNoise(t * 1.2 + seed + s * detailFreq).
        8.5.2. Shimmer must remain subtle and continuous.

9. Candle Flicker (Trail Only)
    9.1. Flicker applies to trail glow only.
    9.2. Flicker Formula
        9.2.1. flicker = 1 + flickerAmp(z) * smoothNoise(t * flickerRate + seed).
        9.2.2. flickerRate: 1.5–3.5 Hz (smooth, not stroby).
        9.2.3. flickerAmp: 0.12–0.35.
    9.3. Optional: apply a much smaller flicker to trail core line.

10. Rare Shimmer Pings
    10.1. Very rare, per-star shimmer accent.
    10.2. Frequency: randomized, ~1 event every 6–20 seconds.
    10.3. Duration: 150–400ms with eased in/out curve.
    10.4. Affects halo and trail bloom only.
    10.5. Never alters core brightness.

11. Color Palette & Distribution
    11.1. Allowed colors: orange, yellow, blue, white.
    11.2. Base Distribution
        11.2.1. White: 50%
        11.2.2. Yellow: 25%
        11.2.3. Orange: 15%
        11.2.4. Blue: 10%
    11.3. Depth Bias
        11.3.1. Far layers skew cooler.
        11.3.2. Near layers skew warmer.
    11.4. Color Handling
        11.4.1. Core color is saturated and stable.
        11.4.2. Halo may desaturate or trend toward white.
        11.4.3. Trail glow matches star hue; inner line trends white.

12. Star Tiers
    12.1. Tier Distribution
        12.1.1. 70% background stars: tiny, dim, short trails.
        12.1.2. 25% mid stars: moderate glow and trails.
        12.1.3. 5% hero stars: brighter halos, longer trails, shimmer pings.
    12.2. Tiers affect size, brightness, trail length, and shimmer eligibility.

13. Negative Space & Clustering
    13.1. Avoid uniform random placement.
    13.2. Use subtle clustering or bands.
    13.3. Clusters drift downward with the starfield over time.

14. Anti-Aliasing & Sharpness
    14.1. Core must remain crisp.
    14.2. Halo and trail glow may be soft.
    14.3. Trail core line must remain thin and well-defined.
    14.4. Clamp bloom and additive accumulation.

15. Performance & Implementation
    15.1. Prefer instanced rendering or single shader pass.
    15.2. Per-Star Attributes
        15.2.1. position
        15.2.2. depth
        15.2.3. color
        15.2.4. tier
        15.2.5. phase seeds (twinkle, flicker, shimmer)
        15.2.6. baseIntensity
        15.2.7. baseTrailLength
    15.3. Use cheap, smooth noise (value noise, simplex).
    15.4. No per-frame allocations.

16. No-Go Rules
    16.1. No hard random flicker.
    16.2. No core blinking.
    16.3. No strobe-like twinkle.
    16.4. No identical speeds, sizes, or trail lengths.
    16.5. No gray haze or lifted blacks.

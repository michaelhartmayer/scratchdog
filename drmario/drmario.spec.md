# Dr. Mario Specification

1. Game Overview  
    1.1. The objective is to eliminate all viruses in the bottle by matching them with colored vitamin capsules.  
2. Game Components  
    2.1. Bottle (Board)  
        2.1.1. The play area is a grid, 8 blocks wide by 16 blocks high.  
    2.2. Viruses  
        2.2.1. There are three types of viruses: Red, Yellow, and Blue.  
    2.3. Megavitamins (Pills)  
        2.3.1. Pills consist of two halves, each being Red, Yellow, or Blue.  
3. Game Mechanics  
    3.1. Movement  
        3.1.1. Pills can be moved left, right, and rotated 90 degrees.  
        3.1.2. Rotation Details  
            3.1.2.1. Button A (X) rotates the pill 90 degrees clockwise.  
            3.1.2.2. Button B (Z) rotates the pill 90 degrees counter-clockwise.  
            3.1.2.3. Rotation triggers the sound: /audio/rotation.mp3  
    3.2. Matching  
        3.2.1. Alignment Clear Rules  
            3.2.1.1. Aligning 4 or more color segments (virus or pill) vertically or horizontally eliminates them.  
            3.2.1.2. Multidirectional Matches: If a segment participates in both a horizontal and a vertical match simultaneously (e.g., an L-shape or T-shape clear), all participating segments in both directions are cleared.  
            3.2.1.3. Simultaneous Matches: Multiple independent matches (e.g., two parallel rows) occurring in the same tick are all cleared simultaneously.  
            3.2.1.4. Extension: Matches of 5, 6, 7, or 8 segments are allowed and cleared in a single animation.  
        3.2.2. Chain Reactions (Cascades)  
            3.2.2.1. A chain reaction occurs when segments fall due to gravity and form new matches upon landing.  
            3.2.2.2. Scoring: Chain reactions do NOT award bonus points or multipliers beyond the base score for the viruses cleared in that step.  
            3.2.2.3. Animation: Each step of a chain reaction that results in a match triggers a new Clear Animation sequence (flashing).  
        3.2.3. Capsule Breakage  
            3.2.3.1. A pill (megavitamin) is composed of two color segments.  
            3.2.3.2. When an elimination match (4+ in a row) is detected, only the specific segments (pill halves or viruses) directly participating in that match are cleared.  
            3.2.3.3. If only one segment of a capsule is cleared, the link between the two segments is broken. The remaining segment stays on the board as a single, independent unit.  
            3.2.3.4. If both segments of a capsule are cleared (either by the same match or different matches simultaneously), the entire pill is effectively removed from the board.  
    3.3. Gravity  
        3.3.1. Unsupported pill segments fall downwards until they hit a supported surface.  
        3.3.2. Speed Levels  
            3.3.2.1. Drop speed increases based on the selected Speed setting (Low, Med, High).  
            3.3.2.2. Speed also increases slightly for every 10 pills dropped.  
    3.4. Spawning  
        3.4.1. Pills spawn at the top center of the bottle.  
        3.4.2. The next upcoming pill is visible to the player.  
    3.5. Locking  
        3.5.1. Pills lock into place when they land on a supported surface and are not moved for a short duration.  
        3.5.2. Landing triggers the sound: /audio/thud.mp3  
    3.6. Clear Animations  
        3.6.1. When a match is made, matched segments flash for 16 frames (~267ms at 60fps) before being removed.  
        3.6.2. Viruses are replaced with an "X" or starburst explosion sprite when eliminated.  
        3.6.3. Capsule segments flash and disappear along with any viruses in the match.  
        3.6.4. Input is disabled during the clear animation; the player cannot move the next pill.  
        3.6.5. After the clear animation completes, unsupported capsule segments fall at 4 rows/second (250ms per row).  
        3.6.6. Each cascade re-checks for new matches, repeating the clear animation if needed.  
        3.6.7. Chained clears from cascading use the same flash animation (16 frames/267ms) before removal.  
        3.6.8. When matched segments are removed, play the sound: /audio/pop.mp3  
    3.7. Victory Animation  
        3.7.1. Trigger: Initiated immediately after the final virus is cleared and all resulting cascades have completed.  
        3.7.2. Mechanics:  
            3.7.2.1. Descending Sweep: A horizontal "purge" effect moves from the top row (Row 0) to the bottom row (Row 15).  
            3.7.2.2. Timing: Rows are processed sequentially at a rate of 100ms per row (Fixed 6 frames at 60fps).  
            3.7.2.3. Transformation: As the sweep passes a row, all non-EMPTY cells in that row are converted to their respective EXPLODE state (e.g., PILL_R -> EXPLODE_R).  
            3.7.2.4. Trailing Cleanup: EXPLODE cells created by the sweep persist for 200ms before being permanently replaced by EMPTY cells.  
            3.7.2.5. Overlap: The sweep moves to the next row every 100ms, while the cleanup takes 200ms, creating a "trailing explosion" effect spanning two rows simultaneously.  
        3.7.3. Duration: Total sweep time is 1.6 seconds (16 rows * 100ms), with a final 200ms pause for the bottom row's cleanup.  
        3.7.4. State: The game status remains in a specialized WIN_ANIMATION state until the sequence completes.  
        3.7.5. Input: All player controls are disabled throughout the animation.  
4. Game States  
    4.1. Clear Condition  
        4.1.1. A stage is cleared when all viruses are eliminated.  
    4.2. Game Over  
        4.2.1. The game ends if pills block the bottle neck and no more pills can enter.  
5. Scoring & Progression  
    5.1. Scoring  
        5.1.1. Points are awarded for eliminating viruses, with higher points at higher speed settings.  
        5.1.2. Scoring Table  
            5.1.2.1. Low Speed: 1 virus = 100 pts.  
            5.1.2.2. Med Speed: 1 virus = 200 pts.  
            5.1.2.3. High Speed: 1 virus = 300 pts.  
            5.1.2.4. Multi-virus clears multiply the score (2x for 2, 4x for 3, 8x for 4+).  
            5.1.2.5. Capsule to Capsule matches award 0 points.  
    5.2. Progression  
        5.2.1. Each new level increases the starting number of viruses.  
6. Internals & Algorithms  
    6.1. Virus Generation Algorithm  
        6.1.1. Y-coordinate selected first (1-16), then X-coordinate (1-8).  
        6.1.2. Collision results in incrementing X, then Y.  
        6.1.3. Color assigned based on (Remaining Viruses % 4).  
        6.1.4. Adjacency checks prevent 3 consecutive matching colors in any direction during generation.  
    6.2. Frame Data  
        6.2.1. Gravity speed is determined by a lookup table starting at memory address A795 (NTSC).  
        6.2.2. Drop speed increases every 10 pills dropped.  
        6.2.3. Cascade fall speed is constant at 4 rows per second.  
    6.3. Level Progression Formula  
        6.3.1. Virus Count = 4 * (Level + 1).  
        6.3.2. Maximum virus count is capped at 84 (Level 20+).  
7. Technical Details  
    7.1. There should only be one game canvas on screen at a given time.  
8. UI  
    8.1. Pill Bottle  
        8.1.1. The play area is contained within a medicine bottle shape.  
        8.1.2. The bottle has a narrow neck opening at the top where pills enter.  
        8.1.3. The bottle is translucent with a slight glass-like appearance.  
    8.2. Colors  
        8.2.1. Red: A vibrant cherry red (#FF0000 or similar).  
        8.2.2. Yellow: A bright golden yellow (#FFFF00 or similar).  
        8.2.3. Blue: A deep royal blue (#0000FF or similar).  
    8.3. Viruses  
        8.3.1. Viruses are small animated creatures with distinct faces.  
        8.3.2. Each color virus has a unique appearance/expression.  
        8.3.3. Viruses wiggle or animate slightly when idle.  
    8.4. Pills  
        8.4.1. Pills are capsule-shaped with two colored halves.  
        8.4.2. Each half is a solid color (R/Y/B).  
        8.4.3. Pills have a slight 3D shading/highlight effect.  


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
    3.2. Matching  
        3.2.1. Aligning 4 or more color segments (virus or pill) vertically or horizontally eliminates them.  
        3.2.2. Chain Reactions  
            3.2.2.1. Chain reactions (cascading clears) do NOT award extra points.  
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


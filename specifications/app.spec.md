# Application Specification

1. Splash Screen
    1.1. Fades in from black
    1.2. Center screen displays the words "Scratch Dog"
    1.3. Fades out to black
    1.4. Any key or mouse click will skip the splash screen
    1.5. The bottom of the splash screen displays "Press any key to Continue"
2. Main Menu
    2.1. Center screen displays the words "Main Menu"
    2.2. Menu Item: "New Game"
        2.2.1. Fades to black over 2 seconds
        2.2.2. Then fades to the [Game Screen](Specification.3) over 2 seconds
    2.3. Menu Item: "Continue Game"
        2.3.1. The menu item is greyed out if there is no saved game
    2.4. Menu Item: "Options"
        2.4.1. Opens a modal called "Options"
        2.4.2. Has a black scrim behind it
        2.4.3. Vertically and horizontally centered
        2.4.4. Has a close button in the top right
        2.4.5. Has a title bar
        2.4.6. Has a content area
            2.4.6.1. Has a section called "Audio"
                2.4.6.1.1. Has a checkbox for "Mute"
                2.4.6.1.2. Has a checkbox for "Music"
                2.4.6.1.3. Has a checkbox for "Sound Effects"
        2.4.7. Has a footer
            2.4.7.1. Has a "Back" button
            2.4.7.2. Has an "Apply" button
3. Game Screen
    3.1. The screen fades in from black
    3.2. The HUD is displayed
        3.2.1. At the top in white debug text it should say "HUD TBD"
    3.3. Game play begins
        3.3.1. In the center in white text it should say "Game TBD"
    3.4. Escape key will pause the game
        3.4.1 A light black scrim quickly fades in
        3.4.2 The pause menu is displayed
            3.4.2.1. Has a "Resume" button
            3.4.2.2. Has a "Save Game" button
            3.4.2.3. Has a "Main Menu" button
4. Game Over Screen
    4.1. The screen fades to black for 2 seconds
    4.2. The screen displays the words "Game Over" for 2 seconds
    4.3. The screen fades to black for 2 seconds
    4.4. After the fade out, return to the main menu
    4.5. Any key or mouse click will return to the main menu


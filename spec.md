# Dev Specification

1. NodeJS
    1.1. Commands
        1.1.1. npm run dev
            1.1.1.1. Serve on port 8023
        1.1.2. npm run test:unit
            1.1.2.1. Run unit tests
            1.1.2.2. Measure code coverage
            1.1.2.3. Generate test report
        1.1.3. npm run test:e2e:headless
            1.1.3.1. Run end-to-end tests headless
            1.1.3.2. Generate test report
        1.1.4. npm run test:e2e:headed
            1.1.4.1. Run end-to-end tests headed
            1.1.4.2. Generate test report
        1.1.5. npm run build
            1.1.5.1. Build for production
            1.1.5.2. Minify assets
            1.1.5.3. Generate production report
        1.1.6. npm run lint
            1.1.6.1. Run ESLint and report
        1.1.7. npm run lint:fix
            1.1.7.1. Run ESLint and fix
        1.1.8. npm run format
            1.1.8.1. Run Prettier and report
        1.1.9. npm run format:fix
            1.1.9.1. Run Prettier and fix
2. ESLint
    2.1. Rules
        2.1.1. Specific Rules
            2.1.1.1. One react component per file
            2.1.1.2. All components are organized
                2.1.1.2.1. UI components must be in /src/components
                2.1.1.2.2. Providers must be in /src/providers
                2.1.1.2.3. All components must be in a folder of the same name and exported by an index.ts file
            2.1.1.3. Hooks must be in /src/hooks
                2.1.1.3.1. All hooks must be in a folder of the same name and exported by an index.ts file
            2.1.1.4. Utilities must be in /src/utils
                2.1.1.4.1. All utilities must be in a folder of the same name and exported by an index.ts file
        2.1.2. All custom ESLint rules must be unit tested
            2.1.2.1. All custom ESLint rules must be in .eslint-rules/
            2.1.2.2. Each eslint rule must have its own folder
            2.1.2.3. Each eslint rule must have its tests written in its respective folder
3. Vite
4. PixiJS
5. React
6. Vitest
7. Playwright
8. TypeScript
9. Prettier
    9.1. Prettier is used for code formatting
    9.2. Prettier is configured to use the React configuration
    9.3. Prettier is configured to use the TypeScript configuration
    9.4. Prettier is configured to use the Vite configuration
    9.5. Custom prettier rules
        9.5.1. spec.md files properly indent specifications by sub-section
            9.5.1.1. indent using 4 spaces
            9.5.1.2. do not use tabs
            9.5.1.3. do not use extra spaces
            9.5.1.4. do not use extra newlines

# Specification

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


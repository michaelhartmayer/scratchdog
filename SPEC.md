# Project Specifications

## Table of Contents

<table width="100%">
  <tr>
    <td align="left"><a href="#application-specification">Application Specification</a></td>
    <td align="right"><code>app.spec.md</code></td>
  </tr>
  <tr>
    <td align="left"><a href="#environment-specification">Environment Specification</a></td>
    <td align="right"><code>env.spec.md</code></td>
  </tr>
  <tr>
    <td align="left"><a href="#theme-specification">Theme Specification</a></td>
    <td align="right"><code>theme.spec.md</code></td>
  </tr>
</table>

---

<a name="application-specification"></a>

## Application Specification  

* 1. Splash Screen    
    * 1.1. Fades in from black    
    * 1.2. Center screen displays the words "Scratch Dog"    
    * 1.3. Fades out to black    
    * 1.4. Any key or mouse click will skip the splash screen    
    * 1.5. The bottom of the splash screen displays "Press any key to Continue"    
* 2. Main Menu    
    * 2.1. Center screen displays the words "Main Menu"    
    * 2.2. Menu Item: "New Game"    
        * 2.2.1. Fades to black over 2 seconds    
        * 2.2.2. Then fades to the [Game Screen](Specification.3) over 2 seconds    
    * 2.3. Menu Item: "Continue Game"    
        * 2.3.1. The menu item is greyed out if there is no saved game    
    * 2.4. Menu Item: "Options"    
        * 2.4.1. Opens a modal called "Options"    
        * 2.4.2. Has a black scrim behind it    
        * 2.4.3. Vertically and horizontally centered    
        * 2.4.4. Has a close button in the top right    
        * 2.4.5. Has a title bar    
        * 2.4.6. Has a content area    
            * 2.4.6.1. Has a section called "Audio"    
                * 2.4.6.1.1. Has a checkbox for "Mute"    
                * 2.4.6.1.2. Has a checkbox for "Music"    
                * 2.4.6.1.3. Has a checkbox for "Sound Effects"    
        * 2.4.7. Has a footer    
            * 2.4.7.1. Has a "Back" button    
            * 2.4.7.2. Has an "Apply" button    
* 3. Game Screen    
    * 3.1. The screen fades in from black    
    * 3.2. The HUD is displayed    
        * 3.2.1. At the top in white debug text it should say "HUD TBD"    
    * 3.3. Game play begins    
        * 3.3.1. In the center in white text it should say "Game TBD"    
    * 3.4. Escape key will pause the game    
        * 3.4.1 A light black scrim quickly fades in    
        * 3.4.2 The pause menu is displayed    
            * 3.4.2.1. Has a "Resume" button    
            * 3.4.2.2. Has a "Save Game" button    
            * 3.4.2.3. Has a "Main Menu" button    
* 4. Game Over Screen    
    * 4.1. The screen fades to black for 2 seconds    
    * 4.2. The screen displays the words "Game Over" for 2 seconds    
    * 4.3. The screen fades to black for 2 seconds    
    * 4.4. After the fade out, return to the main menu    
    * 4.5. Any key or mouse click will return to the main menu    
* 5. Glass Casual Gamer Theme    
    * 5.1. A detailed description of the theme, the way it looks, feels, and behaves it outlined.    
        * 5.1.1. Colors are outlined    
        * 5.1.2. Typography is outlined    
        * 5.1.3. Common UI elements are outlined    
        * 5.1.4. Transitions are outlined    
        * 5.1.5. Interactions are outlined    
        * 5.1.6. Visual states are outlined    
        * 5.1.7. Responsive behavior is outlined    
        * 5.1.8. Performance is outlined    
        * 5.1.9. Accessibility is outlined    
    * 5.2. The theme is responsive and adaptive    
        * 5.2.1. The theme is designed for desktop    
        * 5.2.2. The theme is designed for mobile    
        * 5.2.3. The theme is designed for tablet    
    * 5.3. The documentation is maintained in /docs/theme.md    



---

<a name="environment-specification"></a>

## Environment Specification  

* 1. NodeJS    
    * 1.1. Commands    
        * 1.1.1. npm run dev    
            * 1.1.1.1. Serve on port 8023    
        * 1.1.2. npm run test:unit    
            * 1.1.2.1. Run unit tests    
            * 1.1.2.2. Measure code coverage    
            * 1.1.2.3. Generate test report    
        * 1.1.3. npm run test:e2e:headless    
            * 1.1.3.1. Run end-to-end tests headless    
            * 1.1.3.2. Generate test report    
        * 1.1.4. npm run test:e2e:headed    
            * 1.1.4.1. Run end-to-end tests headed    
            * 1.1.4.2. Generate test report    
        * 1.1.5. npm run build    
            * 1.1.5.1. Build for production    
            * 1.1.5.2. Minify assets    
            * 1.1.5.3. Generate production report    
        * 1.1.6. npm run lint    
            * 1.1.6.1. Run ESLint and report    
        * 1.1.7. npm run lint:fix    
            * 1.1.7.1. Run ESLint and fix    
        * 1.1.8. npm run format    
            * 1.1.8.1. Run Prettier and report    
        * 1.1.9. npm run format:fix    
            * 1.1.9.1. Run Prettier and fix    
        * 1.1.10. npm run spec    
            * 1.1.10.1. Run SPEC.md generator    
* 2. ESLint    
    * 2.1. Rules    
        * 2.1.1. Specific Rules    
            * 2.1.1.1. One react component per file    
            * 2.1.1.2. All components are organized    
                * 2.1.1.2.1. UI components must be in /src/components    
                * 2.1.1.2.2. Providers must be in /src/providers    
                * 2.1.1.2.3. All components must be in a folder of the same name and exported by an index.ts file    
            * 2.1.1.3. Hooks must be in /src/hooks    
                * 2.1.1.3.1. All hooks must be in a folder of the same name and exported by an index.ts file    
            * 2.1.1.4. Utilities must be in /src/utils    
                * 2.1.1.4.1. All utilities must be in a folder of the same name and exported by an index.ts file    
        * 2.1.2. All custom ESLint rules must be unit tested    
            * 2.1.2.1. All custom ESLint rules must be in .eslint-rules/    
            * 2.1.2.2. Each eslint rule must have its own folder    
            * 2.1.2.3. Each eslint rule must have its tests written in its respective folder    
        * 2.1.3. ESLint rules may not be disabled    
        * 2.1.4. ESLint rules may not be ignored    
* 3. Vite    
* 4. PixiJS    
* 5. React    
* 6. Vitest    
* 7. Playwright    
* 8. TypeScript    
* 9. Prettier    
    * 9.1. Prettier is used for code formatting    
    * 9.2. Prettier is configured to use the React configuration    
    * 9.3. Prettier is configured to use the TypeScript configuration    
    * 9.4. Prettier is configured to use the Vite configuration    
    * 9.5. Custom prettier rules    
        * 9.5.1. spec.md files properly indent specifications by sub-section    
            * 9.5.1.1. indent using 4 spaces    
            * 9.5.1.2. do not use tabs    
            * 9.5.1.3. do not use extra spaces    
            * 9.5.1.4. do not use extra newlines    
            * 9.5.1.5. use two spaces at the end of each line for soft breaks    
* 10. Husky    
    * 10.1. Pre-commit hooks    
        * 10.1.1. Run ESLint and Fix    
        * 10.1.2. Run Prettier and Fix    
        * 10.1.3. Scripts    
            * 10.1.3.1. Run the [SPEC.md](Environment Specification.11) generator    
* 11. SPEC.md Generator    
    * 11.1. Dynamically reads all specification markdown files located in the specifications folder and creates a single top-level SPEC.md file    
        * 11.1.1. The SPEC.md file is created in the root of the project    
        * 11.1.2. The SPEC.md file is designed to look really good in a markdown viewer (specifically GitHub)    
        * 11.1.3. HTML is used to create a table of contents    



---

<a name="theme-specification"></a>

## Theme Specification  

* 1. Glass Casual Gamer Theme    
    * 1.1. The theme is defined in [/docs/theme.md](../docs/theme.md)    
    * 1.2. The theme is implemented as a React Design System    
        * 1.2.1. All design system components are located in /src/components/DesignSystem    
        * 1.2.2. Each component has its own folder and is exported by an index.ts file    
* 2. Color Palette    
    * 2.1. Core Colors    
        * 2.1.1. --bg-void is #050507    
        * 2.1.2. --bg-midnight is #0a0a0f    
        * 2.1.3. --bg-surface is #12121a    
        * 2.1.4. --bg-elevated is #1a1a24    
    * 2.2. Glass & Transparency    
        * 2.2.1. --glass-fill is rgba(255, 255, 255, 0.03)    
        * 2.2.2. --glass-fill-hover is rgba(255, 255, 255, 0.06)    
        * 2.2.3. --glass-border is rgba(255, 255, 255, 0.08)    
        * 2.2.4. --glass-blur is 12px    
    * 2.3. Accent Colors    
        * 2.3.1. --accent-primary is #8b5cf6 (Violet)    
        * 2.3.2. --accent-secondary is #ec4899 (Pink)    
        * 2.3.3. --accent-tertiary is #06b6d4 (Cyan)    
        * 2.3.4. --accent-success is #22c55e (Green)    
        * 2.3.5. --accent-warning is #f59e0b (Amber)    
        * 2.3.6. --accent-error is #ef4444 (Red)    
    * 2.4. Text Hierarchy    
        * 2.4.1. --text-primary is #ffffff    
        * 2.4.2. --text-secondary is #a1a1aa    
        * 2.4.3. --text-muted is #52525b    
        * 2.4.4. --text-inverse is #09090b    
* 3. Typography    
    * 3.1. Font Stack    
        * 3.1.1. --font-display is Outfit, Inter, system-ui, sans-serif    
        * 3.1.2. --font-body is Inter, system-ui, sans-serif    
        * 3.1.3. --font-mono is JetBrains Mono, Fira Code, monospace    
    * 3.2. Type Scale    
        * 3.2.1. Hero is clamp(4rem, 12vw, 8rem) weight 800    
        * 3.2.2. Title is clamp(2rem, 6vw, 4rem) weight 700    
        * 3.2.3. Heading is 1.5rem weight 600    
        * 3.2.4. Subheading is 1.125rem weight 500    
        * 3.2.5. Body is 1rem weight 400    
        * 3.2.6. Caption is 0.875rem weight 400    
        * 3.2.7. Overline is 0.75rem weight 600    
* 4. Design System Components    
    * 4.1. Button    
        * 4.1.1. Variant: Primary    
        * 4.1.2. Variant: Secondary    
        * 4.1.3. Variant: Ghost    
        * 4.1.4. Supports disabled state    
        * 4.1.5. Has hover, focus, and active states    
    * 4.2. GlassPanel    
        * 4.2.1. Uses backdrop blur    
        * 4.2.2. Has subtle border    
        * 4.2.3. Has configurable padding    
    * 4.3. Text    
        * 4.3.1. Variant: Hero    
        * 4.3.2. Variant: Title    
        * 4.3.3. Variant: Heading    
        * 4.3.4. Variant: Subheading    
        * 4.3.5. Variant: Body    
        * 4.3.6. Variant: Caption    
        * 4.3.7. Variant: Overline    
    * 4.4. MenuItem    
        * 4.4.1. Has hover state with translateX    
        * 4.4.2. Has focus-visible outline    
        * 4.4.3. Supports disabled state    
* 5. Transitions & Animations    
    * 5.1. Timing Functions    
        * 5.1.1. --ease-out-expo is cubic-bezier(0.16, 1, 0.3, 1)    
        * 5.1.2. --ease-in-out-quart is cubic-bezier(0.76, 0, 0.24, 1)    
        * 5.1.3. --spring is cubic-bezier(0.34, 1.56, 0.64, 1)    
    * 5.2. Screen Transitions    
        * 5.2.1. Fade In/Out is 2000ms ease-in-out    
        * 5.2.2. Menu Slide is 400ms --ease-out-expo    
        * 5.2.3. Modal Entrance is 300ms --spring    
    * 5.3. Keyframe Animations    
        * 5.3.1. fadeIn    
        * 5.3.2. fadeInUp    
        * 5.3.3. scaleIn    
        * 5.3.4. pulse    
        * 5.3.5. shimmer    
        * 5.3.6. float    
        * 5.3.7. glow    
* 6. Interactions    
    * 6.1. Hover States    
        * 6.1.1. Subtle background change    
        * 6.1.2. Slight lift with translateY(-2px)    
        * 6.1.3. Enhanced glow or shadow    
    * 6.2. Focus States    
        * 6.2.1. 2px outline in --accent-primary    
        * 6.2.2. 2px outline offset    
    * 6.3. Active/Pressed States    
        * 6.3.1. Scale down with scale(0.98)    
        * 6.3.2. Reduced shadow depth    
    * 6.4. Disabled States    
        * 6.4.1. opacity: 0.4    
        * 6.4.2. cursor: not-allowed    
        * 6.4.3. filter: grayscale(50%)    
* 7. Visual States    
    * 7.1. Loading    
        * 7.1.1. Skeleton loader with shimmer animation    
    * 7.2. Empty States    
        * 7.2.1. Centered layout with muted icon    
    * 7.3. Error States    
        * 7.3.1. --accent-error border    
        * 7.3.2. Shake animation on validation failure    
    * 7.4. Success States    
        * 7.4.1. Brief flash of --accent-success    
        * 7.4.2. Checkmark animation    
* 8. Responsive Behavior    
    * 8.1. Breakpoints    
        * 8.1.1. Mobile is less than 640px    
        * 8.1.2. Tablet is 640px to 1024px    
        * 8.1.3. Desktop is greater than 1024px    
    * 8.2. Mobile Adjustments    
        * 8.2.1. Single column layout    
        * 8.2.2. Larger touch targets (48px min)    
        * 8.2.3. Reduced blur (4px)    
* 9. Performance    
    * 9.1. GPU Acceleration    
        * 9.1.1. Use transform and opacity for animations    
        * 9.1.2. Avoid animating width, height, top, left    
    * 9.2. Animation Budget    
        * 9.2.1. Limit simultaneous animations to 3-4 elements    
        * 9.2.2. Respect prefers-reduced-motion    
* 10. Accessibility    
    * 10.1. Color Contrast    
        * 10.1.1. Text meets WCAG AA minimum (4.5:1 for body)    
        * 10.1.2. Large text meets 3:1 contrast    
    * 10.2. Motion Sensitivity    
        * 10.2.1. Respect prefers-reduced-motion    
        * 10.2.2. No flashing content (less than 3 flashes per second)    
    * 10.3. Keyboard Navigation    
        * 10.3.1. All interactive elements are focusable    
        * 10.3.2. Logical tab order    
        * 10.3.3. Visible focus indicators    



---

> [!NOTE]
> This file is autogenerated by `scripts/generate-spec.js` from files in the `specifications` directory.

# Scratch Dog

Scratch Dog is a modern, web-based implementation of the classic Dr. Mario puzzle game. It combines authentic gameplay mechanics with a sleek "Glass Casual Gamer" aesthetic, built using React and HTML5 Canvas. And yes, it was 100% vibe coded.  

## Features

### Core Gameplay
*   **Authentic Mechanics**: Faithful recreation of Dr. Mario rules, including:  
*   **Virus & Pill Matching**: Match 4 colors (Red, Yellow, Blue) to clear viruses.  
*   **Gravity & Physics**: Authentic fall speeds, locking delays, and cascade mechanics.  
*   **Level Progression**: Increasing difficulty with more viruses and faster speeds.  
*   **Scoring**: Classic scoring system with speed multipliers and combo bonuses.  
*   **Chain Reactions**: Mechanics for multi-step clears and cascading pills.  

### Modern Experience
*   **"Glass Casual Gamer" Theme**: A premium visual style featuring:  
*   Glassmorphism effects with translucent overlays.  
*   Smooth transitions and micro-animations.  
*   Vibrant, accessible color palettes.  
*   **Responsive UI**: Adaptive layout for desktop and tablet play.  
*   **Audio System**: comprehensive audio manager with:  
*   Separate controls for Master, Music, and SFX volume.  
*   Seamless track crossfading.  
*   Dynamic state management (pauses music when game pauses).  

## Controls

| Action | Key / Input |  
| :--- | :--- |  
| **Move Left** | `Left Arrow` |  
| **Move Right** | `Right Arrow` |  
| **Rotate CW** | `X` or `Up Arrow` |  
| **Rotate CCW** | `Z` |  
| **Soft Drop** | `Down Arrow` |  
| **Pause** | `Escape` |  
| **Menus** | Mouse Click |  

## Application Structure

### Screens
1. **Splash Screen**: Simple branded intro.  
2. **Main Menu**: Gateway to New Game, Continue, and Options.  
3. **Game Screen**: The main playing area with HUD and pause functionality.  
4. **Game Over**: Summary screen with quick restart options.  

### Technical Stack
*   **Frontend Framework**: React 18  
*   **Language**: TypeScript  
*   **Rendering**: HTML5 Canvas (for game grid), DOM (for UI overlays)  
*   **State Management**: React Hooks + Custom Game Engine  
*   **Build Tool**: Vite  
*   **Testing**: Playwright (E2E)  

## Development

### Setup
```bash  
npm install  
```  

### Run Locally
```bash  
npm run dev  
```  

### Run Tests
```bash  
# Run End-to-End tests
npm run test:e2e  
```  

## Specifications
This project strictly follows detailed specifications located in the `specifications/` and `drmario/` directories:  
*   [Full Specification](SPEC.md): A comprehensive document covering UI, Menus, Audio, Theme, and Game Mechanics.  


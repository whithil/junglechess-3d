# Jungle Chess 3D

Selva: O Jogo de Xadrez Animal. A 3D WebGL implementation of the classic Jungle Chess (Dou Shou Qi) board game, featuring local multiplayer, vs CPU, and WebRTC P2P multiplayer dynamics.

## Project Architecture

The application is built using standard web technologies (HTML/CSS/JS) and Three.js for 3D rendering. The codebase is organized into a modular architecture to separate concerns, ensure clean dependency management, and facilitate easier updates without breaking core functionality.

### Core Files

- **`index.html`**: The main entry point of the application. It contains the initial DOM structure, core CSS styles, the UI layout for the "Apps da Selva" smartphone overlay, and imports the root scripts (`src/ui.js` and `src/main.js`).
- **`sw.js`**: The Service Worker. Responsible for aggressively caching assets (HTML, scripts, SVG assets, and network libraries) to enable PWA offline capabilities and fast loading.
- **`title.js`**: Contains the Three.js logic to dynamically generate and animate the retro 3D "Jungle Chess 3D" logo in the main menu using `TextGeometry`.
- **`manifest.json`**: The standard Web App Manifest providing PWA descriptors (theme colors, icons, app name).

### System Modules (`src/`)

The core application logic is decoupled into specific domain modules:

- **`src/main.js`**: The heart of the application and primary WebGL orchestrator. It initializes the Three.js scene, cameras, renderers, lights, and XR sessions (AR/VR). It also sets up the WebRTC multiplayer P2P server (`peer.js`), handles the local AI/CPU move logic, and runs the main `requestAnimationFrame` render loop.
- **`src/engine.js`**: The pure rules engine. It contains the `GameEngine` class and exports all immutable game variables (`RANKS`, `TEAMS`, `TRAPS`, `WATER_TILES`, etc.). The engine knows nothing about the 3D scene; it strictly validates chess moves (water jumps, trap entries, piece-capturing logic), manages turns, and triggers easter egg states.
- **`src/ui.js`**: Houses the global HTML DOM event handlers. It controls the interactive "Smartphone" drawer states (`togglePhone`, `openPhoneTab`, etc.) allowing easy interaction between the HTML overlay and the user.
- **`src/audio.js`**: The Procedural Web Audio engine. It synthesizes sound effects natively in the browser (splashes, jumps, buzzes, win jingles) using mathematical oscillators and filters, eliminating the need to load external `.mp3` files.
- **`src/i18n.js`**: Internationalization loader. It fetches the appropriate YAML language dictionary (`lang/pt-BR.yml` or `lang/en-US.yml`), parses it, and injects a global `window.i18n()` translation helper into the scope to localize all UI and console text.

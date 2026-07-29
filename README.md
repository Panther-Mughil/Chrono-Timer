# Chrono-Timer

Chrono-Timer is a gamified focus timer application designed to boost your productivity. Stay focused, earn coins for your dedicated time, and unlock awesome collectibles!

## Features
- ⏱️ **Custom Timers**: Create multiple timers of varying lengths to suit your workflow.
- ⏯️ **Full Control**: Start, pause, stop, edit, and delete timers with ease.
- 🪙 **Earn Rewards**: Earn 1 coin for every minute you focus.
- 🎁 **Collectibles Shop**: Spend your hard-earned coins to unlock exclusive items and build your collection.
- 🎨 **Premium UI**: Enjoy a modern, dark-mode minimalist interface that is fully responsive.
- 🪟 **Floating Mini Mode**: Instantly transform any timer into a borderless, "Always-on-Top" floating widget using native OS APIs.
- 💾 **Persistent Storage**: Your timers, coins, and unlocked shop items are automatically saved securely.

## Tech Stack
- **Frontend**: React (TypeScript) + Vite
- **Backend/Desktop Integration**: Tauri v2
- **State Management**: Zustand (with local storage persistence)
- **Styling**: Vanilla CSS (Flexbox, CSS Grid) with Lucide Icons

## Getting Started
To run the app locally in development mode:

1. **Prerequisites**: Ensure you have Node.js and the Tauri v2 prerequisites installed (Rust, Visual Studio Build Tools, WebView2 on Windows).
2. **Install Dependencies**:
   ```bash
   npm install
   ```
3. **Run the Application**:
   Simply run the included batch script to launch the app:
   ```cmd
   start.bat
   ```
   Select either the browser web preview or the fully native desktop application mode.

## Roadmap
- [x] Initial Project Setup
- [x] UI/UX Design System Implementation (Dark Mode)
- [x] Timer Logic and State Management (Zustand)
- [x] Rewards and Coin Economy (1 coin/min)
- [x] Collectibles Shop Integration
- [x] Floating Mini Window (Always on Top)
- [ ] Cross-Platform Mobile Deployment (Android, iOS)
- [ ] Add Custom Collectible Images (currently using placeholders/emojis)

# PongBuddy 🏆

PongBuddy is a modern, beautifully designed web application for creating and managing custom round-robin and knockout tournaments. With a focus on a glassmorphic, dark-mode aesthetic, PongBuddy abstracts the complexity of tournament brackets into a simple, interactive UI.

## Features ✨

*   **Custom Tournaments**: Create tournaments with any number of players and teams.
*   **Flexible Team Setup**: Automatically generate random teams or manually assign players. Give teams custom names and fun emojis!
*   **Dynamic Knockout Brackets**: The app intelligently handles any number of teams. If the team count isn't a perfect power of two, it automatically generates a clean "Knockout Phase" play-in round to reduce the field.
*   **Interactive Match Resolution**: Click on active matches to launch a glowing modal and declare the winner. The bracket updates and advances teams automatically.
*   **Local Storage Persistence**: Your active tournament state and history are saved automatically in your browser. Leave the page and come back right where you left off.
*   **Tournament History**: View a read-only archive of all your completed tournaments.

## Tech Stack 🛠️

*   **Frontend Framework**: React 18
*   **Build Tool**: Vite
*   **Styling**: Vanilla CSS (CSS Variables, Flexbox, CSS Grid) with a modern Glassmorphism design system.
*   **State Management**: React Context API (`TournamentContext`) and custom `useLocalStorage` hooks.

## Running Locally 🚀

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/xanoahax/matchify.io.git
    cd matchify.io
    ```
2.  **Install dependencies**:
    ```bash
    npm install
    ```
3.  **Start the development server**:
    ```bash
    npm run dev
    ```
4.  Open `http://localhost:5173` in your browser.

## Design Philosophy 🎨

Matchify was built with a strong emphasis on visual excellence. It features:
*   Fluid hover states and micro-animations.
*   A responsive bracket tree that smoothly scales from desktop down to mobile.
*   A curated dark-mode color palette (`--bg-dark`) with vibrant accents (`--accent-color`).
*   Semantic coloring (Green for winners, Red, faded opacity for losers).


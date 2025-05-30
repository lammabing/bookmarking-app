# Codebase Summary

## Project Structure Overview
The project is organized into a root directory containing configuration files, server-side code, and the frontend application within the `src/` directory.
*   `/`: Contains project configuration files (`package.json`, `vite.config.js`, `tailwind.config.js`, etc.), the backend server entry point (`server.js`), and documentation.
*   `src/`: Contains the frontend React application.
    *   `src/App.jsx`: The main application component.
    *   `src/components/`: Reusable React components for UI elements (forms, grids, search bar, font settings).
    *   `src/utils/`: Utility functions for various tasks (database interaction, metadata fetching, font settings, import/export).
*   `documentation/`: Contains project documentation files.

## Key Abstractions
*   **Bookmark:** Represents a saved bookmark with properties like URL, title, description, tags, and timestamps.
*   **API Endpoints:** RESTful endpoints in `server.js` for managing bookmarks (GET, POST, PUT, DELETE).
*   **React Components:** Modular components in `src/components/` for building the user interface.
*   **Utility Functions:** Helper functions in `src/utils/` for specific functionalities.

## Complete List of Project Dependencies
*   **Dependencies:** `autoprefixer`, `cors`, `dotenv`, `express`, `lucide-react`, `mongoose`, `postcss`, `react`, `react-dom`, `tailwindcss`
*   **Dev Dependencies:** `@vitejs/plugin-react`, `concurrently`, `vite`

## Modules
*   **Backend Module (`server.js`):** Handles API requests, interacts with the MongoDB database using Mongoose, and serves the frontend application.
*   **Frontend Module (`src/`):** The React application that provides the user interface for managing bookmarks. It consumes the backend API.
*   **Components Module (`src/components/`):** Provides reusable UI components used in the frontend.
*   **Utilities Module (`src/utils/`):** Contains helper functions used across the frontend and potentially the backend.

## Recent Changes
*   Modified `server.js` to use the `MONGODB_URI` environment variable from the `.env` file for the MongoDB connection.
*   Added a `title` attribute with the value "🔖" to the bookmarklet link in `src/App.jsx` to set the text label on the browser toolbar.

---
Last Updated: 5/23/2025, 11:54:43 AM
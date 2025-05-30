# Technology Stack

## Chosen Technologies, Framework, and Architecture
*   **Frontend:** React, Vite
*   **Backend:** Node.js, Express
*   **Database:** MongoDB
*   **Architecture:** Client-server (Frontend interacts with Backend API, Backend interacts with MongoDB)

## Module Dependencies
*   **Dependencies:**
    *   `autoprefixer`: ^10.4.0 (PostCSS plugin to add vendor prefixes)
    *   `cors`: ^2.8.5 (Middleware for enabling CORS)
    *   `dotenv`: ^16.5.0 (Loads environment variables from a .env file)
    *   `express`: ^4.18.2 (Fast, unopinionated, minimalist web framework for Node.js)
    *   `lucide-react`: ^0.100.0 (Lucide icons for React)
    *   `mongoose`: ^8.0.3 (MongoDB object modeling tool)
    *   `postcss`: ^8.4.0 (Tool for transforming CSS with JavaScript)
    *   `react`: ^18.2.0 (JavaScript library for building user interfaces)
    *   `react-dom`: ^18.2.0 (React package for working with the DOM)
    *   `tailwindcss`: ^3.3.0 (A utility-first CSS framework)
*   **Dev Dependencies:**
    *   `@vitejs/plugin-react`: ^3.0.0 (Vite plugin for React)
    *   `concurrently`: ^8.2.2 (Run multiple commands concurrently)
    *   `vite`: ^4.0.0 (Next Generation Frontend Tooling)

## Data Source(s)
*   MongoDB database

## Data Structures
*   Bookmarks are stored as documents in MongoDB, following the `bookmarkSchema` defined in `server.js`.

## Database and Table Schema
*   **Database:** `bookmarking-app`
*   **Collection:** `bookmarks`
*   **Schema:**
    *   `url`: String, required
    *   `title`: String, required
    *   `description`: String
    *   `tags`: Array of Strings
    *   `favicon`: String
    *   `createdAt`: Date, default: Date.now
    *   `updatedAt`: Date, default: Date.now

## API Schema
*   **Bookmark Object:**
    *   `_id`: String (MongoDB ObjectId)
    *   `url`: String
    *   `title`: String
    *   `description`: String (optional)
    *   `tags`: Array of Strings (optional)
    *   `favicon`: String (optional)
    *   `createdAt`: Date
    *   `updatedAt`: Date

## API Endpoints
*   `GET /api/bookmarks`: Get all bookmarks.
*   `GET /api/bookmarks/:id`: Get a single bookmark by ID.
*   `POST /api/bookmarks`: Add a new bookmark or an array of bookmarks.
*   `PUT /api/bookmarks/:id`: Update a bookmark by ID.
*   `DELETE /api/bookmarks/:id`: Delete a bookmark by ID.

---
Last Updated: 5/23/2025, 11:54:28 AM
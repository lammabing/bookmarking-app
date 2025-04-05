# Bookmarking App

A web-based application for managing bookmarks with features for adding, organizing, and searching bookmarks.

## Features

- Add new bookmarks with metadata
- Organize bookmarks into categories
- Search functionality
- Font customization options
- Import/export capabilities

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/lammabing/bookmarking-app.git
   cd bookmarking-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure docker mongodb instance. Edit docker-compose.yml. Then run:
   ```bash
   docker compose up -d
   ```
4. Start the development server:
   ```bash
   npm start
   ```

## Project Structure

```
src/
  App.jsx          # Main application component
  components/      # Reusable UI components
    AddBookmarkForm.jsx
    BookmarkGrid.jsx
    EditBookmarkForm.jsx
    FontSettings.jsx
    FontSettingsModal.jsx
    SearchBar.jsx
  utils/           # Utility functions
    db.js           # Database interactions
    fetchMetadata.js # Metadata fetching logic
    fontSettings.js  # Font customization handling
    importBookmarks.js # Import/export functionality
```

## Contributing

Contributions are welcome! Fork the repository, make your changes, and submit a pull request.

## License

[Your License Here]

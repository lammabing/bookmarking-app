# Bookmarking App

The Bookmarking App is a web application designed to help users save, organize, and manage their bookmarks efficiently. It provides a user-friendly interface for adding, editing, and deleting bookmarks, along with advanced features like search, tagging, and font customization.

## Key Features

- **Bookmark Management**: Add, edit, and delete bookmarks with ease.
- **Search Functionality**: Quickly find bookmarks using keywords, tags, or descriptions.
- **Tagging System**: Organize bookmarks with custom tags.
- **Font Customization**: Customize the appearance of bookmark titles and descriptions.
- **Bookmarklet**: Add bookmarks directly from any webpage using a bookmarklet.
- **Import/Export**: Import and export bookmarks in JSON format.
- **Responsive Design**: Works seamlessly on both desktop and mobile devices.

## Program Requisites

To run the Bookmarking App, you need the following:

- **Node.js**: Ensure you have Node.js installed on your machine. You can download it from [here](https://nodejs.org/).
- **MongoDB**: The app uses MongoDB as its database. You can either install MongoDB locally or use Docker to run a MongoDB container.

## Usage Instructions

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/lammabing/bookmarking-app.git
   ```
2. Navigate to the project directory:
   ```bash
   cd bookmarking-app
   ```
3. Install the dependencies:
   ```bash
   npm install
   ```

### Running MongoDB with Docker

1. Ensure Docker is installed on your machine. You can download it from [here](https://www.docker.com/).
2. Create a directory for MongoDB persistent storage:
   ```bash
   mkdir -p /home/username/docker-mongodb
   ```
3. Start the MongoDB container using Docker Compose:
   ```bash
   docker-compose up -d
   ```
4. Verify that the MongoDB container is running:
   ```bash
   docker ps
   ```

### Running the App

1. Start the development server:
   ```bash
   npm run start
   npm run dev
   ```
2. Open your browser and navigate to `http://localhost:5170` to access the app.

### Adding a Bookmark

1. Click on the "Add Bookmark" button.
2. Enter the URL, title, description, and tags for the bookmark.
3. Click "Add Bookmark" to save it.

### Searching for a Bookmark

1. Use the search bar at the top of the page.
2. Enter keywords, tags, or descriptions to filter the bookmarks.

### Editing a Bookmark

1. Click on the "Edit" button next to the bookmark you want to modify.
2. Update the details and click "Save" to apply the changes.

### Deleting a Bookmark

1. Click on the "Delete" button next to the bookmark you want to remove.
2. Confirm the deletion when prompted.

### Using the Bookmarklet

1. Drag the "Bookmarklet" button to your bookmarks bar.
2. When you find a page you want to bookmark, click the bookmarklet in your bookmarks bar.
3. The bookmark will be added to your list automatically.

### Importing/Exporting Bookmarks

1. To import bookmarks, click on the "Import" button and select a JSON file.
2. To export bookmarks, click on the "Copy" button to copy the bookmarks to your clipboard in JSON format.

## Examples

### Adding a Bookmark

```json
{
  "url": "https://example.com",
  "title": "Example Website",
  "description": "This is an example website.",
  "tags": ["example", "website"]
}
```

### Searching for a Bookmark

- **Keyword Search**: Enter "example" to find all bookmarks containing the word "example".
- **Tag Search**: Enter "#website" to find all bookmarks tagged with "website".

### Editing a Bookmark

```json
{
  "url": "https://example.com",
  "title": "Updated Example Website",
  "description": "This is an updated example website.",
  "tags": ["updated", "example", "website"]
}
```

### Deleting a Bookmark

- Click the "Delete" button next to the bookmark titled "Example Website".

### Using the Bookmarklet

1. Navigate to `https://example.com`.
2. Click the bookmarklet in your bookmarks bar.
3. The bookmark will be added to your list with the title "Example Website" and the URL `https://example.com`.

### Importing/Exporting Bookmarks

- **Import**: Select a JSON file containing bookmarks to add them to your list.
- **Export**: Click the "Copy" button to copy all bookmarks to your clipboard in JSON format.

## Contributing

Contributions are welcome! Please read the [CONTRIBUTING.md](CONTRIBUTING.md) file for details on how to get started.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- **Tailwind CSS**: For the utility-first CSS framework.
- **React**: For the JavaScript library used to build the user interface.
- **MongoDB**: For the NoSQL database used to store bookmarks.
- **Express**: For the web framework used to build the backend.

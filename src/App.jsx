import React, { useState, useEffect } from 'react';
import BookmarkGrid from './components/BookmarkGrid';
import SearchBar from './components/SearchBar';
import AddBookmarkForm from './components/AddBookmarkForm';
import FontSettingsModal from './components/FontSettingsModal';
import { loadFontSettings, saveFontSettings } from './utils/fontSettings';
import { Settings, Grid, List, Copy, Upload, Bookmark as BookmarkIcon } from 'lucide-react';

const API_URL = 'http://localhost:5015/api/bookmarks';

const App = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const [filteredBookmarks, setFilteredBookmarks] = useState([]);
  const [viewMode, setViewMode] = useState('grid');
  const [initialFormData, setInitialFormData] = useState(null);
  const [fontSettings, setFontSettings] = useState({
    titleFontFamily: 'Arial',
    titleFontSize: 16,
    titleFontWeight: 'bold',
    titleFontColor: '#000000',
    descriptionFontFamily: 'Arial',
    descriptionFontSize: 14,
    descriptionFontWeight: 'normal',
    descriptionFontColor: '#333333',
  });
  const [isFontSettingsModalOpen, setIsFontSettingsModalOpen] = useState(false);
  const [hoverText, setHoverText] = useState('');

  // Load font settings on mount
  useEffect(() => {
    const savedSettings = loadFontSettings();
    if (savedSettings) {
      setFontSettings(savedSettings);
    }
  }, []);

  // Save font settings when they change
  useEffect(() => {
    saveFontSettings(fontSettings);
  }, [fontSettings]);

  // Fetch bookmarks from the backend
  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        const response = await fetch(API_URL);
        const data = await response.json();
        setBookmarks(data);
        setFilteredBookmarks(data);
      } catch (error) {
        console.error('Error fetching bookmarks:', error);
      }
    };
    fetchBookmarks();
  }, []);

  // Handle bookmarklet data
  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const url = queryParams.get('url');
    const title = queryParams.get('title');
    const description = queryParams.get('description');
    const favicon = queryParams.get('favicon');

    if (url) {
      setInitialFormData({
        url,
        title: title || 'Untitled',
        description: description || '',
        favicon: favicon || `https://www.google.com/s2/favicons?domain=${new URL(url).hostname}`,
      });

      // Clear the query parameters after processing
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  // Add a new bookmark
  const handleAddBookmark = async (bookmark) => {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookmark),
      });
      const savedBookmark = await response.json();
      setBookmarks([...bookmarks, savedBookmark]);
      setFilteredBookmarks([...bookmarks, savedBookmark]);
      setInitialFormData(null); // Clear initial form data after adding
    } catch (error) {
      console.error('Error adding bookmark:', error);
    }
  };

  // Edit a bookmark
  const handleEditBookmark = async (updatedBookmark) => {
    console.log('handleEditBookmark called with:', updatedBookmark);
    try {
      console.log(`Attempting PUT request to ${API_URL}/${updatedBookmark._id}`);
      const response = await fetch(`${API_URL}/${updatedBookmark._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedBookmark),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const savedBookmark = await response.json();
      console.log('PUT request successful, received:', savedBookmark);
      
      const updatedBookmarks = bookmarks.map((bookmark) =>
        bookmark._id === savedBookmark._id ? savedBookmark : bookmark
      );
      setBookmarks(updatedBookmarks);
      setFilteredBookmarks(updatedBookmarks);
    } catch (error) {
      console.error('Error updating bookmark:', error);
      alert('Failed to update bookmark. Please try again.');
    }
  };

  // Delete a bookmark
  const handleDeleteBookmark = async (id) => {
    try {
      await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
      });
      const updatedBookmarks = bookmarks.filter((bookmark) => bookmark._id !== id);
      setBookmarks(updatedBookmarks);
      setFilteredBookmarks(updatedBookmarks);
    } catch (error) {
      console.error('Error deleting bookmark:', error);
    }
  };

  // Search bookmarks
  const handleSearch = (query) => {
    const filtered = bookmarks.filter(
      (bookmark) =>
        bookmark.title.toLowerCase().includes(query.toLowerCase()) ||
        bookmark.description.toLowerCase().includes(query.toLowerCase()) ||
        bookmark.tags.some((tag) => tag.toLowerCase().includes(query.toLowerCase()))
    );
    setFilteredBookmarks(filtered);
  };

  // Toggle view mode
  const toggleViewMode = () => {
    setViewMode((prevMode) => (prevMode === 'grid' ? 'list' : 'grid'));
  };

  // Apply font settings
  const handleApplyFontSettings = (settings) => {
    setFontSettings(settings);
  };

  // Copy filtered bookmarks to clipboard as JSON
  const handleCopyBookmarks = () => {
    const jsonString = JSON.stringify(filteredBookmarks, null, 2);
    navigator.clipboard.writeText(jsonString)
      .then(() => {
        alert('Filtered bookmarks copied to clipboard!');
      })
      .catch((err) => {
        console.error('Failed to copy bookmarks:', err);
        alert('Failed to copy bookmarks to clipboard.');
      });
  };

  // Import bookmarks from a JSON file
  const handleImportBookmarks = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const importedBookmarks = JSON.parse(e.target.result);

        // Validate the imported data
        if (!Array.isArray(importedBookmarks)) {
          throw new Error('Invalid file format: Expected an array of bookmarks.');
        }

        // Process each bookmark
        const processedBookmarks = importedBookmarks.map((bookmark) => ({
          ...bookmark,
          favicon: `https://www.google.com/s2/favicons?domain=${new URL(bookmark.url).hostname}`,
        }));

        // Add the processed bookmarks to the database
        const response = await fetch(API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(processedBookmarks),
        });

        const savedBookmarks = await response.json();
        setBookmarks([...bookmarks, ...savedBookmarks]);
        setFilteredBookmarks([...bookmarks, ...savedBookmarks]);

        alert('Bookmarks imported successfully!');
      } catch (error) {
        console.error('Error importing bookmarks:', error);
        alert('Failed to import bookmarks. Please check the file format.');
      }
    };
    reader.readAsText(file);
  };

  const bookmarkletCode = `javascript:(function() {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(document.title);
    const description = encodeURIComponent(window.getSelection().toString().trim() || '');
    const favicon = encodeURIComponent(document.querySelector('link[rel*="icon"]')?.href || \`https://www.google.com/s2/favicons?domain=\${window.location.hostname}\`);
    const appUrl = \`http://localhost:5170/add?url=\${url}&title=\${title}&description=\${description}&favicon=\${favicon}\`;
    window.open(appUrl, '_blank');
  })();`;

  return (
    <div className="p-2">
      <h1 className="text-xl font-bold mb-4">Web Bookmarking App</h1>
      <AddBookmarkForm onAdd={handleAddBookmark} initialData={initialFormData} />
      <div className="flex items-center space-x-2 mb-4">
        {/* Appearance Button */}
        <button
          onClick={() => setIsFontSettingsModalOpen(true)}
          onMouseEnter={() => setHoverText('Appearance')}
          onMouseLeave={() => setHoverText('')}
          className="p-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 flex items-center justify-center w-10 h-10"
        >
          <Settings size={24} />
        </button>

        {/* Switch View Button */}
        <button
          onClick={toggleViewMode}
          onMouseEnter={() => setHoverText(viewMode === 'grid' ? 'List View' : 'Grid View')}
          onMouseLeave={() => setHoverText('')}
          className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center justify-center w-10 h-10"
        >
          {viewMode === 'grid' ? <List size={24} /> : <Grid size={24} />}
        </button>

        {/* Copy Bookmarks Button */}
        <button
          onClick={handleCopyBookmarks}
          onMouseEnter={() => setHoverText('Copy Bookmarks')}
          onMouseLeave={() => setHoverText('')}
          className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center justify-center w-10 h-10"
        >
          <Copy size={24} />
        </button>

        {/* Import Bookmarks Button */}
        <label
          onMouseEnter={() => setHoverText('Import Bookmarks')}
          onMouseLeave={() => setHoverText('')}
          className="p-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 flex items-center justify-center w-10 h-10 cursor-pointer"
        >
          <Upload size={24} />
          <input
            type="file"
            accept=".json"
            onChange={handleImportBookmarks}
            className="hidden"
          />
        </label>

        {/* Bookmarklet Button */}
        <a
          href={bookmarkletCode}
          title="🔖"
          draggable="true"
          onMouseEnter={() => setHoverText('Drag to Bookmark Bar')}
          onMouseLeave={() => setHoverText('')}
          className="p-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 flex items-center justify-center w-10 h-10"
        >
          <BookmarkIcon size={24} />
        </a>

        {/* Hover Text Box */}
        <div className="flex-1 ml-2">
          <input
            type="text"
            value={hoverText}
            readOnly
            className="w-full p-2 border rounded-lg bg-gray-100 text-gray-700"
            placeholder="Hover over a button for info"
          />
        </div>
      </div>
      <SearchBar onSearch={handleSearch} />
      <FontSettingsModal
        isOpen={isFontSettingsModalOpen}
        onClose={() => setIsFontSettingsModalOpen(false)}
        onApply={handleApplyFontSettings}
        initialSettings={fontSettings}
      />
      <BookmarkGrid
        bookmarks={filteredBookmarks}
        onDelete={handleDeleteBookmark}
        onEdit={handleEditBookmark}
        viewMode={viewMode}
        fontSettings={fontSettings}
      />
    </div>
  );
};

export default App;

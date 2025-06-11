import React, { useState, useEffect } from 'react';
import BookmarkGrid from './components/BookmarkGrid';
import SearchBar from './components/SearchBar';
import AddBookmarkForm from './components/AddBookmarkForm';
import FontSettingsModal from './components/FontSettingsModal';
import TagManager from './components/TagManager'; // Import TagManager
import { loadFontSettings, saveFontSettings } from './utils/fontSettings';
import { Settings, Grid, List, Copy, Upload, Bookmark as BookmarkIcon, Tags } from 'lucide-react'; // Import Tags icon
import AuthModal from './components/Auth/AuthModal';
import { LogIn, LogOut, User } from 'lucide-react';
import api from './utils/api';

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
  const [isTagManagerOpen, setIsTagManagerOpen] = useState(false); // State for TagManager visibility
  const [hoverText, setHoverText] = useState('');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

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
    console.log('Fetching bookmarks... currentUser:', currentUser);
    const fetchBookmarks = async () => {
      try {
        const { data } = await api.get('/bookmarks');
        console.log('Fetched bookmarks:', data.length);
        setBookmarks(data);
        setFilteredBookmarks(data);
      } catch (error) {
        console.error('Error fetching bookmarks:', error);
        if (error.response) {
          console.error('Response data:', error.response.data);
          console.error('Response status:', error.response.status);
        }
      }
    };
    fetchBookmarks();
  }, [currentUser]); // Refetch when currentUser changes

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
      const { data } = await api.post('/bookmarks', bookmark);
      setBookmarks([...bookmarks, data]);
      setFilteredBookmarks([...bookmarks, data]);
      setInitialFormData(null); // Clear initial form data after adding
    } catch (error) {
      console.error('Error adding bookmark:', error);
    }
  };

  // Edit a bookmark
  const handleEditBookmark = async (updatedBookmark) => {
    try {
      const { data } = await api.put(`/bookmarks/${updatedBookmark._id}`, updatedBookmark);
      
      const updatedBookmarks = bookmarks.map((bookmark) =>
        bookmark._id === data._id ? data : bookmark
      );
      setBookmarks(updatedBookmarks);
      setFilteredBookmarks(updatedBookmarks);
    } catch (error) {
      console.error('Error updating bookmark:', error);
      alert(`Failed to update bookmark: ${error.response?.data?.message || error.message}`);
    }
  };

  // Delete a bookmark
  const handleDeleteBookmark = async (id) => {
    try {
      await api.delete(`/bookmarks/${id}`);
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
        const { data } = await api.post('/bookmarks', processedBookmarks);
        setBookmarks([...bookmarks, ...data]);
        setFilteredBookmarks([...bookmarks, ...data]);

        alert('Bookmarks imported successfully!');
      } catch (error) {
        console.error('Error importing bookmarks:', error);
        alert(`Failed to import bookmarks: ${error.response?.data?.message || error.message}`);
      }
    };
    reader.readAsText(file);
  };

  const bookmarkletCode = `javascript:(function() {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(document.title);
    const description = encodeURIComponent(window.getSelection().toString().trim() || '');
    const favicon = encodeURIComponent(document.querySelector('link[rel*="icon"]')?.href || \`https://www.google.com/s2/favicons?domain=\${window.location.hostname}\`);
    const appUrl = \`http://localhost:5173/add?url=\${url}&title=\${title}&description=\${description}&favicon=\${favicon}\`;
    window.open(appUrl, '_blank');
  })();`;

  const handleLogin = (user) => {
    setCurrentUser(user);
  };
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setCurrentUser(null);
  };
  
  const authButton = currentUser ? (
    <div className="flex items-center">
      <span className="mr-2 text-sm hidden md:inline">
        {currentUser.username}
      </span>
      <button
        onClick={handleLogout}
        className="flex items-center text-sm bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
      >
        <LogOut size={16} className="mr-1" />
        <span className="hidden md:inline">Logout</span>
      </button>
    </div>
  ) : (
    <button
      onClick={() => setIsAuthModalOpen(true)}
      className="flex items-center text-sm bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
    >
      <LogIn size={16} className="mr-1" />
      <span className="hidden md:inline">Login / Register</span>
    </button>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Bookmarking App</h1>
        {authButton}
      </header>
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

        {/* Tag Manager Button */}
        <button
          onClick={() => setIsTagManagerOpen(prev => !prev)}
          onMouseEnter={() => setHoverText('Manage Tags')}
          onMouseLeave={() => setHoverText('')}
          className="p-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 flex items-center justify-center w-10 h-10"
        >
          <Tags size={24} />
        </button>

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
      {isTagManagerOpen && (
        <div className="my-4">
          <TagManager />
        </div>
      )}
      <BookmarkGrid
        bookmarks={filteredBookmarks}
        onDelete={handleDeleteBookmark}
        onEdit={handleEditBookmark}
        viewMode={viewMode}
        fontSettings={fontSettings}
      />
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuth={handleLogin}
      />
    </div>
  );
};

export default App;

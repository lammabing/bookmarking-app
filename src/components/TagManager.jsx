import React, { useState, useEffect, useCallback } from 'react';

const TagManager = () => {
  const [tags, setTags] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editingTag, setEditingTag] = useState(null); // { name: string, count: number }
  const [newTagName, setNewTagName] = useState('');

  const fetchTags = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/tags');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setTags(data);
    } catch (e) {
      setError(e.message);
      console.error("Error fetching tags:", e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTags();
  }, [fetchTags]);

  const handleRename = async (oldName) => {
    if (!newTagName.trim()) {
      alert("New tag name cannot be empty.");
      return;
    }
    if (oldName === newTagName.trim()) {
      alert("New tag name cannot be the same as the old one.");
      setEditingTag(null);
      setNewTagName('');
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch(`/api/tags/${encodeURIComponent(oldName)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newName: newTagName.trim() }),
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || `HTTP error! status: ${response.status}`);
      }
      alert(result.message || 'Tag renamed successfully!');
      setEditingTag(null);
      setNewTagName('');
      fetchTags(); // Refresh tags list
    } catch (e) {
      setError(e.message);
      alert(`Error renaming tag: ${e.message}`);
      console.error("Error renaming tag:", e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (tagName) => {
    if (!window.confirm(`Are you sure you want to delete the tag "${tagName}"? This will remove it from all associated bookmarks.`)) {
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch(`/api/tags/${encodeURIComponent(tagName)}`, {
        method: 'DELETE',
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || `HTTP error! status: ${response.status}`);
      }
      alert(result.message || 'Tag deleted successfully!');
      fetchTags(); // Refresh tags list
    } catch (e) {
      setError(e.message);
      alert(`Error deleting tag: ${e.message}`);
      console.error("Error deleting tag:", e);
    } finally {
      setIsLoading(false);
    }
  };

  const startEdit = (tag) => {
    setEditingTag(tag);
    setNewTagName(tag.name);
  };

  const cancelEdit = () => {
    setEditingTag(null);
    setNewTagName('');
  };

  if (isLoading && !tags.length) { // Show loading only on initial load or full refresh
    return <p>Loading tags...</p>;
  }

  if (error) {
    return <p className="text-red-500">Error loading tags: {error}</p>;
  }

  return (
    <div className="p-4 bg-gray-800 text-white rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Tag Management</h2>
      {tags.length === 0 && !isLoading && (
        <p>No tags found.</p>
      )}
      {tags.length > 0 && (
        <ul className="space-y-2">
          {tags.map((tag) => (
            <li key={tag.name} className="p-3 bg-gray-700 rounded flex justify-between items-center">
              {editingTag && editingTag.name === tag.name ? (
                <div className="flex-grow">
                  <input
                    type="text"
                    value={newTagName}
                    onChange={(e) => setNewTagName(e.target.value)}
                    className="bg-gray-600 text-white p-1 rounded mr-2 w-full md:w-auto"
                    autoFocus
                  />
                  <button onClick={() => handleRename(tag.name)} className="bg-green-500 hover:bg-green-600 px-3 py-1 rounded mr-2 text-sm" disabled={isLoading}>
                    Save
                  </button>
                  <button onClick={cancelEdit} className="bg-gray-500 hover:bg-gray-600 px-3 py-1 rounded text-sm" disabled={isLoading}>
                    Cancel
                  </button>
                </div>
              ) : (
                <div className="flex-grow">
                  <span className="font-medium">{tag.name}</span>
                  <span className="text-sm text-gray-400 ml-2">({tag.count} bookmarks)</span>
                </div>
              )}
              {!editingTag || editingTag.name !== tag.name ? (
                <div className="flex-shrink-0">
                  <button onClick={() => startEdit(tag)} className="bg-blue-500 hover:bg-blue-600 px-3 py-1 rounded mr-2 text-sm" disabled={isLoading || !!editingTag}>
                    Rename
                  </button>
                  <button onClick={() => handleDelete(tag.name)} className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-sm" disabled={isLoading || !!editingTag}>
                    Delete
                  </button>
                </div>
              ) : null}
            </li>
          ))}
        </ul>
      )}
      {isLoading && tags.length > 0 && <p className="mt-4">Processing...</p>}
    </div>
  );
};

export default TagManager;
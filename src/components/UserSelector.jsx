import React, { useState, useEffect } from 'react';
import { debounce } from '../utils/debounce';

const UserSelector = ({ selectedUsers, onChange }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Fetch users when search term changes
  useEffect(() => {
    const fetchUsers = async () => {
      if (!searchTerm.trim()) {
        setSearchResults([]);
        return;
      }
      
      setIsLoading(true);
      try {
        const response = await fetch('/api/users/shareable');
        if (!response.ok) throw new Error('Failed to fetch users');
        
        const allUsers = await response.json();
        
        // Filter users based on search term (case-insensitive)
        const filteredUsers = allUsers.filter(user => 
          user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
        
        setSearchResults(filteredUsers);
      } catch (err) {
        console.error('Error searching users:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    // Debounce search to avoid excessive requests
    const debouncedFetch = debounce(fetchUsers, 300);
    debouncedFetch();
    
    // Cleanup
    return () => debouncedFetch.cancel();
  }, [searchTerm]);
  
  const handleSelectUser = (user) => {
    if (!selectedUsers.some(u => u.id === user.id)) {
      onChange([...selectedUsers, user]);
    }
    setSearchTerm('');
    setSearchResults([]);
  };
  
  const handleRemoveUser = (userId) => {
    onChange(selectedUsers.filter(user => user.id !== userId));
  };
  
  return (
    <div className="user-selector">
      <div className="selected-users mb-2">
        {selectedUsers.map(user => (
          <div key={user.id} className="inline-flex items-center bg-blue-100 rounded-full px-3 py-1 text-sm mr-2 mb-2">
            <span>{user.username}</span>
            <button 
              type="button" 
              onClick={() => handleRemoveUser(user.id)}
              className="ml-2 text-blue-700 hover:text-blue-900"
            >
              ×
            </button>
          </div>
        ))}
      </div>
      
      <div className="relative">
        <input
          type="text"
          placeholder="Search users by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md"
        />
        
        {isLoading && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-blue-500"></div>
          </div>
        )}
        
        {searchResults.length > 0 && (
          <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md shadow-lg mt-1 max-h-60 overflow-auto">
            {searchResults.map(user => (
              <li 
                key={user.id} 
                onClick={() => handleSelectUser(user)}
                className="p-2 hover:bg-gray-100 cursor-pointer"
              >
                <div className="font-medium">{user.username}</div>
                <div className="text-sm text-gray-500">{user.email}</div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default UserSelector;
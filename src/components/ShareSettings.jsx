import React, { useState, useEffect } from 'react';
import UserSelector from './UserSelector';

const ShareSettings = ({ initialVisibility, initialSharedWith, onSettingsChange }) => {
  const [visibility, setVisibility] = useState(initialVisibility || 'private');
  const [sharedWith, setSharedWith] = useState(initialSharedWith || []);
  
  // Update parent when settings change
  useEffect(() => {
    onSettingsChange({ visibility, sharedWith });
  }, [visibility, sharedWith]);
  
  const handleVisibilityChange = (e) => {
    const newVisibility = e.target.value;
    setVisibility(newVisibility);
    
    // Clear sharedWith when switching to non-selected visibility
    if (newVisibility !== 'selected') {
      setSharedWith([]);
    }
  };
  
  return (
    <div className="share-settings">
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Visibility
        </label>
        <div className="flex space-x-4">
          {[
            { value: 'private', label: 'Private', icon: '🔒' },
            { value: 'public', label: 'Public', icon: '🌎' },
            { value: 'selected', label: 'Selected Users', icon: '👥' }
          ].map((option) => (
            <label key={option.value} className="flex items-center">
              <input
                type="radio"
                value={option.value}
                checked={visibility === option.value}
                onChange={handleVisibilityChange}
                className="sr-only"
              />
              <div className={`flex items-center px-3 py-2 rounded-lg cursor-pointer ${
                visibility === option.value 
                  ? 'bg-blue-100 border-blue-500 text-blue-700' 
                  : 'bg-gray-100 border-gray-300 text-gray-700'
              }`}>
                <span className="mr-1">{option.icon}</span>
                {option.label}
              </div>
            </label>
          ))}
        </div>
      </div>
      
      {visibility === 'selected' && (
        <div className="mt-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Share with users
          </label>
          <UserSelector 
            selectedUsers={sharedWith} 
            onChange={setSharedWith} 
          />
        </div>
      )}
    </div>
  );
};

export default ShareSettings;
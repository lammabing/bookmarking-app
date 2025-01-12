import React, { useState } from 'react';

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  const handleSearch = (e) => {
    const value = e.target.value;
    setQuery(value);
    onSearch(value);
  };

  return (
    <input
      type="text"
      placeholder="Search bookmarks..."
      value={query}
      onChange={handleSearch}
      className="w-full p-2 border rounded-lg mb-4"
    />
  );
};

export default SearchBar;

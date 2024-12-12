import React from 'react';
import './SearchBar.css';

const SearchBar = ({ handleSearch }) => {
  const onChange = (e) => {
    handleSearch(e.target.value);
  };

  return (
    <div className="search-bar">
      <input 
        type="text" 
        placeholder="Search users by name, email, or phone..." 
        onChange={onChange} 
      />
    </div>
  );
};

export default SearchBar;

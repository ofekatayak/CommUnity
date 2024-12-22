import React from "react";
import "./css/SearchBar.css";

interface SearchBarProps {
  placeholder?: string; // Optional placeholder text for the input field
  onSearch?: (value: string) => void; // Optional callback function triggered on input change
}

const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = "Search...", // Default placeholder text
  onSearch,
}) => {
  // Handle input changes and trigger the onSearch callback if provided
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (onSearch) {
      onSearch(event.target.value);
    }
  };

  return (
    <div className="search-bar">
      {/* Search input field */}
      <input
        type="text"
        className="search-bar-input"
        placeholder={placeholder}
        onChange={handleInputChange}
      />
    </div>
  );
};

export default SearchBar;

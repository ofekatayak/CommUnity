import React from "react";

interface SearchBarProps {
  placeholder?: string; // Optional placeholder text for the input field
  onSearch?: (value: string) => void; // Optional callback function triggered on input change
}

const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = "חיפוש...", // Default placeholder text (Hebrew)
  onSearch,
}) => {
  // Handle input changes and trigger the onSearch callback if provided
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (onSearch) {
      onSearch(event.target.value);
    }
  };

  return (
    <div className="flex items-center justify-center w-full" dir="rtl">
      {/* Search input field */}
      <input
        type="text"
        className="w-full max-w-md px-4 py-2 text-gray-800 bg-white border border-gray-300 rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 placeholder-gray-400 text-right"
        placeholder={placeholder}
        onChange={handleInputChange}
      />
    </div>
  );
};

export default SearchBar;

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
    <div className="w-full max-w-md mx-auto" dir="rtl">
      <div className="relative">
        {/* Search input field */}
        <input
          type="text"
          className="w-full px-4 py-2.5 text-gray-700 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 placeholder-gray-400 text-right pr-10 transition-all"
          placeholder={placeholder}
          onChange={handleInputChange}
        />

        {/* Search icon */}
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <svg
            className="w-5 h-5 text-gray-400"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;

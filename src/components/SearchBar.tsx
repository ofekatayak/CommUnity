// SearchBar.tsx - Enhanced Search Input Component with Autocomplete
import React, { useState, useRef, useEffect } from "react";

// Interface for search result items
interface SearchResultItem {
  id: string;
  name: string;
  type: "community" | "layer";
  displayName: string;
}

// Interface for component props
interface SearchBarProps {
  placeholder?: string; // Optional placeholder text for the input field
  onSearch?: (value: string) => void; // Optional callback function triggered on input change
  communities?: Array<{ name: string; color: string }>; // Available communities
  layers?: Array<{ key: string; name: string }>; // Available layers
  selectedCommunities?: string[]; // Currently selected communities
  selectedLayers?: string[]; // Currently selected layers
  onToggleCommunity?: (communityName: string) => void; // Callback for community selection
  onToggleLayer?: (layerKey: string) => void; // Callback for layer selection
}

const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = "חיפוש קהילות ושכבות מידע...", // Default placeholder text (Hebrew)
  onSearch,
  communities = [],
  layers = [],
  selectedCommunities = [],
  selectedLayers = [],
  onToggleCommunity,
  onToggleLayer,
}) => {
  // State management
  const [searchValue, setSearchValue] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<SearchResultItem[]>([]);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  // Refs for DOM manipulation
  const searchInputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Generate search results based on input
  const generateSearchResults = (input: string): SearchResultItem[] => {
    if (input.length < 1) return [];

    const results: SearchResultItem[] = [];
    const lowerInput = input.toLowerCase();

    // Search in communities
    communities.forEach((community) => {
      if (community.name.toLowerCase().includes(lowerInput)) {
        results.push({
          id: `community-${community.name}`,
          name: community.name,
          type: "community",
          displayName: community.name,
        });
      }
    });

    // Search in layers
    layers.forEach((layer) => {
      if (layer.name.toLowerCase().includes(lowerInput)) {
        results.push({
          id: `layer-${layer.key}`,
          name: layer.key,
          type: "layer",
          displayName: layer.name,
        });
      }
    });

    return results.slice(0, 8); // Limit to 8 results
  };

  // Handle input changes and update suggestions
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchValue(value);

    if (onSearch) {
      onSearch(value);
    }

    // Generate and display suggestions
    const newSuggestions = generateSearchResults(value);
    setSuggestions(newSuggestions);
    setShowSuggestions(newSuggestions.length > 0);
    setHighlightedIndex(-1);
  };

  // Handle suggestion selection
  const handleSuggestionClick = (suggestion: SearchResultItem) => {
    if (suggestion.type === "community" && onToggleCommunity) {
      onToggleCommunity(suggestion.name);
    } else if (suggestion.type === "layer" && onToggleLayer) {
      onToggleLayer(suggestion.name);
    }

    // Clear search and hide suggestions
    setSearchValue("");
    setShowSuggestions(false);
    setSuggestions([]);
  };

  // Handle keyboard navigation
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions || suggestions.length === 0) return;

    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        setHighlightedIndex((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case "ArrowUp":
        event.preventDefault();
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : prev));
        break;
      case "Enter":
        event.preventDefault();
        if (highlightedIndex >= 0 && highlightedIndex < suggestions.length) {
          handleSuggestionClick(suggestions[highlightedIndex]);
        }
        break;
      case "Escape":
        setShowSuggestions(false);
        setHighlightedIndex(-1);
        break;
    }
  };

  // Handle clicks outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        searchInputRef.current &&
        !searchInputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
        setHighlightedIndex(-1);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Check if item is selected
  const isItemSelected = (suggestion: SearchResultItem): boolean => {
    if (suggestion.type === "community") {
      return selectedCommunities.includes(suggestion.name);
    } else if (suggestion.type === "layer") {
      return selectedLayers.includes(suggestion.name);
    }
    return false;
  };

  // Render search icon
  const renderSearchIcon = () => (
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
  );

  // Render community icon
  const renderCommunityIcon = () => (
    <svg
      className="w-4 h-4 text-blue-500"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
    </svg>
  );

  // Render layer icon
  const renderLayerIcon = () => (
    <svg
      className="w-4 h-4 text-green-500"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
    </svg>
  );

  // Render checkmark icon for selected items
  const renderCheckIcon = () => (
    <svg
      className="w-4 h-4 text-green-600"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path
        fillRule="evenodd"
        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
        clipRule="evenodd"
      />
    </svg>
  );

  // Render individual suggestion item
  const renderSuggestionItem = (
    suggestion: SearchResultItem,
    index: number
  ) => {
    const isHighlighted = index === highlightedIndex;
    const isSelected = isItemSelected(suggestion);

    return (
      <div
        key={suggestion.id}
        className={`px-4 py-3 cursor-pointer flex items-center justify-between transition-colors ${
          isHighlighted
            ? "bg-indigo-50 border-l-2 border-indigo-500"
            : "hover:bg-gray-50"
        }`}
        onClick={() => handleSuggestionClick(suggestion)}
      >
        <div className="flex items-center gap-3">
          {/* Type Icon */}
          {suggestion.type === "community"
            ? renderCommunityIcon()
            : renderLayerIcon()}

          {/* Item Details */}
          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-900">
              {suggestion.displayName}
            </span>
            <span className="text-xs text-gray-500">
              {suggestion.type === "community" ? "קהילה" : "שכבת מידע"}
            </span>
          </div>
        </div>

        {/* Selection Indicator */}
        {isSelected && (
          <div className="flex items-center gap-1">
            {renderCheckIcon()}
            <span className="text-xs text-green-600 font-medium">נבחר</span>
          </div>
        )}
      </div>
    );
  };

  // Render suggestions dropdown
  const renderSuggestions = () => {
    if (!showSuggestions || suggestions.length === 0) return null;

    return (
      <div
        ref={suggestionsRef}
        className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto"
      >
        {suggestions.map(renderSuggestionItem)}

        {/* Footer with instruction */}
        <div className="px-4 py-2 bg-gray-50 border-t border-gray-100">
          <p className="text-xs text-gray-500 text-center">
            השתמש בחצים למעלה/מטה, Enter לבחירה, או Escape לסגירה
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full max-w-md mx-auto relative" dir="rtl">
      <div className="relative">
        {/* Search Input Field */}
        <input
          ref={searchInputRef}
          type="text"
          className="w-full px-4 py-2.5 text-gray-700 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 placeholder-gray-400 text-right pr-10 transition-all"
          placeholder={placeholder}
          value={searchValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (suggestions.length > 0) {
              setShowSuggestions(true);
            }
          }}
        />

        {/* Search Icon - Positioned for RTL Layout */}
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          {renderSearchIcon()}
        </div>
      </div>

      {/* Suggestions Dropdown */}
      {renderSuggestions()}
    </div>
  );
};

export default SearchBar;

/**
 * SearchBar component - reusable search input with clear button
 */

import './SearchBar.css';

interface SearchBarProps {
  /** Current search query value */
  value: string;
  /** Callback when search query changes */
  onChange: (value: string) => void;
  /** Placeholder text for the input */
  placeholder?: string;
  /** Optional aria-label for accessibility */
  ariaLabel?: string;
}

/**
 * SearchBar component provides a search input with clear button
 */
export function SearchBar({
  value,
  onChange,
  placeholder = 'Search...',
  ariaLabel = 'Search',
}: SearchBarProps) {
  const handleClear = () => {
    onChange('');
  };

  return (
    <div className="search-bar">
      <div className="search-bar-wrapper">
        <span className="search-bar-icon">🔍</span>
        <input
          type="text"
          className="search-bar-input"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-label={ariaLabel}
        />
        {value && (
          <button
            className="search-bar-clear"
            onClick={handleClear}
            aria-label="Clear search"
            type="button"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
}

export default SearchBar;

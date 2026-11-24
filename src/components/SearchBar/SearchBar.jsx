import { Search } from 'lucide-react';

export default function SearchBar({
  value,
  onChange,
  label = 'Buscar',
  placeholder = 'Buscar...',
  disabled = false,
}) {
  return (
    <div className="search-bar">
      <Search className="search-bar-icon" aria-hidden="true" />

      <input
        type="search"
        className="search-bar-input"
        aria-label={label}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
      />
    </div>
  );
}

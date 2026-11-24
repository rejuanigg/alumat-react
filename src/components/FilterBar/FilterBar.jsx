import SearchBar from '../SearchBar/SearchBar.jsx';
import Button from '../Button/index.js';
import Select from '../Select/index.js';

export default function FilterBar({
  searchValue,
  onSearchChange,
  searchLabel = 'Buscar',
  searchPlaceholder = 'Buscar...',
  filters = [],
  onClear,
  disabled = false,
}) {
  return (
    <div className="filter-bar" role="group" aria-label="Búsqueda y filtros">
      <SearchBar
        value={searchValue}
        onChange={onSearchChange}
        label={searchLabel}
        placeholder={searchPlaceholder}
        disabled={disabled}
      />

      {filters.map((filter) => (
        <label className="filter-bar-field" key={filter.name}>
          <span className="filter-bar-label">{filter.label}</span>
          <Select
            name={filter.name}
            value={filter.value}
            options={filter.options}
            placeholder={filter.placeholder}
            onChange={filter.onChange}
            disabled={disabled || filter.disabled}
          />
        </label>
      ))}

      <Button
        variant="outline"
        onClick={onClear}
        disabled={disabled || !onClear}
      >
        Limpiar filtros
      </Button>
    </div>
  );
}

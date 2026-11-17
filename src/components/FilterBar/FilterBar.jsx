import SearchBar from '../SearchBar/SearchBar.jsx';
import Button from '../Button/index.js';
import Select from '../Select/index.js';

/**
 * Barra de búsqueda y filtros controlados por la página.
 *
 * Props:
 * - searchValue: texto del buscador.
 * - onSearchChange: recibe el evento del buscador.
 * - searchLabel: etiqueta accesible del buscador.
 * - searchPlaceholder: texto de ayuda.
 * - filters: lista de filtros:
 *   { name, label, value, options, onChange, placeholder, disabled }.
 *   options usa el mismo formato que el componente Select.
 * - onClear: función que restablece la búsqueda y los filtros.
 * - disabled: deshabilita todos los controles.
 */
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

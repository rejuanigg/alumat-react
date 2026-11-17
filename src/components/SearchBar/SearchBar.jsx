import { Search } from 'lucide-react';

/**
 * Buscador controlado: la página guarda el texto y filtra los datos.
 *
 * Props:
 * - value: texto actual.
 * - onChange: recibe el evento del input.
 * - label: nombre accesible del buscador.
 * - placeholder: texto de ayuda.
 * - disabled: deshabilita el campo.
 */
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

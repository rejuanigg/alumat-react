import { useId } from 'react';

/**
 * Tabla reutilizable.
 *
 * Props:
 * - caption: título accesible de la tabla.
 * - columns: [{ key, label, render }].
 *   render es opcional y recibe (valor, fila).
 * - rows: filas de datos.
 * - rowKey: propiedad única de cada fila; por defecto "id".
 * - renderActions: función opcional que recibe la fila y devuelve acciones.
 * - emptyMessage: mensaje cuando no hay filas.
 */
export default function DataTable({
  caption = 'Listado',
  columns = [],
  rows = [],
  rowKey = 'id',
  renderActions,
  emptyMessage = 'No hay registros para mostrar.',
}) {
  const captionId = useId();
  const columnCount = columns.length + (renderActions ? 1 : 0);

  return (
    <div
      className="data-table-wrapper"
      role="region"
      aria-labelledby={captionId}
      tabIndex={0}
    >
      <table className="data-table">
        <caption id={captionId} className="sr-only">
          {caption}
        </caption>

        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key} scope="col">
                {column.label}
              </th>
            ))}
            {renderActions && <th scope="col">Acciones</th>}
          </tr>
        </thead>

        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={Math.max(columnCount, 1)}>{emptyMessage}</td>
            </tr>
          ) : (
            rows.map((row) => (
              <tr key={row[rowKey]}>
                {columns.map((column) => (
                  <td key={column.key}>
                    {column.render
                      ? column.render(row[column.key], row)
                      : (row[column.key] ?? '—')}
                  </td>
                ))}
                {renderActions && <td>{renderActions(row)}</td>}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

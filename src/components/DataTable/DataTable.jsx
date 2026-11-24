import { useId } from 'react';

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

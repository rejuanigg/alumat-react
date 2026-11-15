import { useId, useRef } from 'react';

/**
 * Pestañas controladas.
 *
 * Props:
 * - items: [{ value, label, content, disabled }].
 *   Cada value debe ser único.
 * - value: valor de la pestaña seleccionada.
 * - onChange: recibe el valor de la nueva pestaña.
 * - label: nombre accesible del grupo.
 *
 * Teclado: flechas izquierda/derecha, Home y End.
 */
export default function Tabs({
  items = [],
  value,
  onChange,
  label = 'Secciones',
}) {
  const id = useId();
  const buttons = useRef([]);
  const enabledIndexes = items
    .map((item, index) => (item.disabled ? -1 : index))
    .filter((index) => index !== -1);

  const requestedIndex = items.findIndex(
    (item) => item.value === value && !item.disabled,
  );
  const selectedIndex =
    requestedIndex !== -1 ? requestedIndex : enabledIndexes[0];

  const handleKeyDown = (event, index) => {
    const position = enabledIndexes.indexOf(index);
    const count = enabledIndexes.length;
    let nextPosition;

    switch (event.key) {
      case 'ArrowRight':
        nextPosition = (position + 1) % count;
        break;
      case 'ArrowLeft':
        nextPosition = (position - 1 + count) % count;
        break;
      case 'Home':
        nextPosition = 0;
        break;
      case 'End':
        nextPosition = count - 1;
        break;
      default:
        return;
    }

    event.preventDefault();
    const nextIndex = enabledIndexes[nextPosition];
    buttons.current[nextIndex]?.focus();
    onChange?.(items[nextIndex].value);
  };

  return (
    <div className="tabs">
      <div className="tabs-list" role="tablist" aria-label={label}>
        {items.map((item, index) => (
          <button
            key={item.value}
            ref={(element) => {
              buttons.current[index] = element;
            }}
            type="button"
            role="tab"
            id={`${id}-tab-${index}`}
            aria-controls={`${id}-panel-${index}`}
            aria-selected={index === selectedIndex}
            tabIndex={index === selectedIndex ? 0 : -1}
            disabled={item.disabled}
            className="tabs-trigger"
            onClick={() => onChange?.(item.value)}
            onKeyDown={(event) => handleKeyDown(event, index)}
          >
            {item.label}
          </button>
        ))}
      </div>

      {items.map((item, index) => (
        <div
          key={item.value}
          role="tabpanel"
          id={`${id}-panel-${index}`}
          aria-labelledby={`${id}-tab-${index}`}
          hidden={index !== selectedIndex}
          tabIndex={0}
          className="tabs-panel"
        >
          {item.content}
        </div>
      ))}
    </div>
  );
}

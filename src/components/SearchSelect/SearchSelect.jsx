import { Check, Search, X } from 'lucide-react';
import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { cx } from '../_utils/cx.js';
import Select from '../Select/index.js';
import styles from './SearchSelect.module.css';

const LIMITE = 50;

const normalizar = (texto) =>
  String(texto ?? '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase();

/**
 * Selector con búsqueda y filtros, en reemplazo del <select> del navegador.
 *
 * options: [{ value, label, description?, keywords?, filtros? }]
 *   - description: segunda línea (ej. teléfono, DNI, producto).
 *   - keywords: texto extra por el que también se busca.
 *   - filtros: { [nombreFiltro]: valor } para los filtros desplegables.
 * filters: [{ name, label, options: [{ value, label }] }]
 *
 * onChange recibe el value elegido ('' al limpiar), no un evento.
 */
export default function SearchSelect({
  options = [],
  value = '',
  onChange,
  filters = [],
  placeholder = 'Seleccioná una opción',
  searchPlaceholder = 'Buscar...',
  emptyMessage = 'No hay resultados.',
  clearable = false,
  disabled = false,
  invalid,
  id,
  className,
  ...rest
}) {
  const uid = useId();
  const listId = `${uid}-lista`;
  const raiz = useRef(null);
  const disparador = useRef(null);
  const buscador = useRef(null);

  const [abierto, setAbierto] = useState(false);
  const [consulta, setConsulta] = useState('');
  const [valoresFiltro, setValoresFiltro] = useState({});
  const [activo, setActivo] = useState(0);

  const esInvalido = Boolean(invalid || rest['aria-invalid']);
  const elegida = options.find((o) => String(o.value) === String(value));

  const indexadas = useMemo(
    () =>
      options.map((o) => ({
        opcion: o,
        texto: normalizar(`${o.label} ${o.description ?? ''} ${o.keywords ?? ''}`),
      })),
    [options],
  );

  const resultados = useMemo(() => {
    const palabras = normalizar(consulta).split(/\s+/).filter(Boolean);
    return indexadas
      .filter(({ opcion, texto }) => {
        if (!palabras.every((p) => texto.includes(p))) return false;
        return filters.every((f) => {
          const buscado = valoresFiltro[f.name];
          return !buscado || String(opcion.filtros?.[f.name]) === buscado;
        });
      })
      .map(({ opcion }) => opcion);
  }, [indexadas, consulta, filters, valoresFiltro]);

  const visibles = resultados.slice(0, LIMITE);

  const cerrar = (devolverFoco = false) => {
    setAbierto(false);
    setConsulta('');
    if (devolverFoco) disparador.current?.focus();
  };

  const abrir = () => {
    if (disabled) return;
    const i = visibles.findIndex((o) => String(o.value) === String(value));
    setActivo(i >= 0 ? i : 0);
    setAbierto(true);
  };

  useEffect(() => {
    if (abierto) buscador.current?.focus();
  }, [abierto]);

  useEffect(() => {
    if (!abierto) return;
    const alHacerClic = (e) => {
      if (!raiz.current?.contains(e.target)) cerrar();
    };
    document.addEventListener('pointerdown', alHacerClic);
    return () => document.removeEventListener('pointerdown', alHacerClic);
  }, [abierto]);

  useEffect(() => {
    if (!abierto) return;
    document
      .getElementById(`${uid}-op-${activo}`)
      ?.scrollIntoView({ block: 'nearest' });
  }, [abierto, activo, uid]);

  const elegir = (opcion) => {
    onChange?.(String(opcion.value));
    cerrar(true);
  };

  const limpiar = (e) => {
    e.stopPropagation();
    onChange?.('');
    disparador.current?.focus();
  };

  const alTeclear = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActivo((i) => Math.min(i + 1, visibles.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActivo((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (visibles[activo]) elegir(visibles[activo]);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      e.stopPropagation();
      cerrar(true);
    } else if (e.key === 'Tab') {
      cerrar();
    }
  };

  const hayFiltros = Object.values(valoresFiltro).some(Boolean);

  return (
    <div ref={raiz} className={cx(styles.raiz, className)}>
      <button
        ref={disparador}
        type="button"
        id={id}
        className={cx(styles.disparador, esInvalido && styles.invalido)}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={abierto}
        aria-controls={abierto ? listId : undefined}
        aria-invalid={esInvalido || undefined}
        aria-required={rest.required || undefined}
        aria-describedby={rest['aria-describedby']}
        onClick={() => (abierto ? cerrar() : abrir())}
        onKeyDown={(e) => {
          if (e.key === 'ArrowDown' && !abierto) {
            e.preventDefault();
            abrir();
          }
        }}
      >
        {elegida ? (
          <span className={styles.textos}>
            <span className={styles.etiqueta}>{elegida.label}</span>
            {elegida.description && (
              <span className={styles.descripcion}>{elegida.description}</span>
            )}
          </span>
        ) : (
          <span className={styles.placeholder}>{placeholder}</span>
        )}
      </button>

      {clearable && elegida && !disabled && (
        <button
          type="button"
          className={styles.limpiar}
          aria-label="Quitar selección"
          onClick={limpiar}
        >
          <X aria-hidden="true" />
        </button>
      )}

      {abierto && (
        <div className={styles.panel}>
          <div className={styles.busqueda}>
            <Search className={styles.lupa} aria-hidden="true" />
            <input
              ref={buscador}
              type="search"
              role="combobox"
              className={styles.entrada}
              aria-label="Buscar"
              aria-expanded="true"
              aria-controls={listId}
              aria-activedescendant={
                visibles[activo] ? `${uid}-op-${activo}` : undefined
              }
              aria-autocomplete="list"
              autoComplete="off"
              placeholder={searchPlaceholder}
              value={consulta}
              onChange={(e) => {
                setConsulta(e.target.value);
                setActivo(0);
              }}
              onKeyDown={alTeclear}
            />
          </div>

          {filters.length > 0 && (
            <div className={styles.filtros}>
              {filters.map((f) => (
                <label key={f.name} className={styles.filtro}>
                  <span className={styles.filtroEtiqueta}>{f.label}</span>
                  <Select
                    value={valoresFiltro[f.name] ?? ''}
                    options={f.options}
                    placeholder="Todos"
                    onChange={(e) => {
                      setValoresFiltro((v) => ({
                        ...v,
                        [f.name]: e.target.value,
                      }));
                      setActivo(0);
                    }}
                  />
                </label>
              ))}
              {hayFiltros && (
                <button
                  type="button"
                  className={styles.borrarFiltros}
                  onClick={() => {
                    setValoresFiltro({});
                    setActivo(0);
                  }}
                >
                  Limpiar filtros
                </button>
              )}
            </div>
          )}

          <ul id={listId} role="listbox" className={styles.lista}>
            {visibles.map((o, i) => {
              const marcada = String(o.value) === String(value);
              return (
                <li
                  key={o.value}
                  id={`${uid}-op-${i}`}
                  role="option"
                  aria-selected={marcada}
                  className={cx(
                    styles.opcion,
                    i === activo && styles.activa,
                    marcada && styles.marcada,
                  )}
                  onPointerMove={() => setActivo(i)}
                  onClick={() => elegir(o)}
                >
                  <span className={styles.textos}>
                    <span className={styles.etiqueta}>{o.label}</span>
                    {o.description && (
                      <span className={styles.descripcion}>
                        {o.description}
                      </span>
                    )}
                  </span>
                  {marcada && <Check className={styles.tilde} aria-hidden="true" />}
                </li>
              );
            })}
          </ul>

          <p className={styles.estado} role="status">
            {visibles.length === 0
              ? emptyMessage
              : resultados.length > LIMITE
                ? `Mostrando ${LIMITE} de ${resultados.length}. Escribí para acotar.`
                : `${resultados.length} ${resultados.length === 1 ? 'resultado' : 'resultados'}`}
          </p>
        </div>
      )}
    </div>
  );
}

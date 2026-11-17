import './TokensPreview.css';

// Página temporal para revisar los design tokens (ruta /tokens).
// Los valores se leen de las variables CSS: acá no se escribe ningún valor.

const grupos = [
  {
    titulo: 'Marca',
    tokens: [
      '--color-primary',
      '--color-primary-hover',
      '--color-primary-strong',
      '--color-header',
      '--color-sidebar-start',
      '--color-sidebar-end',
      '--color-bg',
      '--color-surface',
      '--color-surface-soft',
      '--color-surface-highlight',
      '--color-border',
      '--color-grid',
    ],
  },
  {
    titulo: 'Texto',
    tokens: [
      '--color-text',
      '--color-text-body',
      '--color-text-muted',
      '--color-text-on-dark',
    ],
  },
  {
    titulo: 'Estados y categorías',
    tokens: [
      '--color-success',
      '--color-success-bg',
      '--color-success-text',
      '--color-danger',
      '--color-danger-bg',
      '--color-warning',
      '--color-warning-bg',
      '--color-warning-text',
      '--color-accent',
      '--color-accent-bg',
      '--color-info',
      '--color-info-bg',
    ],
  },
  {
    titulo: 'Gráficos y otros',
    tokens: [
      '--color-chart-line',
      '--color-chart-fill',
      '--color-notification',
      '--color-focus-ring',
    ],
  },
];

const badges = [
  {
    nombre: 'En proceso',
    bg: '--status-process-bg',
    fg: '--status-process-fg',
  },
  { nombre: 'Pendiente', bg: '--status-pending-bg', fg: '--status-pending-fg' },
  { nombre: 'Finalizado', bg: '--status-done-bg', fg: '--status-done-fg' },
];

const kpis = [
  { nombre: 'Clientes', bg: '--kpi-clients-bg', fg: '--kpi-clients-fg' },
  { nombre: 'Productos', bg: '--kpi-products-bg', fg: '--kpi-products-fg' },
  { nombre: 'Pedidos', bg: '--kpi-orders-bg', fg: '--kpi-orders-text' },
  { nombre: 'Ventas', bg: '--kpi-sales-bg', fg: '--kpi-sales-text' },
];

const estadosSuaves = [
  ['Activo', '--color-success-bg', '--color-success-text'],
  ['Inactivo', '--color-danger-bg', '--color-danger'],
  ['Saldo', '--color-warning-bg', '--color-warning-text'],
  ['Diseño', '--color-accent-bg', '--color-accent'],
  ['Info', '--color-info-bg', '--color-info'],
];

const layout = [
  '--sidebar-width',
  '--topbar-height',
  '--content-padding',
  '--border-width',
  '--focus-ring-width',
  '--focus-ring-offset',
  '--scrollbar-size',
  '--sidebar-image-opacity',
];

const tamanos = ['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl'];
const pesos = ['regular', 'medium', 'semibold', 'bold', 'extrabold'];
const radios = ['sm', 'md', 'lg', 'pill'];
const sombras = ['sm', 'md', 'lg'];
const espacios = [1, 2, 3, 4, 5, 6, 8, 10];

const valor = (token) =>
  getComputedStyle(document.documentElement).getPropertyValue(token).trim();

const v = (token) => `var(${token})`;

function Seccion({ titulo, children }) {
  return (
    <section className="tp-seccion">
      <h2>{titulo}</h2>
      {children}
    </section>
  );
}

function Token({ nombre }) {
  return (
    <div className="tp-token">
      <code>{nombre}</code>
      <span>{valor(nombre)}</span>
    </div>
  );
}

export default function TokensPreview() {
  return (
    <div className="tp-layout">
      <aside className="sidebar" aria-label="Ejemplo de sidebar">
        <p className="tp-logo">ALUMAT</p>
        <nav className="tp-nav">
          <a className="sidebar-link" href="#colores" aria-current="page">
            Colores
          </a>
          <a className="sidebar-link" href="#estados">
            Estados
          </a>
          <a className="sidebar-link" href="#tipografia">
            Tipografía
          </a>
          <a className="sidebar-link" href="#radios">
            Radios y sombras
          </a>
          <a className="sidebar-link" href="#espaciados">
            Espaciados
          </a>
        </nav>
      </aside>

      <div className="tp-main">
        <header className="tp-topbar on-dark">
          <span>Design tokens</span>
          <span className="tp-topbar-nota">Página temporal · /tokens</span>
        </header>

        <div className="tp-contenido">
          <h1>Design tokens</h1>

          <div id="colores">
            {grupos.map((g) => (
              <Seccion key={g.titulo} titulo={`Colores · ${g.titulo}`}>
                <div className="tp-grilla">
                  {g.tokens.map((t) => (
                    <div key={t} className="tp-color">
                      <div
                        className="tp-muestra"
                        style={{ background: v(t) }}
                      />
                      <Token nombre={t} />
                    </div>
                  ))}
                </div>
              </Seccion>
            ))}
          </div>

          <div id="estados">
            <Seccion titulo="Estados de pedido (badges)">
              <div className="tp-fila">
                {badges.map((b) => (
                  <div key={b.nombre} className="tp-columna">
                    <span
                      className="tp-badge"
                      style={{ background: v(b.bg), color: v(b.fg) }}
                    >
                      {b.nombre}
                    </span>
                    <Token nombre={b.bg} />
                    <Token nombre={b.fg} />
                  </div>
                ))}
              </div>
            </Seccion>

            <Seccion titulo="Tarjetas KPI">
              <div className="tp-grilla">
                {kpis.map((k) => (
                  <div key={k.nombre} className="tp-kpi">
                    <span
                      className="tp-kpi-icono"
                      style={{ background: v(k.bg), color: v(k.fg) }}
                    >
                      {k.nombre.charAt(0)}
                    </span>
                    <div>
                      <p className="tp-kpi-etiqueta">{k.nombre}</p>
                      <p className="tp-kpi-valor">128</p>
                    </div>
                  </div>
                ))}
              </div>
            </Seccion>

            <Seccion titulo="Estados y categorías (texto sobre fondo suave)">
              <div className="tp-fila">
                {estadosSuaves.map(([nombre, bg, fg]) => (
                  <span
                    key={nombre}
                    className="tp-badge"
                    style={{ background: v(bg), color: v(fg) }}
                  >
                    {nombre}
                  </span>
                ))}
              </div>
            </Seccion>
          </div>

          <div id="tipografia">
            <Seccion titulo="Tipografía">
              <Token nombre="--font-family" />
              <div className="tp-lista">
                {tamanos.map((t) => (
                  <div key={t} className="tp-tipo">
                    <span style={{ fontSize: v(`--font-size-${t}`) }}>
                      Aberturas de aluminio
                    </span>
                    <Token nombre={`--font-size-${t}`} />
                  </div>
                ))}
              </div>
              <div className="tp-lista">
                {pesos.map((p) => (
                  <div key={p} className="tp-tipo">
                    <span style={{ fontWeight: v(`--font-weight-${p}`) }}>
                      Ventana corrediza
                    </span>
                    <Token nombre={`--font-weight-${p}`} />
                  </div>
                ))}
              </div>
              <div className="tp-fila">
                <Token nombre="--line-height-tight" />
                <Token nombre="--line-height-base" />
              </div>
              <div className="tp-titulos">
                <h1>Título h1</h1>
                <h2>Título h2</h2>
                <h3>Título h3</h3>
                <h4>Título h4</h4>
                <p>Texto de párrafo con el interlineado base.</p>
              </div>
            </Seccion>
          </div>

          <div id="radios">
            <Seccion titulo="Radios">
              <div className="tp-fila">
                {radios.map((r) => (
                  <div key={r} className="tp-columna">
                    <div
                      className="tp-caja"
                      style={{ borderRadius: v(`--radius-${r}`) }}
                    />
                    <Token nombre={`--radius-${r}`} />
                  </div>
                ))}
              </div>
            </Seccion>

            <Seccion titulo="Sombras">
              <div className="tp-fila">
                {sombras.map((s) => (
                  <div key={s} className="tp-columna">
                    <div
                      className="tp-caja tp-caja-sombra"
                      style={{ boxShadow: v(`--shadow-${s}`) }}
                    />
                    <Token nombre={`--shadow-${s}`} />
                  </div>
                ))}
              </div>
            </Seccion>
          </div>

          <div id="espaciados">
            <Seccion titulo="Espaciados">
              <div className="tp-lista">
                {espacios.map((e) => (
                  <div key={e} className="tp-espacio">
                    <div
                      className="tp-barra"
                      style={{ width: v(`--space-${e}`) }}
                    />
                    <Token nombre={`--space-${e}`} />
                  </div>
                ))}
              </div>
            </Seccion>

            <Seccion titulo="Layout, bordes y foco">
              <div className="tp-fila">
                {layout.map((t) => (
                  <Token key={t} nombre={t} />
                ))}
              </div>
              <button type="button" className="tp-boton">
                Botón primario (probá el foco con Tab)
              </button>
            </Seccion>
          </div>
        </div>
      </div>
    </div>
  );
}

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## Design tokens

Todos los estilos de ALUMAT salen de un único conjunto de variables CSS (design tokens). Así la app se ve igual en todas las pantallas y un cambio de color o de espaciado se hace en un solo lugar.

### Cómo se importan

```
src/styles/
  tokens.css   → solo variables en :root (el único archivo con valores a mano)
  reset.css    → reset básico
  global.css   → body, títulos, scrollbar, foco, utilidades y sidebar
  index.css    → importa los tres, en ese orden
```

`src/main.jsx` importa `./styles/index.css` una sola vez. Los componentes no tienen que importar los tokens: las variables están en `:root` y se usan desde cualquier CSS con `var(--token)`.

Para revisarlos visualmente, levantá el proyecto (`npm run dev`) y entrá a **`/tokens`**. Es una página temporal que muestra todos los tokens con su valor real.

### Regla de oro

> En los componentes **no se escribe a mano ningún color, tamaño de fuente, radio, sombra ni espaciado**. Siempre `var(--token)`.

Si falta un valor, se agrega un token (ver más abajo). Para comprobarlo antes de abrir un PR:

```bash
grep -rnE '#[0-9a-fA-F]{3,8}\b|rgba?\(|[0-9.]+px\b' src | grep -v src/styles/tokens.css
```

No tiene que devolver nada.

**Correcto**

```css
.tarjeta {
  padding: var(--space-6);
  background: var(--color-surface);
  border: var(--border-width) solid var(--color-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  color: var(--color-text-body);
  font-size: var(--font-size-sm);
}
```

**Incorrecto**

```css
.tarjeta {
  padding: 24px; /* → var(--space-6) */
  background: #fff; /* → var(--color-surface) */
  border: 1px solid #e3eaf5; /* → var(--border-width) solid var(--color-border) */
  border-radius: 16px; /* → var(--radius-lg) */
  color: #12294d; /* → var(--color-text-body) */
  font-size: 14px; /* → var(--font-size-sm) */
}
```

Los nombres son **semánticos**: dicen para qué se usa el token, no de qué color es. Usá `--color-danger` para "eliminar" aunque haya otro rojo parecido.

### Cómo agregar un token nuevo

1. Agregalo en `src/styles/tokens.css`, en la sección que corresponda, con un nombre semántico (`--color-…`, `--space-…`, `--radius-…`).
2. Documentalo en la tabla de este README **en el mismo PR**.
3. Si es un color de texto, verificá que tenga contraste **4.5:1** sobre el fondo donde se usa (3:1 si es un ícono o un borde).
4. Si querés que aparezca en `/tokens`, agregalo a la lista correspondiente de `src/pages/TokensPreview.jsx`.

### Colores de marca

| Token                       | Valor     | Cuándo usarlo                                                                  |
| --------------------------- | --------- | ------------------------------------------------------------------------------ |
| `--color-primary`           | `#1a68e0` | Botones principales, ítem activo del sidebar, links                            |
| `--color-primary-hover`     | `#1556b5` | Hover de botones y de ítems del sidebar                                        |
| `--color-primary-strong`    | `#0a3d91` | Títulos de panel, encabezado de tabla                                          |
| `--color-header`            | `#0b3278` | Topbar (degradé hacia `--color-primary-strong`)                                |
| `--color-sidebar-start`     | `#0b2f73` | Arriba del degradé del sidebar                                                 |
| `--color-sidebar-end`       | `#0a4fb5` | Abajo del degradé del sidebar                                                  |
| `--color-bg`                | `#f3f6fc` | Fondo general de la app                                                        |
| `--color-surface`           | `#ffffff` | Tarjetas y paneles                                                             |
| `--color-surface-soft`      | `#e0eefc` | Fondos azulados suaves                                                         |
| `--color-surface-highlight` | `#d4e6fb` | Fila destacada ("Saldo actual")                                                |
| `--color-border`            | `#e3eaf5` | Bordes de tarjetas y tablas (decorativos)                                      |
| `--color-input-border`      | `#7489a8` | Borde de inputs, selects y textareas (3.57:1, el mínimo para controles es 3:1) |
| `--color-grid`              | `#dbe4f2` | Líneas de gráficos, scrollbar                                                  |

### Texto

| Token                  | Valor     | Cuándo usarlo                                   |
| ---------------------- | --------- | ----------------------------------------------- |
| `--color-text`         | `#0b1f3f` | Títulos y valores destacados                    |
| `--color-text-body`    | `#12294d` | Texto normal (es el color del `body`)           |
| `--color-text-muted`   | `#334e73` | Etiquetas, ayudas, texto secundario             |
| `--color-text-on-dark` | `#ffffff` | Texto sobre sidebar, topbar y botones primarios |

### Estados y categorías

| Token                  | Valor     | Cuándo usarlo                                |
| ---------------------- | --------- | -------------------------------------------- |
| `--color-success`      | `#17803a` | Activo / pagada (íconos, bordes)             |
| `--color-success-bg`   | `#d8f3de` | Fondo de "activo / pagada"                   |
| `--color-success-text` | `#167837` | **Texto** sobre `--color-success-bg`         |
| `--color-danger`       | `#c0262d` | Inactivo / eliminar (texto, íconos, botones) |
| `--color-danger-bg`    | `#fbdcdc` | Fondo de "inactivo / eliminar"               |
| `--color-danger-hover` | `#a01f25` | Hover de botones de peligro                  |
| `--color-warning`      | `#d9701a` | Pendiente / saldo (íconos, bordes, gráficos) |
| `--color-warning-bg`   | `#fde7d3` | Fondo de "pendiente / saldo"                 |
| `--color-warning-text` | `#a15313` | **Texto** sobre `--color-warning-bg`         |
| `--color-accent`       | `#6a3fc2` | Diseños / categorías                         |
| `--color-accent-bg`    | `#e9e2fa` | Fondo de diseños / categorías                |
| `--color-info`         | `#1556b5` | Mensajes informativos                        |
| `--color-info-bg`      | `#e0eefc` | Fondo de mensajes informativos               |

### Estados de pedido (badges)

| Estado     | Fondo                           | Texto                           | Contraste |
| ---------- | ------------------------------- | ------------------------------- | --------- |
| En proceso | `--status-process-bg` `#fde7a8` | `--status-process-fg` `#7a3e00` | 6.82:1    |
| Pendiente  | `--status-pending-bg` `#fbc9c9` | `--status-pending-fg` `#8f1d1d` | 6.06:1    |
| Finalizado | `--status-done-bg` `#c4f0cf`    | `--status-done-fg` `#12652f`    | 5.71:1    |

### Tarjetas de indicadores (KPI)

El fondo va en el círculo del ícono. El color de primer plano se usa para el ícono y para cualquier texto sobre ese fondo.

| KPI       | Fondo                         | Primer plano (texto/ícono)    | Contraste |
| --------- | ----------------------------- | ----------------------------- | --------- |
| Clientes  | `--kpi-clients-bg` `#e0eefc`  | `--kpi-clients-fg` `#1556b5`  | 5.88:1    |
| Productos | `--kpi-products-bg` `#e9e2fa` | `--kpi-products-fg` `#6a3fc2` | 5.39:1    |
| Pedidos   | `--kpi-orders-bg` `#dcf4e2`   | `--kpi-orders-text` `#1b7934` | 4.72:1    |
| Ventas    | `--kpi-sales-bg` `#fde7d3`    | `--kpi-sales-text` `#a15313`  | 4.66:1    |

`--kpi-orders-fg` (`#1f8a3b`, 3.80:1) y `--kpi-sales-fg` (`#d9701a`, 2.79:1) **no llegan a 4.5:1** sobre su fondo. Se dejan para usos decorativos, como líneas o barras de gráficos. Para texto e íconos usá las variantes `-text`.

### Gráficos y otros

| Token                  | Valor     | Cuándo usarlo                         |
| ---------------------- | --------- | ------------------------------------- |
| `--color-chart-line`   | `#1d6df0` | Línea principal de los gráficos       |
| `--color-chart-fill`   | `#3d8bff` | Relleno / área / barras de gráficos   |
| `--color-notification` | `#ffb020` | Punto de notificación (no para texto) |
| `--color-focus-ring`   | `#1a68e0` | Anillo de foco (`:focus-visible`)     |

### Tipografía

Fuente: **Inter** (pesos 400 a 800), cargada desde Google Fonts en `index.html` con `display=swap`.

| Token                     | Valor                   | Cuándo usarlo                              |
| ------------------------- | ----------------------- | ------------------------------------------ |
| `--font-family`           | `'Inter', system-ui, …` | Toda la app (ya está en `body`)            |
| `--font-size-xs`          | `12px`                  | Notas, ayudas, textos de tabla secundarios |
| `--font-size-sm`          | `14px`                  | Tablas, etiquetas, badges, botones         |
| `--font-size-md`          | `16px`                  | Texto base, `h4`                           |
| `--font-size-lg`          | `18px`                  | `h3`, títulos de tarjeta                   |
| `--font-size-xl`          | `21px`                  | `h2`, títulos de panel                     |
| `--font-size-2xl`         | `24px`                  | Valores de KPI, logo                       |
| `--font-size-3xl`         | `36px`                  | `h1`, título de página                     |
| `--font-size-4xl`         | `40px`                  | Cifras muy destacadas                      |
| `--font-weight-regular`   | `400`                   | Texto normal                               |
| `--font-weight-medium`    | `500`                   | Ítems del menú, etiquetas                  |
| `--font-weight-semibold`  | `600`                   | Badges, botones, `h3`/`h4`                 |
| `--font-weight-bold`      | `700`                   | `h2`, énfasis                              |
| `--font-weight-extrabold` | `800`                   | `h1`, valores de KPI                       |
| `--line-height-tight`     | `1.15`                  | Títulos                                    |
| `--line-height-base`      | `1.5`                   | Texto corrido (ya está en `body`)          |

### Radios

| Token           | Valor   | Cuándo usarlo                             |
| --------------- | ------- | ----------------------------------------- |
| `--radius-sm`   | `8px`   | Inputs, elementos chicos                  |
| `--radius-md`   | `12px`  | Botones, ítems del sidebar, íconos de KPI |
| `--radius-lg`   | `16px`  | Tarjetas y paneles                        |
| `--radius-pill` | `999px` | Badges, chips, scrollbar                  |

### Sombras

| Token         | Valor                                | Cuándo usarlo                                             |
| ------------- | ------------------------------------ | --------------------------------------------------------- |
| `--shadow-sm` | `0 2px 8px rgba(20, 60, 130, 0.06)`  | Tarjetas y paneles en reposo                              |
| `--shadow-md` | `0 4px 14px rgba(20, 60, 130, 0.09)` | Tarjetas KPI, hover, menús desplegables                   |
| `--shadow-lg` | `0 6px 16px rgba(18, 83, 184, 0.3)`  | Elementos azules destacados (ítem activo, botón primario) |

### Espaciados (escala de 4px)

| Token        | Valor  | Cuándo usarlo                                           |
| ------------ | ------ | ------------------------------------------------------- |
| `--space-1`  | `4px`  | Separación mínima (ícono-texto chico, padding de badge) |
| `--space-2`  | `8px`  | Separación entre elementos pegados                      |
| `--space-3`  | `12px` | Padding de botones e ítems                              |
| `--space-4`  | `16px` | Padding de tarjetas chicas, gap de grillas              |
| `--space-5`  | `20px` | Padding horizontal de botones grandes                   |
| `--space-6`  | `24px` | Padding de tarjetas y paneles                           |
| `--space-8`  | `32px` | Separación entre secciones, padding del contenido       |
| `--space-10` | `40px` | Separaciones grandes, tamaño de íconos de KPI           |

### Bordes, foco y scroll

| Token                 | Valor | Cuándo usarlo                  |
| --------------------- | ----- | ------------------------------ |
| `--border-width`      | `1px` | Todos los bordes               |
| `--focus-ring-width`  | `2px` | Grosor del anillo de foco      |
| `--focus-ring-offset` | `2px` | Separación del anillo de foco  |
| `--scrollbar-size`    | `8px` | Ancho de la scrollbar (WebKit) |

El foco usa `--color-focus-ring` (4.73:1 sobre `--color-bg`). Dentro de `.sidebar` o de cualquier elemento con la clase `.on-dark`, el anillo pasa a blanco, porque el azul no se distingue sobre fondos oscuros (2.46:1). **No quites el `outline` en ningún componente.**

### Layout y fondos

| Token                     | Valor                                                            | Cuándo usarlo                                    |
| ------------------------- | ---------------------------------------------------------------- | ------------------------------------------------ |
| `--sidebar-width`         | `280px`                                                          | Ancho del sidebar                                |
| `--topbar-height`         | `76px`                                                           | Alto de la topbar                                |
| `--content-padding`       | `var(--space-8)`                                                 | Padding del área de contenido                    |
| `--header-bg`             | degradé `--color-header` → `--color-primary-strong`              | Fondo de la topbar                               |
| `--sidebar-bg`            | degradé vertical `--color-sidebar-start` → `--color-sidebar-end` | Fondo del sidebar                                |
| `--sidebar-image-opacity` | `0.2`                                                            | Opacidad de la imagen del edificio en el sidebar |

### Componentes (tamaños, capas y estados)

| Token                     | Valor                       | Cuándo usarlo                                                                                                                                                                 |
| ------------------------- | --------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--icon-size-sm`          | `16px`                      | Íconos dentro de botones y badges                                                                                                                                             |
| `--icon-size-md`          | `20px`                      | Íconos de IconButton, campos y menú                                                                                                                                           |
| `--icon-size-lg`          | `24px`                      | Íconos de StatCard y PageHeader                                                                                                                                               |
| `--color-overlay`         | `rgba(11, 31, 63, 0.55)`    | Fondo detrás de modales y del sidebar móvil                                                                                                                                   |
| `--color-table-row-alt`   | `var(--color-bg)`           | Filas alternadas de tablas                                                                                                                                                    |
| `--color-table-row-hover` | `var(--color-surface-soft)` | Hover de filas de tablas                                                                                                                                                      |
| `--opacity-disabled`      | `0.55`                      | Controles deshabilitados                                                                                                                                                      |
| `--duration-fast`         | `150ms`                     | Transiciones de hover y apertura                                                                                                                                              |
| `--menu-min-width`        | `180px`                     | Ancho mínimo del menú desplegable                                                                                                                                             |
| `--modal-width`           | `440px`                     | Ancho máximo del modal de confirmación                                                                                                                                        |
| `--search-min-width`      | `240px`                     | Ancho mínimo del buscador                                                                                                                                                     |
| `--card-min-width`        | `240px`                     | Ancho mínimo de cards en grillas automáticas                                                                                                                                  |
| `--z-dropdown`            | `30`                        | Menús desplegables                                                                                                                                                            |
| `--z-sidebar-backdrop`    | `35`                        | Fondo oscuro del sidebar móvil                                                                                                                                                |
| `--z-sidebar`             | `40`                        | Sidebar abierto en pantallas angostas                                                                                                                                         |
| `--breakpoint-md`         | `960px`                     | Corte entre escritorio y pantallas angostas. **Solo de referencia**: `var()` no funciona en `@media`, así que ahí se escribe `960px` a mano; es la única excepción permitida. |

Los íconos de `lucide-react` no reciben `size` en el JSX: el tamaño lo pone el CSS del componente con `--icon-size-*`.

### Fondo del sidebar

La clase `.sidebar` (en `global.css`) combina el degradé `--sidebar-bg` con la imagen del edificio de vidrio, **`src/edificio_sin_fondo.webp`**. La imagen va en un `::before`, anclada abajo (`bottom center`, `cover`, sin repetir) y con opacidad `--sidebar-image-opacity`. El contenido del sidebar queda por encima.

La imagen se referencia con una ruta relativa desde el CSS (`url('../edificio_sin_fondo.webp')`), así Vite la procesa y la incluye en el build con hash. Con opacidad 0.2, el texto blanco mantiene al menos **4.82:1** incluso en el punto más claro de la imagen. Si subís la opacidad, volvé a medir el contraste: con 0.25 baja a 4.29:1 y ya no cumple.

Estilos ya listos para el menú: `.sidebar-link` para cada ítem, y `.is-active` o `aria-current="page"` para el ítem activo.

### Utilidades globales

- `.sr-only`: texto que solo leen los lectores de pantalla.
- `.on-dark`: texto blanco y foco blanco, para superficies oscuras como la topbar.
- `prefers-reduced-motion`: si el usuario lo pide, las animaciones y transiciones se reducen al mínimo.

import {
  COLORES_ALUMINIO,
  TIPOS_REVESTIMIENTO,
  TIPOS_VIDRIO,
  etiquetaDe,
} from './pedidos.api.js';

export const columnasAberturas = (nombresDiseno) => [
  {
    key: 'id_diseno',
    label: 'Producto - Diseño',
    render: (valor) => nombresDiseno[valor] ?? `Diseño #${valor}`,
  },
  {
    key: 'ancho',
    label: 'Medidas (ancho × alto)',
    render: (_, fila) => `${fila.ancho} × ${fila.alto}`,
  },
  { key: 'cantidad', label: 'Cant.' },
  {
    key: 'tipo_vidrio',
    label: 'Vidrio',
    render: (valor) => etiquetaDe(TIPOS_VIDRIO, valor),
  },
  {
    key: 'color_aluminio',
    label: 'Color',
    render: (valor) => etiquetaDe(COLORES_ALUMINIO, valor),
  },
  {
    key: 'tipo_revestimiento',
    label: 'Revestimiento',
    render: (valor) => etiquetaDe(TIPOS_REVESTIMIENTO, valor),
  },
  {
    key: 'observaciones',
    label: 'Observaciones',
    render: (valor) => valor || '—',
  },
];

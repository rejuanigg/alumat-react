import { useEffect, useMemo, useState } from 'react';
import {
  listarDisenos,
  listarProductos,
} from '../ProductosDisenos/productos.api.js';

export default function useCatalogo() {
  const [disenos, setDisenos] = useState([]);
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    Promise.all([listarDisenos(), listarProductos()])
      .then(([dis, prods]) => {
        setDisenos(dis);
        setProductos(prods);
      })
      .catch(setError)
      .finally(() => setCargando(false));
  }, []);

  const nombresDiseno = useMemo(() => {
    const producto = Object.fromEntries(
      productos.map((p) => [p.id_producto, p.nombre]),
    );
    return Object.fromEntries(
      disenos.map((d) => [
        d.id_diseno,
        `${producto[d.id_producto] ?? 'Producto'} - ${d.nombre_diseno}`,
      ]),
    );
  }, [disenos, productos]);

  const opcionesDiseno = useMemo(() => {
    const activos = new Set(
      productos.filter((p) => p.activo).map((p) => p.id_producto),
    );
    const porProducto = Object.fromEntries(
      productos.map((p) => [p.id_producto, p]),
    );
    return disenos
      .filter((d) => d.activo && activos.has(d.id_producto))
      .map((d) => {
        const producto = porProducto[d.id_producto];
        return {
          value: String(d.id_diseno),
          label: d.nombre_diseno,
          description: producto?.nombre,
          keywords: producto?.tipo_abertura,
          filtros: { id_producto: String(d.id_producto) },
        };
      });
  }, [disenos, productos]);

  const filtrosDiseno = useMemo(
    () => [
      {
        name: 'id_producto',
        label: 'Producto',
        options: productos
          .filter((p) => p.activo)
          .map((p) => ({ value: String(p.id_producto), label: p.nombre })),
      },
    ],
    [productos],
  );

  return { opcionesDiseno, filtrosDiseno, nombresDiseno, cargando, error };
}

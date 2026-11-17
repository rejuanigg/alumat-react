import { useEffect, useMemo, useState } from 'react';
import {
  listarDisenos,
  listarProductos,
} from '../ProductosDisenos/productos.api.js';

/**
 * Diseños y productos de la API para armar aberturas.
 * - opcionesDiseno: solo diseños activos de productos activos (para elegir).
 * - nombresDiseno: "Producto - Diseño" de todos (para mostrar lo ya cargado).
 */
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
    return disenos
      .filter((d) => d.activo && activos.has(d.id_producto))
      .map((d) => ({
        value: String(d.id_diseno),
        label: nombresDiseno[d.id_diseno],
      }));
  }, [disenos, productos, nombresDiseno]);

  return { opcionesDiseno, nombresDiseno, cargando, error };
}

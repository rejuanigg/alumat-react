import { useContext } from 'react';
import { SesionContext } from './SesionContext.jsx';

/** Datos y acciones de la sesión: { estado, usuario, ingresar, salir }. */
export default function useSesion() {
  const sesion = useContext(SesionContext);
  if (!sesion)
    throw new Error('useSesion debe usarse dentro de SesionProvider');
  return sesion;
}

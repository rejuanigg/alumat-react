import { createContext, useCallback, useEffect, useState } from 'react';
import { cerrarSesion, iniciarSesion, verificarSesion } from '../api/sesion.js';

export const SesionContext = createContext(null);

// El backend todavía no informa quién inició sesión (falta GET /api/yo/):
// se recuerda el usuario que se escribió en el login para mostrarlo.
const CLAVE_USUARIO = 'alumat-usuario';

/**
 * Guarda el estado de la sesión para toda la app.
 * estado: 'verificando' | 'autenticado' | 'anonimo'.
 */
export function SesionProvider({ children }) {
  const [estado, setEstado] = useState('verificando');
  const [usuario, setUsuario] = useState(
    () => sessionStorage.getItem(CLAVE_USUARIO) ?? '',
  );

  useEffect(() => {
    let activo = true;
    verificarSesion()
      .then((ok) => activo && setEstado(ok ? 'autenticado' : 'anonimo'))
      .catch(() => activo && setEstado('anonimo'));
    return () => {
      activo = false;
    };
  }, []);

  const ingresar = useCallback(async (nombre, clave) => {
    await iniciarSesion(nombre, clave);
    sessionStorage.setItem(CLAVE_USUARIO, nombre);
    setUsuario(nombre);
    setEstado('autenticado');
  }, []);

  const salir = useCallback(async () => {
    try {
      await cerrarSesion();
    } finally {
      sessionStorage.removeItem(CLAVE_USUARIO);
      setUsuario('');
      setEstado('anonimo');
    }
  }, []);

  return (
    <SesionContext.Provider value={{ estado, usuario, ingresar, salir }}>
      {children}
    </SesionContext.Provider>
  );
}

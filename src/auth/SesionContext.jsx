import { createContext, useCallback, useEffect, useState } from 'react';
import {
  cerrarSesion,
  iniciarSesion,
  obtenerPerfil,
  verificarSesion,
} from '../api/sesion.js';

export const SesionContext = createContext(null);

const CLAVE_USUARIO = 'alumat-usuario';

export function SesionProvider({ children }) {
  const [estado, setEstado] = useState('verificando');
  const [usuario, setUsuario] = useState(
    () => sessionStorage.getItem(CLAVE_USUARIO) ?? '',
  );

  const [perfil, setPerfil] = useState(null);

  useEffect(() => {
    if (estado !== 'autenticado') return undefined;
    let activo = true;
    obtenerPerfil()
      .then((datos) => activo && setPerfil(datos))
      .catch(() => activo && setPerfil(null));
    return () => {
      activo = false;
    };
  }, [estado, usuario]);

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
      setPerfil(null);
      setEstado('anonimo');
    }
  }, []);

  const confirmarClave = useCallback(async (nombre, clave) => {
    await cerrarSesion();
    try {
      await iniciarSesion(nombre, clave);
    } catch (e) {
      sessionStorage.removeItem(CLAVE_USUARIO);
      setUsuario('');
      setEstado('anonimo');
      throw e;
    }
    sessionStorage.setItem(CLAVE_USUARIO, nombre);
    setUsuario(nombre);
  }, []);

  return (
    <SesionContext.Provider
      value={{ estado, usuario, perfil, ingresar, salir, confirmarClave }}
    >
      {children}
    </SesionContext.Provider>
  );
}

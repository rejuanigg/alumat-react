import { useState } from 'react';
import { Navigate, useNavigate, useSearchParams } from 'react-router';
import { LogIn } from 'lucide-react';
import { Button, FormField, Input } from '../../components';
import useSesion from '../../auth/useSesion.js';
import styles from './Login.module.css';

// Solo se vuelve a rutas internas, para no redirigir a otro sitio.
function destinoSeguro(next) {
  return next && next.startsWith('/') && !next.startsWith('//')
    ? next
    : '/clientes';
}

/** Pantalla de inicio de sesión. */
export default function Login() {
  const { estado, ingresar } = useSesion();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const destino = destinoSeguro(params.get('next'));

  const [valores, setValores] = useState({ usuario: '', clave: '' });
  const [errores, setErrores] = useState({});
  const [errorGeneral, setErrorGeneral] = useState('');
  const [enviando, setEnviando] = useState(false);

  // Si ya hay sesión, no tiene sentido mostrar el login.
  if (estado === 'autenticado' && !enviando) {
    return <Navigate to={destino} replace />;
  }

  const cambiar = (evento) => {
    const { name, value } = evento.target;
    setValores((v) => ({ ...v, [name]: value }));
    if (errores[name]) setErrores((e) => ({ ...e, [name]: undefined }));
  };

  const enviar = async (evento) => {
    evento.preventDefault();
    const form = evento.currentTarget;
    setErrorGeneral('');

    const encontrados = {};
    if (!valores.usuario.trim()) {
      encontrados.usuario = 'Ingresá tu nombre de usuario.';
    }
    if (!valores.clave) encontrados.clave = 'Ingresá tu contraseña.';
    setErrores(encontrados);
    if (encontrados.usuario || encontrados.clave) {
      form.elements
        .namedItem(encontrados.usuario ? 'usuario' : 'clave')
        .focus();
      return;
    }

    setEnviando(true);
    try {
      await ingresar(valores.usuario.trim().toLowerCase(), valores.clave);
      navigate(destino, { replace: true });
    } catch (e) {
      setErrorGeneral(e.message);
      setValores((v) => ({ ...v, clave: '' }));
      form.elements.namedItem('clave').focus();
      setEnviando(false);
    }
  };

  return (
    <div className={styles.pantalla}>
      <section className={styles.presentacion} aria-hidden="true">
        <span className={styles.marca}>ALUMAT</span>
        <div className={styles.textoPresentacion}>
          <p className={styles.antetitulo}>Todo en un mismo lugar</p>
          <p className={styles.titular}>Tu organización, más cerca.</p>
          <p>Clientes, pedidos, ventas y cajas desde tu espacio de trabajo.</p>
        </div>
      </section>

      <main className={styles.contenido}>
        <form
          className={styles.tarjeta}
          onSubmit={enviar}
          noValidate
          aria-busy={enviando}
        >
          <div className={styles.encabezado}>
            <h1 className={styles.titulo}>Iniciar sesión</h1>
            <p className={styles.subtitulo}>
              Ingresá con tu nombre de usuario y contraseña.
            </p>
          </div>

          {errorGeneral && (
            <p className={styles.errorGeneral} role="alert">
              {errorGeneral}
            </p>
          )}

          <FormField label="Nombre de usuario" required error={errores.usuario}>
            {(field) => (
              <Input
                {...field}
                name="usuario"
                value={valores.usuario}
                onChange={cambiar}
                autoComplete="username"
                autoCapitalize="none"
                autoFocus
                disabled={enviando}
              />
            )}
          </FormField>

          <FormField label="Contraseña" required error={errores.clave}>
            {(field) => (
              <Input
                {...field}
                name="clave"
                type="password"
                value={valores.clave}
                onChange={cambiar}
                autoComplete="current-password"
                disabled={enviando}
              />
            )}
          </FormField>

          <Button
            type="submit"
            icon={<LogIn />}
            disabled={enviando}
            className={styles.boton}
          >
            {enviando ? 'Ingresando...' : 'Ingresar al sistema'}
          </Button>

          <div className={styles.pie}>
            <p>
              ¿Es tu primera vez?{' '}
              <a href="/cuentas/registrarse/">Solicitá acceso</a>.
            </p>
            <p className={styles.ayuda}>
              Si olvidaste tu contraseña, contactá al administrador.
            </p>
          </div>
        </form>
      </main>
    </div>
  );
}

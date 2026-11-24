import { useState } from 'react';
import { Link } from 'react-router';
import { CircleCheck, UserPlus } from 'lucide-react';
import { Button, FormField, Input } from '../../components';
import { solicitarAcceso } from '../../api/sesion.js';
import styles from '../Login/Login.module.css';

const VACIO = {
  username: '',
  first_name: '',
  last_name: '',
  email: '',
  password1: '',
  password2: '',
};

export default function SolicitarAcceso() {
  const [valores, setValores] = useState(VACIO);
  const [errores, setErrores] = useState({});
  const [errorGeneral, setErrorGeneral] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [enviada, setEnviada] = useState(false);

  const cambiar = (evento) => {
    const { name, value } = evento.target;
    setValores((v) => ({ ...v, [name]: value }));
    if (errores[name]) setErrores((e) => ({ ...e, [name]: undefined }));
  };

  const enviar = async (evento) => {
    evento.preventDefault();
    setErrorGeneral('');

    const encontrados = {};
    if (!valores.username.trim()) {
      encontrados.username = 'Ingresá un nombre de usuario.';
    }
    if (!valores.email.trim()) {
      encontrados.email = 'Ingresá tu correo electrónico.';
    }
    if (!valores.password1) encontrados.password1 = 'Ingresá una contraseña.';
    if (!valores.password2) {
      encontrados.password2 = 'Repetí la contraseña.';
    } else if (valores.password1 !== valores.password2) {
      encontrados.password2 = 'Las contraseñas no coinciden.';
    }
    setErrores(encontrados);
    if (Object.keys(encontrados).length) return;

    setEnviando(true);
    try {
      await solicitarAcceso({
        ...valores,
        username: valores.username.trim(),
        email: valores.email.trim(),
      });
      setEnviada(true);
    } catch (e) {
      setErrores(e.errores ?? {});
      setErrorGeneral(e.message);
      setEnviando(false);
    }
  };

  return (
    <div className={styles.pantalla}>
      <section className={styles.presentacion} aria-hidden="true">
        <span className={styles.marca}>ALUMAT</span>
        <div className={styles.textoPresentacion}>
          <p className={styles.antetitulo}>Nueva cuenta</p>
          <p className={styles.titular}>Sumate al equipo.</p>
          <p>Pedí tu acceso y el administrador lo revisará a la brevedad.</p>
        </div>
      </section>

      <main className={styles.contenido}>
        {enviada ? (
          <div className={styles.tarjeta}>
            <div className={styles.encabezado}>
              <h1 className={styles.titulo}>Solicitud enviada</h1>
              <p className={styles.subtitulo}>
                <CircleCheck aria-hidden="true" /> El administrador deberá
                aprobar tu cuenta antes de que puedas ingresar.
              </p>
            </div>
            <div className={styles.pie}>
              <p>
                <Link to="/login">Volver al ingreso</Link>
              </p>
            </div>
          </div>
        ) : (
          <form
            className={styles.tarjeta}
            onSubmit={enviar}
            noValidate
            aria-busy={enviando}
          >
            <div className={styles.encabezado}>
              <h1 className={styles.titulo}>Solicitar acceso</h1>
              <p className={styles.subtitulo}>
                Completá tus datos. El administrador deberá aprobar tu cuenta
                antes de que puedas ingresar.
              </p>
            </div>

            {errorGeneral && (
              <p className={styles.errorGeneral} role="alert">
                {errorGeneral}
              </p>
            )}

            <FormField
              label="Nombre de usuario"
              required
              error={errores.username}
              hint="Hasta 150 caracteres: letras, números y @/./+/-/_."
            >
              {(field) => (
                <Input
                  {...field}
                  name="username"
                  value={valores.username}
                  onChange={cambiar}
                  autoComplete="username"
                  autoCapitalize="none"
                  autoFocus
                  disabled={enviando}
                />
              )}
            </FormField>

            <FormField label="Nombre" error={errores.first_name}>
              {(field) => (
                <Input
                  {...field}
                  name="first_name"
                  value={valores.first_name}
                  onChange={cambiar}
                  autoComplete="given-name"
                  disabled={enviando}
                />
              )}
            </FormField>

            <FormField label="Apellido" error={errores.last_name}>
              {(field) => (
                <Input
                  {...field}
                  name="last_name"
                  value={valores.last_name}
                  onChange={cambiar}
                  autoComplete="family-name"
                  disabled={enviando}
                />
              )}
            </FormField>

            <FormField
              label="Correo electrónico"
              required
              error={errores.email}
            >
              {(field) => (
                <Input
                  {...field}
                  name="email"
                  type="email"
                  value={valores.email}
                  onChange={cambiar}
                  autoComplete="email"
                  disabled={enviando}
                />
              )}
            </FormField>

            <FormField
              label="Contraseña"
              required
              error={errores.password1}
              hint="Mínimo 10 caracteres, no solo números ni una clave común."
            >
              {(field) => (
                <Input
                  {...field}
                  name="password1"
                  type="password"
                  value={valores.password1}
                  onChange={cambiar}
                  autoComplete="new-password"
                  disabled={enviando}
                />
              )}
            </FormField>

            <FormField
              label="Confirmación de contraseña"
              required
              error={errores.password2}
            >
              {(field) => (
                <Input
                  {...field}
                  name="password2"
                  type="password"
                  value={valores.password2}
                  onChange={cambiar}
                  autoComplete="new-password"
                  disabled={enviando}
                />
              )}
            </FormField>

            <Button
              type="submit"
              icon={<UserPlus />}
              disabled={enviando}
              className={styles.boton}
            >
              {enviando ? 'Enviando...' : 'Enviar solicitud'}
            </Button>

            <div className={styles.pie}>
              <p>
                ¿Ya tenés cuenta? <Link to="/login">Volver al ingreso</Link>.
              </p>
            </div>
          </form>
        )}
      </main>
    </div>
  );
}

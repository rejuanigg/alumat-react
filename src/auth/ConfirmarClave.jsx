import { useState } from 'react';
import { Outlet } from 'react-router';
import { ShieldCheck } from 'lucide-react';
import { Button, FormField, Input, PageHeader } from '../components';
import styles from '../pages/Clientes/ClienteForm.module.css';
import useSesion from './useSesion.js';

export default function ConfirmarClave() {
  const { usuario, confirmarClave } = useSesion();
  const [confirmado, setConfirmado] = useState(false);
  const [nombre, setNombre] = useState(usuario);
  const [clave, setClave] = useState('');
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);

  if (confirmado) return <Outlet />;

  const enviar = async (evento) => {
    evento.preventDefault();
    const usuarioFinal = nombre.trim().toLowerCase();
    if (!usuarioFinal || !clave) {
      setError('Ingresá tu usuario y tu contraseña.');
      return;
    }
    setEnviando(true);
    setError('');
    try {
      await confirmarClave(usuarioFinal, clave);
      setConfirmado(true);
    } catch (e) {
      setError(e.message);
      setClave('');
      setEnviando(false);
    }
  };

  return (
    <>
      <PageHeader
        title="Confirmá tu identidad"
        subtitle="Por seguridad, volvé a ingresar tu contraseña para acceder a Cajas."
        icon={<ShieldCheck />}
      />
      <form
        className={styles.form}
        onSubmit={enviar}
        noValidate
        aria-busy={enviando}
      >
        {error && (
          <p className={styles.errorGeneral} role="alert">
            {error}
          </p>
        )}
        <section className={styles.section}>
          <div className={styles.grid}>
            {!usuario && (
              <FormField label="Nombre de usuario" required>
                {(field) => (
                  <Input
                    {...field}
                    name="usuario"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    autoComplete="username"
                    autoCapitalize="none"
                    disabled={enviando}
                  />
                )}
              </FormField>
            )}
            <FormField label="Contraseña" required>
              {(field) => (
                <Input
                  {...field}
                  name="clave"
                  type="password"
                  value={clave}
                  onChange={(e) => setClave(e.target.value)}
                  autoComplete="current-password"
                  autoFocus
                  disabled={enviando}
                />
              )}
            </FormField>
          </div>
        </section>
        <div className={styles.actions}>
          <Button type="submit" disabled={enviando}>
            {enviando ? 'Verificando...' : 'Confirmar'}
          </Button>
        </div>
      </form>
    </>
  );
}

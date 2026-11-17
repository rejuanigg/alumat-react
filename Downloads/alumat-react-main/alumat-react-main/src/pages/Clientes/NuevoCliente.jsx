import { useNavigate } from 'react-router';
import { UserPlus } from 'lucide-react';
import { PageHeader } from '../../components';
import { crearCliente } from './clientes.api.js';
import ClienteForm from './ClienteForm.jsx';

/** Pantalla "Nuevo cliente". Guarda en /api/clientes/ y vuelve al listado. */
export default function NuevoCliente() {
  const navigate = useNavigate();

  const guardar = async (datos) => {
    await crearCliente(datos);
    navigate('/clientes');
  };

  return (
    <>
      <PageHeader
        title="Nuevo cliente"
        subtitle="Completá los datos para registrar un cliente."
        icon={<UserPlus />}
      />
      <ClienteForm onGuardar={guardar} textoGuardar="Guardar Cliente" />
    </>
  );
}

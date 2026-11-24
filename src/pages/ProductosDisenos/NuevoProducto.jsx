import { useNavigate } from 'react-router';
import { PackagePlus } from 'lucide-react';
import { PageHeader } from '../../components';
import { crearProducto } from './productos.api.js';
import ProductoForm from './ProductoForm.jsx';

export default function NuevoProducto() {
  const navigate = useNavigate();

  const guardar = async (datos) => {
    await crearProducto(datos);
    navigate('/productos');
  };

  return (
    <>
      <PageHeader
        title="Nuevo producto"
        subtitle="Completá los datos para registrar un producto."
        icon={<PackagePlus />}
      />
      <ProductoForm onGuardar={guardar} />
    </>
  );
}

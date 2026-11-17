import { BrowserRouter, Link, Route, Routes } from 'react-router';
import ComponentsPreview from './pages/ComponentsPreview.jsx';
import TokensPreview from './pages/TokensPreview.jsx';
import Cajas from './pages/Cajas/Cajas.jsx';
import NuevoDiseno from './pages/Disenos/NuevoDiseno.jsx';
import Clientes from './pages/Clientes/Clientes.jsx';
import NuevoCliente from './pages/Clientes/NuevoCliente.jsx';
import EditarCliente from './pages/Clientes/EditarCliente.jsx';
import Login from './pages/Login/Login.jsx';
import ProductosDisenos from './pages/ProductosDisenos/ProductosDisenos.jsx';
import NuevoProducto from './pages/ProductosDisenos/NuevoProducto.jsx';
import EditarProducto from './pages/ProductosDisenos/EditarProducto.jsx';
import DetalleProducto from './pages/ProductosDisenos/DetalleProducto.jsx';
import DetalleCierre from './pages/Cajas/DetalleCierre.jsx';
import Inicio from './pages/Inicio/Inicio.jsx';
import Disenos from './pages/Disenos/Disenos.jsx';
import Pedidos from './pages/Pedidos/Pedidos.jsx';
import NuevoPedido from './pages/Pedidos/NuevoPedido.jsx';
import DetallePedido from './pages/Pedidos/DetallePedido.jsx';
import Ventas from './pages/Ventas/Ventas.jsx';
import DetalleVenta from './pages/Ventas/DetalleVenta.jsx';
import NuevaVenta from './pages/Ventas/NuevaVenta.jsx';
import { SesionProvider } from './auth/SesionContext.jsx';
import RutaProtegida from './auth/RutaProtegida.jsx';

function NoEncontrada() {
  return (
    <main className="app-placeholder">
      <h1>Página no encontrada</h1>
      <p>
        La dirección no existe. <Link to="/">Volver al inicio</Link>.
      </p>
    </main>
  );
}

function App() {
  return (
    <BrowserRouter>
      <SesionProvider>
        <Routes>
          {/* Páginas temporales de revisión */}
          <Route path="/tokens" element={<TokensPreview />} />
          <Route path="/componentes" element={<ComponentsPreview />} />
          <Route path="/login" element={<Login />} />
          {/* Pantallas que usan la API: piden sesión iniciada. */}
          <Route element={<RutaProtegida />}>
            <Route path="/" element={<Inicio />} />
            <Route path="/clientes" element={<Clientes />} />
            <Route path="/clientes/nuevo" element={<NuevoCliente />} />
            <Route path="/clientes/:id/editar" element={<EditarCliente />} />
            <Route path="/productos" element={<ProductosDisenos />} />
            <Route path="/productos/nuevo" element={<NuevoProducto />} />
            <Route path="/productos/:id" element={<DetalleProducto />} />
            <Route path="/productos/:id/editar" element={<EditarProducto />} />
            <Route path="/disenos" element={<Disenos />} />
            <Route path="/disenos/nuevo" element={<NuevoDiseno />} />
            <Route path="/pedidos" element={<Pedidos />} />
            <Route path="/pedidos/nuevo" element={<NuevoPedido />} />
            <Route path="/pedidos/:id" element={<DetallePedido />} />
            <Route path="/ventas-cobros" element={<Ventas />} />
            <Route path="/ventas-cobros/nueva" element={<NuevaVenta />} />
            <Route path="/ventas-cobros/:id" element={<DetalleVenta />} />
            <Route path="/cajas" element={<Cajas />} />
            <Route path="/cajas/cierres/:id" element={<DetalleCierre />} />
          </Route>
          <Route path="*" element={<NoEncontrada />} />
        </Routes>
      </SesionProvider>
    </BrowserRouter>
  );
}

export default App;

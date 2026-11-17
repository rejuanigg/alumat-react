import MainLayout from './components/MainLayout/MainLayout.jsx';
import { BrowserRouter, Link, Route, Routes } from 'react-router';
import ComponentsPreview from './pages/ComponentsPreview.jsx';
import TokensPreview from './pages/TokensPreview.jsx';
<<<<<<< HEAD
import Cajas from './pages/Cajas/Cajas.jsx';
import NuevoDiseno from './pages/Disenos/NuevoDiseno.jsx';
=======
import MovimientosTab from './pages/Cajas/MovimientosTab.jsx';
import Clientes from './pages/Clientes/Clientes.jsx';
import NuevoCliente from './pages/Clientes/NuevoCliente.jsx';
import EditarCliente from './pages/Clientes/EditarCliente.jsx';
import Login from './pages/Login/Login.jsx';
import ProductosDisenos from './pages/ProductosDisenos/ProductosDisenos.jsx';
import { SesionProvider } from './auth/SesionContext.jsx';
import RutaProtegida from './auth/RutaProtegida.jsx';
>>>>>>> 7cdbc8a (feat:añadir productos a paginacion)

function Inicio() {
  return (
    <main className="app-placeholder">
      <h1>ALUMAT</h1>
      <p>
        Base de estilos lista. Revisá los tokens en{' '}
        <Link to="/tokens">/tokens</Link> y los componentes en{' '}
        <Link to="/componentes">/componentes</Link>.
      </p>
    </main>
  );
}
function PaginaPendiente({ titulo }) {
  return (
    <main className="app-placeholder">
      <h1>{titulo}</h1>
      <p>Pantalla en desarrollo.</p>
      <Link to="/">Volver al inicio</Link>
    </main>
  );
}
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
          <Route path="/" element={<Inicio />} />
          {/* Páginas temporales de revisión */}
          <Route path="/tokens" element={<TokensPreview />} />
          <Route path="/componentes" element={<ComponentsPreview />} />
          <Route path="/login" element={<Login />} />
          {/* Pantallas que usan la API: piden sesión iniciada. */}
          <Route element={<RutaProtegida />}>
            <Route path="/clientes" element={<Clientes />} />
            <Route path="/clientes/nuevo" element={<NuevoCliente />} />
            <Route path="/clientes/:id/editar" element={<EditarCliente />} />
          </Route>
          <Route path="/productos" element={<ProductosDisenos />} />
          <Route
            path="/disenos"
            element={<PaginaPendiente titulo="Diseños" />}
          />
          <Route
            path="/pedidos"
            element={<PaginaPendiente titulo="Pedidos" />}
          />
          <Route
            path="/ventas-cobros"
            element={<PaginaPendiente titulo="Ventas y cobros" />}
          />
          <Route path="/cajas" element={<PaginaPendiente titulo="Cajas" />} />
          <Route
            path="/layout-preview"
            element={
              <MainLayout
                headerProps={{
                  userName: 'Valentina',
                  role: 'Administración',
                  hasNotifications: true,
                }}
              >
                <h1>Prueba del MainLayout</h1>
                <p>Sidebar, Header y contenido integrados.</p>
              </MainLayout>
            }
          />
          {/* Temporal: para probar la pestaña hasta que exista la pantalla Cajas */}
          <Route
            path="/preview/cajas-movimientos"
            element={
              <MainLayout>
                <MovimientosTab />
              </MainLayout>
            }
          />
          <Route path="*" element={<NoEncontrada />} />
        </Routes>
      </SesionProvider>
    </BrowserRouter>
  );
}

export default App;

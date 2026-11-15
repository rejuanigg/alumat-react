import MainLayout from './components/MainLayout/MainLayout.jsx';
import { BrowserRouter, Link, Route, Routes } from 'react-router';
import ComponentsPreview from './pages/ComponentsPreview.jsx';
import TokensPreview from './pages/TokensPreview.jsx';

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
      <Routes>
        <Route path="/" element={<Inicio />} />
        {/* Páginas temporales de revisión */}
        <Route path="/tokens" element={<TokensPreview />} />
        <Route path="/componentes" element={<ComponentsPreview />} />
        <Route
          path="/clientes"
          element={<PaginaPendiente titulo="Clientes" />}
        />
        <Route
          path="/productos"
          element={<PaginaPendiente titulo="Productos" />}
        />
        <Route path="/disenos" element={<PaginaPendiente titulo="Diseños" />} />
        <Route path="/pedidos" element={<PaginaPendiente titulo="Pedidos" />} />
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
        <Route path="*" element={<NoEncontrada />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Clientes from './pages/Clientes';
import Pagos from './pages/Pagos';
import Cobrar from './pages/Cobrar';
import NuevoCliente from './pages/NuevoCliente';
import PerfilCliente from './pages/PerfilCliente';
import EditarCliente from './pages/EditarCliente';
import Vencidos from './pages/Vencidos'; 
import Caja from './pages/Caja';     
import HistorialCliente from './pages/HistorialCliente';
  
function App() {
  return (
    <BrowserRouter>
      {/* Agregamos este div contenedor con clases de Tailwind */}
      {/* min-h-screen: Ocupa al menos el 100% de la altura de la pantalla */}
      {/* bg-gray-900: Fondo gris muy oscuro (casi negro) */}
      {/* text-white: Todo el texto adentro será blanco por defecto */}
      <div className="min-h-screen bg-gray-900 text-white">
        
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/clientes" element={<Clientes />} />
          <Route path="/clientes/:id" element={<PerfilCliente />} />
          <Route path="/clientes/nuevo" element={<NuevoCliente />} />
          <Route path="/clientes/editar/:id" element={<EditarCliente />} />
          <Route path="/clientes/:id/historial" element={<HistorialCliente />} />
          <Route path="/pagos" element={<Pagos />} />
          <Route path="/cobrar" element={<Cobrar />} />
          <Route path="/cobrar/:id" element={<Caja />} />
          <Route path="/vencidos" element={<Vencidos />} />
        </Routes>

      </div>
    </BrowserRouter>
  );
}

export default App;
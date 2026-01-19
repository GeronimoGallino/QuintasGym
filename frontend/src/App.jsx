// frontend/src/App.jsx

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
import Login from './pages/Login';

import { AuthProvider } from './context/AuthContext'; // Importamos el Contexto
import PrivateRoute from './components/PrivateRoute'; // Importamos el Portero
function App() {
  return (
    <AuthProvider>  
      <BrowserRouter>
        <div className="min-h-screen bg-gray-900 text-white">
          
          <Routes>
            {/* Ruta Pública */}
            <Route path="/login" element={<Login />} />

            {/* Rutas Privadas (Protegidas) */}
            <Route element={<PrivateRoute />}>

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
              <Route path="*" element={<Dashboard />} />

            </Route>
          </Routes>

        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
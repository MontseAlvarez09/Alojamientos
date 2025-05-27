import React from 'react';
import { Routes, Route , useParams} from 'react-router-dom';
import LayoutConEncabezado from './Componentes/Layout/LayoutConEncabezado';
import PaginaPrincipal from './Paginas/PaginaPrincipal';
import PaginaPrincipalAdministrativa from './Paginas/PaginaPrincipalAdministrativa';
import PaginaPrincipalCliente from './Paginas/PaginaPrincipalCliente';
import { ThemeProvider } from './Componentes/Temas/ThemeContext';
import { AuthProvider } from './Componentes/Autenticacion/AuthContext';
import Login from './Componentes/Autenticacion/Login';
import Registro from './Componentes/Autenticacion/Registro';
import VerificarCorreo from './Componentes/Autenticacion/VerificarCorreo';
import ValidarCodigo from './Componentes/Autenticacion/ValidarCodigo';
import SolicitarCodigo from './Componentes/Autenticacion/SolicitarCodigo';
import Perfil from './Componentes/Administrativo/Perfil';
import HotelesR from './Componentes/Administrativo/Hoteles';
import HotelesP from './Componentes/Publico/HotelesP';
import Politicas from './Componentes/Administrativo/Politica';
import Cuartos from './Componentes/Administrativo/Cuartos';
import CuartosP from './Componentes/Publico/CuartosP';
import DetallesHabitacion from './Componentes/Publico/DetalleHabitacion';
import CambiarPassword from './Componentes/Autenticacion/CambiarPassword';
import Terminos from './Componentes/Administrativo/Terminos';
import Vision from './Componentes/Administrativo/Vision';
import Mision from './Componentes/Administrativo/Mision';
import PoliticasPCA from './Componentes/Compartidos/PoliticasPCA';
import TerminosPCA from './Componentes/Compartidos/TerminosPCA';
import VisionPCA from './Componentes/Compartidos/VisionPCA';
import MisionPCA from './Componentes/Compartidos/MisionPCA';

const CuartosPWrapper = () => {
  const { idHotel } = useParams(); // Extrae idHotel de la URL
  return <CuartosP idHotel={idHotel} />;
};


const App = () => {
  return (
    <AuthProvider>
      <ThemeProvider>
        <LayoutConEncabezado>
          <Routes>
            <Route path="/" element={<PaginaPrincipal />} />
            <Route path="/login" element={<Login />} />
            <Route path="/registro" element={<Registro />} />
            <Route path="/verificar-correo" element={<VerificarCorreo />} />
            <Route path="/validar-codigo" element={<ValidarCodigo />} />
            <Route path="/verificar_correo" element={<SolicitarCodigo />} />
            <Route path="/hotelesp" element={<HotelesP />} />
            <Route path="/cuartosp/:idHotel" element={<CuartosPWrapper />} />
            <Route path="/detalles-habitacion/:idHabitacion" element={<DetallesHabitacion />} />
            <Route path="/cambiar_password" element={<CambiarPassword />} />
            <Route path="/politicaspca" element={<PoliticasPCA/>} />
            <Route path="/terminospca" element={<TerminosPCA/>} />
            <Route path="/visionpca" element={<VisionPCA/>} />
            <Route path="/misionpca" element={<MisionPCA/>} />
            
            

            {/* Rutas para la administración */}



            <Route path="/admin" element={<PaginaPrincipalAdministrativa />} />
            <Route path="/admin/perfil" element={<Perfil />} />
            <Route path="/admin/hoteles" element={<HotelesR />} />
            <Route path="/admin/cuartos" element={<Cuartos />} />
            <Route path="admin/politicas" element={<Politicas/>} />
            <Route path="/admin/terminos" element={<Terminos />} />
            <Route path="/admin/vision" element={<Vision />} />
            <Route path="/admin/mision" element={<Mision />} />

            <Route path="/admin/politicaspca" element={<PoliticasPCA/>} />
            <Route path="/admin/terminospca" element={<TerminosPCA/>} />
            <Route path="/admin/visionpca" element={<VisionPCA/>} />
            <Route path="/admin/misionpca" element={<MisionPCA/>} />
            
            {/* Rutas para el cliente */}
            <Route path="/cliente/politicaspca" element={<PoliticasPCA/>} />
            <Route path="/cliente/terminospca" element={<TerminosPCA/>} />
            <Route path="/cliente/visionpca" element={<VisionPCA/>} />
            <Route path="/cliente/misionpca" element={<MisionPCA/>} />

            





            <Route path="/cliente" element={<PaginaPrincipalCliente />} />
            
          </Routes>
        </LayoutConEncabezado>
      </ThemeProvider>
    </AuthProvider>
  );
};

export default App;
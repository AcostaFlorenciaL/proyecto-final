import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import Navegador from './assets/componentesCliente/navegador/Nav';
import Perfil from './assets/componentesCliente/cuenta/Perfil';
import Menu from './assets/componentesCliente/Menu/Menu';
import Login from './assets/componentesCliente/Sesion/Login';
import Footer from './assets/componentesCliente/Footer/Footer';
import Carrito from './assets/componentesCliente/Carrito/Carrito';
import MisPedidos from './assets/componentesCliente/Mis pedidos/Mispedidos';
import Inicio from './assets/componentesCliente/Inicio/Inicio';
import Registro from './assets/componentesCliente/Sesion/Registro';
import AdminPage  from './assets/componentesAdmin/admin/AdminPage';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
//import './App.css';

function App() {
  return (
    <CartProvider>
    <Router>
      <div className="App">
        <Navegador />

        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/carta" element={<Menu />} />
          <Route path="/pedidos" element={<MisPedidos />} />
          <Route path="/info" element={<InfoRedirect />} />
          <Route path="/carrito" element={<Carrito />} />
          <Route path="/perfil" element={<Perfil />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/admin" element={<AdminPage/>} />
        </Routes>
        <Footer />
      </div>
    </Router>
    </CartProvider>
  );
}
const InfoRedirect = () => {
  const navigate = useNavigate();
  
  React.useEffect(() => {
    navigate('/');
    setTimeout(() => {
      const elemento = document.getElementById('ubicacion');
      if (elemento) {
        elemento.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  }, [navigate]);

  return null;
};

export default App;
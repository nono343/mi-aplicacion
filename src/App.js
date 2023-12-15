import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { jwtDecode as jwt_decode } from 'jwt-decode';

// Importa los componentes y hooks necesarios
import Login from './components/Login';
import UseToken from './components/useToken';
import Admin from './pages/admin';
import Register from './components/Register';
import Categorias from './pages/categories';
import DetalleProducto from './pages/products';
import Init from './pages/init';
import Navbar from './components/navbar';


function App() {
  // Obtiene el token y las funciones relacionadas con el token usando el hook useToken
  const { token, removeToken, setToken } = UseToken();

  // Decodificar el token para acceder a sus campos
  const decodedToken = token ? jwt_decode(token) : null;

  // Verificar si el usuario es un administrador
  const isAdmin = decodedToken && decodedToken.isAdmin === 'admin';

  const [isSpanish, setIsSpanish] = useState(true);

  const handleLogout = () => {
    removeToken();
  };

  // Renderiza el componente Navbar solo si existe un token válido
  return (
    <BrowserRouter>
      {token && (
        <Navbar
          token={token}
          setToken={setToken}
          isSpanish={isSpanish}
          setIsSpanish={setIsSpanish}
          onLogout={handleLogout}
        />
      )}

      {/* Renderiza las rutas condicionalmente dependiendo de la existencia del token */}
      <Routes>
        {/* Rutas específicas */}
        {token ? (
          <>
            <Route path='/inicio' element={<Init token={token} setToken={setToken} isSpanish={isSpanish}  />} />
            <Route path='/categorias/:id' element={<Categorias token={token} setToken={setToken} isSpanish={isSpanish}  />} />
            <Route path='/categories/:category_id/products/:product_id' element={<DetalleProducto token={token} setToken={setToken} isSpanish={isSpanish}/>} />
            {/* Ruta de administrador */}
            {isAdmin && <Route path='/admin' element={<Admin token={token} setToken={setToken} />} />}
          </>
        ) : (
          // Ruta de inicio de sesión predeterminada
          <Route path='/*' element={<Navigate to="/" />} />
        )}

        {/* Rutas de inicio de sesión y registro */}
        <Route path='/' element={<Login setToken={setToken} token={token} />} />
        <Route path='/register' element={<Register setToken={setToken} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

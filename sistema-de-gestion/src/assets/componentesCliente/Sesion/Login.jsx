import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '/src/api/api.js'; // <-- Importar desde api.js
import './login.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Usar la función de la API
      const data = await login(email, password);

      console.log('✅ Login exitoso:', data);

      // GUARDAR EN sessionStorage
      // El backend devuelve el objeto 'user' y el 'access_token'
      sessionStorage.setItem('userId', data.user.id_usuarios);
      sessionStorage.setItem('userEmail', data.user.email);
      sessionStorage.setItem('userName', data.user.nombreCompleto);
      sessionStorage.setItem('userRol', data.user.rol);
      sessionStorage.setItem('token', data.access_token); // Guardar el token
      sessionStorage.setItem('isLoggedIn', 'true');

      // Mensaje de bienvenida
      alert(`¡Bienvenido ${data.user.nombreCompleto}!`);

      // Redirigir según el rol
      if (data.user.rol === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }

    } catch (err) {
      console.error('❌ Error:', err);
      setError(err.message || "No se pudo conectar con el servidor.");
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-form-container">
        <div className="login-form">
          <h1 className="login-title">BIENVENIDO A LA ESQUINA BAR</h1>
          <p className="login-subtitle">
            INICIA SESIÓN CON TU CORREO ELECTRÓNICO Y CONTRASEÑA.
          </p>

          {/* El CSS original usa 'login-error' pero el JSX usa 'error-message'
              Asegúrate de que 'login.css' tenga la clase .login-error 
              o cambia esto a className="error-message" 
          */}
          {error && <p className="error-message">⚠️ {error}</p>}

          <form onSubmit={handleSubmit}>
            <input
              type="email"
              className="login-input"
              placeholder="Correo electrónico..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />

            <input
              type="password"
              className="login-input"
              placeholder="Contraseña..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />

            <button type="submit" className="login-button" disabled={loading}>
              {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </button>
          </form>

          <p className="login-footer">
            ¿NO TENÉS CUENTA?
            <Link to="/registro" className="login-link">
              CREAR
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
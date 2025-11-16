import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
      const response = await fetch("http://localhost:8000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email,
          contraseña: password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.detail || "Error al iniciar sesión");
        setLoading(false);
        return;
      }

      console.log('✅ Login exitoso:', data);

      // ✅ GUARDAR EN sessionStorage (NO localStorage)
      sessionStorage.setItem('userId', data.user.id_usuarios);
      sessionStorage.setItem('userEmail', data.user.email);
      sessionStorage.setItem('userName', data.user.nombreCompleto);
      sessionStorage.setItem('userRol', data.user.rol);
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
      setError("No se pudo conectar con el servidor.");
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

          {error && <p className="login-error">⚠️ {error}</p>}

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
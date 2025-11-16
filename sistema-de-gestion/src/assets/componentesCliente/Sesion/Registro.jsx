import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registro } from '/src/api/api.js';
import './login.css';

function Registro() {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [telefono, setTelefono] = useState('');
  const [direccion, setDireccion] = useState(''); // ✅ AGREGADO
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      setLoading(false);
      return;
    }

    try {
      const userData = {
        email,
        contraseña: password,
        nombreCompleto: nombre,
        telefono,
        direccion  // ✅ AGREGADO
      };

      console.log('📤 Enviando registro:', userData);
      
      const responseData = await registro(userData);

      console.log('✅ Usuario registrado:', responseData);

      setSuccess("✅ Registro exitoso. Redirigiendo al login...");

      setTimeout(() => {
        navigate("/login");
      }, 2000);

    } catch (err) {
      console.error('💥 Error:', err);
      setError(err.message || "No se pudo conectar con el servidor.");
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-form-container">
        <div className="login-form">
          <h1 className="login-title">CREAR CUENTA</h1>
          <p className="login-subtitle">Complete sus datos para registrarse.</p>

          {error && <p className="error-message">⚠️ {error}</p>}
          {success && <p className="success-message">{success}</p>}

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              className="login-input"
              placeholder="Nombre completo..."
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
              disabled={loading}
            />

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
              placeholder="Contraseña (mínimo 6 caracteres)..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              disabled={loading}
            />

            <input
              type="tel"
              className="login-input"
              placeholder="Teléfono..."
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              required
              disabled={loading}
            />

            {/* ✅ NUEVO CAMPO DIRECCIÓN */}
            <input
              type="text"
              className="login-input"
              placeholder="Dirección de entrega..."
              value={direccion}
              onChange={(e) => setDireccion(e.target.value)}
              required
              disabled={loading}
            />

            <button 
              type="submit" 
              className="login-button"
              disabled={loading}
            >
              {loading ? 'Registrando...' : 'Registrarse'}
            </button>
          </form>

          <p className="login-footer">
            ¿Ya tienes cuenta?{' '}
            <a href="/login" className="login-link">
              Iniciar sesión
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Registro;
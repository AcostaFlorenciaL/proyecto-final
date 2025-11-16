import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './login.css';

function Registro() {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [telefono, setTelefono] = useState('');
  const [direccion, setDireccion] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    // Validaciones básicas
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      setLoading(false);
      return;
    }

    try {
      console.log('📤 Enviando registro:', {
        email,
        nombreCompleto: nombre,
        telefono
      });

      const response = await fetch("http://localhost:8000/api/auth/registro", {  // ← CAMBIO AQUÍ
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          contraseña: password,
          nombreCompleto: nombre,
          telefono,
        }),
      });

      console.log('📥 Response status:', response.status);

      if (!response.ok) {
        const data = await response.json();
        console.error('❌ Error del backend:', data);
        
        // Manejar diferentes tipos de errores
        if (typeof data.detail === 'string') {
          setError(data.detail);
        } else if (Array.isArray(data.detail)) {
          // Si es un array de errores de validación
          const errores = data.detail.map(err => err.msg).join(', ');
          setError(errores);
        } else {
          setError('Error al registrar usuario');
        }
        setLoading(false);
        return;
      }

      const userData = await response.json();
      console.log('✅ Usuario registrado:', userData);

      setSuccess("✅ Registro exitoso. Redirigiendo al login...");

      // Redirigir después de 2 segundos
      setTimeout(() => {
        navigate("/login");
      }, 2000);

    } catch (err) {
      console.error('💥 Error:', err);
      setError("No se pudo conectar con el servidor. Verifica que el backend esté corriendo.");
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
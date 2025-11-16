import React, { useState } from 'react';


export default function Login({ onLoginSuccess }) {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Modo demo: si no hay backend, usar datos de prueba
  const MODO_DEMO = true; // Cambia a false cuando tengas el backend listo

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (MODO_DEMO) {
        // Simular delay de red
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Validar credenciales de prueba
        if (formData.email === 'admin@test.com' && formData.password === 'admin123') {
          const userData = {
            id: 1,
            email: formData.email,
            nombre: 'Administrador',
            rol: 'admin',
            token: 'demo-token-123456'
          };

          // Guardar en localStorage
          localStorage.setItem('usuario', JSON.stringify(userData));
          
          // Llamar callback de éxito
          if (onLoginSuccess) {
            onLoginSuccess(userData);
          }
        } else {
          throw new Error('Credenciales incorrectas. Usa admin@test.com / admin123');
        }
      } else {
        // Modo producción: usar el backend real
        const response = await fetch('http://localhost:8000/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData)
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.detail || 'Error al iniciar sesión');
        }

        // Guardar datos del usuario en localStorage
        localStorage.setItem('usuario', JSON.stringify(data));
        
        // Llamar callback de éxito
        if (onLoginSuccess) {
          onLoginSuccess(data);
        }
      }

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-card-body">
          {/* Header */}
          <div className="login-header">
            <div className="login-logo">
              <i className="bi bi-shop"></i>
            </div>
            <h1 className="login-title">Bienvenido</h1>
            <p className="login-subtitle">Ingresa tus credenciales para continuar</p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="login-alert">
              <i className="bi bi-exclamation-triangle-fill"></i>
              <span>{error}</span>
              <button 
                type="button" 
                className="btn-close ms-auto" 
                onClick={() => setError('')}
              ></button>
            </div>
          )}

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="login-form">
            <div className="login-form-group">
              <label htmlFor="email" className="login-form-label">
                <i className="bi bi-envelope"></i>
                Correo electrónico
              </label>
              <input
                type="email"
                className="login-form-control"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="admin@ejemplo.com"
                required
                disabled={loading}
              />
            </div>

            <div className="login-form-group">
              <label htmlFor="password" className="login-form-label">
                <i className="bi bi-lock"></i>
                Contraseña
              </label>
              <input
                type="password"
                className="login-form-control"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              className="login-btn-submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="login-spinner"></div>
                  Iniciando sesión...
                </>
              ) : (
                <>
                  <i className="bi bi-box-arrow-in-right"></i>
                  Iniciar Sesión
                </>
              )}
            </button>
          </form>

          {/* Info de prueba */}
          {MODO_DEMO && (
            <div className="login-info">
              <p className="login-info-title">
                <i className="bi bi-info-circle"></i>
                Modo Demo - Datos de prueba:
              </p>
              <p className="login-info-text">
                <strong>Email:</strong> admin@test.com
              </p>
              <p className="login-info-text">
                <strong>Password:</strong> admin123
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
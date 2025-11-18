
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './perfil.css';

const Perfil = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [showAlert, setShowAlert] = useState({ show: false, message: '', type: '' });
  const [cargando, setCargando] = useState(true);
  
  const [userData, setUserData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    direccion: ''
  });

  const [originalData, setOriginalData] = useState({ ...userData });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    cargarDatosUsuario();
  }, [navigate]);

  const cargarDatosUsuario = async () => {
    try {
      const email = sessionStorage.getItem('userEmail');
      const userId = sessionStorage.getItem('userId');
      
      if (!userId) {
        navigate('/login');
        return;
      }

      // Obtener datos del usuario desde el backend
      const response = await fetch(`http://localhost:8000/api/auth/usuarios/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        
        // Obtener info del cliente (dirección, etc)
        const clienteResponse = await fetch(`http://localhost:8000/api/auth/cliente/usuario/${userId}`);
        let clienteData = null;
        
        if (clienteResponse.ok) {
          clienteData = await clienteResponse.json();
        }

        setUserData({
          nombre: data.nombreCompleto || '',
          email: data.email || email || '',
          telefono: data.telefono || '',
          direccion: clienteData?.direccion || ''
        });
        
        setOriginalData({
          nombre: data.nombreCompleto || '',
          email: data.email || email || '',
          telefono: data.telefono || '',
          direccion: clienteData?.direccion || ''
        });
      } else {
        console.error('Error al cargar datos del usuario');
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setCargando(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const displayAlert = (message, type) => {
    setShowAlert({ show: true, message, type });
    setTimeout(() => {
      setShowAlert({ show: false, message: '', type: '' });
    }, 5000);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setUserData({ ...originalData });
    setIsEditing(false);
  };

  const handleSave = async (e) => {
    if (e) {
      e.preventDefault();
    }

    if (!userData.nombre || !userData.telefono || !userData.direccion) {
      displayAlert('Complete todos los campos obligatorios', 'danger');
      return;
    }

    try {
      const userId = sessionStorage.getItem('userId');
      const response = await fetch(`http://localhost:8000/api/auth/usuarios/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          nombreCompleto: userData.nombre,
          telefono: userData.telefono,
          direccion: userData.direccion
        })
      });

      if (response.ok) {
        const responseData = await response.json();
        console.log('✅ Perfil actualizado:', responseData);
        
        setOriginalData({ ...userData });
        setIsEditing(false);
        displayAlert('Datos actualizados correctamente', 'success');
        
        // Recargar los datos para verificar que se guardaron
        setTimeout(() => {
          cargarDatosUsuario();
        }, 500);
      } else {
        const errorData = await response.json();
        console.error('Error en la respuesta:', errorData);
        displayAlert('Error al actualizar los datos: ' + (errorData.detail || 'Error desconocido'), 'danger');
      }
    } catch (error) {
      console.error('Error:', error);
      displayAlert('Error al actualizar los datos: ' + error.message, 'danger');
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      displayAlert('Complete todos los campos obligatorios', 'danger');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      displayAlert('La contraseña debe tener al menos 6 caracteres', 'danger');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      displayAlert('Las contraseñas nuevas no coinciden', 'danger');
      return;
    }

    try {
      const userId = sessionStorage.getItem('userId');
      const response = await fetch(`http://localhost:8000/api/auth/cambiar-contraseña/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        })
      });

      if (response.ok) {
        displayAlert('Contraseña actualizada correctamente', 'success');
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      } else {
        const errorData = await response.json();
        displayAlert(errorData.detail || 'Error al cambiar la contraseña', 'danger');
      }
    } catch (error) {
      console.error('Error:', error);
      displayAlert('Error al cambiar la contraseña', 'danger');
    }
  };

  const handleLogout = () => {
    if (window.confirm('¿Está seguro que desea cerrar sesión?')) {
      // Limpiar el almacenamiento
      sessionStorage.removeItem('userId');
      sessionStorage.removeItem('email');
      sessionStorage.removeItem('isLoggedIn');
      localStorage.removeItem('userId');
      localStorage.removeItem('email');
      localStorage.removeItem('isLoggedIn');
      
      // Navegar al login
      navigate('/login');
    }
  };

  return (
    <div className="profile-page">
      <div className="profile-container">
        {cargando ? (
          <div className="text-center mt-5">
            <p>Cargando datos del perfil...</p>
          </div>
        ) : (
          <>
            {showAlert.show && (
              <div className={`alert alert-${showAlert.type} alert-custom alert-dismissible fade show`} role="alert">
                <i className={`bi ${showAlert.type === 'success' ? 'bi-check-circle' : 'bi-exclamation-triangle'} me-2`}></i>
                {showAlert.message}
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setShowAlert({ show: false, message: '', type: '' })}
                  aria-label="Close"
                ></button>
              </div>
            )}

            <div className="profile-card">
              <div className="profile-header">
                <div className="profile-avatar">
                  <i className="bi bi-person-fill"></i>
                </div>
                <h2>{userData.nombre}</h2>
                <p className="mb-0">{userData.email}</p>
              </div>

              <div className="profile-body">
                <div className="section-title">
                  <i className="bi bi-person-badge me-2"></i>Información Personal
                </div>

                <div>
                  <div className="mb-3">
                    <label className="form-label">Nombre <span className="text-danger">*</span></label>
                    <input
                      type="text"
                      className="form-control"
                      name="nombre"
                      value={userData.nombre}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Correo Electrónico <span className="text-danger">*</span></label>
                    <input
                      type="email"
                      className="form-control"
                      name="email"
                      value={userData.email}
                      disabled
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Teléfono <span className="text-danger">*</span></label>
                    <input
                      type="tel"
                      className="form-control"
                      name="telefono"
                      value={userData.telefono}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Dirección <span className="text-danger">*</span></label>
                    <input
                      type="text"
                      className="form-control"
                      name="direccion"
                      value={userData.direccion}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      required
                    />
                  </div>

                  <div className="d-flex gap-2 flex-wrap">
                    {!isEditing ? (
                      <button type="button" className="btn btn-primary-custom" onClick={handleEdit}>
                        <i className="bi bi-pencil-square me-2"></i>Editar Perfil
                      </button>
                    ) : (
                      <>
                        <button type="button" className="btn btn-primary-custom" onClick={handleSave}>
                          <i className="bi bi-check-circle me-2"></i>Guardar Cambios
                        </button>
                        <button type="button" className="btn btn-secondary-custom" onClick={handleCancel}>
                          <i className="bi bi-x-circle me-2"></i>Cancelar
                        </button>
                      </>
                    )}
                  </div>
                </div>

                <div className="password-section">
                  <div className="section-title">
                    <i className="bi bi-shield-lock me-2"></i>Cambiar Contraseña
                  </div>

                  <form onSubmit={handlePasswordSubmit}>
                    <div className="mb-3">
                      <label className="form-label">Contraseña Actual <span className="text-danger">*</span></label>
                      <input
                        type="password"
                        className="form-control"
                        name="currentPassword"
                        value={passwordData.currentPassword}
                        onChange={handlePasswordChange}
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Nueva Contraseña <span className="text-danger">*</span></label>
                      <input
                        type="password"
                        className="form-control"
                        name="newPassword"
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange}
                        minLength="6"
                        required
                      />
                      <small className="text-muted">Mínimo 6 caracteres</small>
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Confirmar Nueva Contraseña <span className="text-danger">*</span></label>
                      <input
                        type="password"
                        className="form-control"
                        name="confirmPassword"
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordChange}
                        minLength="6"
                        required
                      />
                    </div>

                    <button type="submit" className="btn btn-primary-custom">
                      <i className="bi bi-key me-2"></i>Cambiar Contraseña
                    </button>
                  </form>
                </div>

                <div className="mt-4 text-center">
                  <button className="btn btn-outline-danger" onClick={handleLogout}>
                    <i className="bi bi-box-arrow-right me-2"></i>Cerrar Sesión
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Perfil;
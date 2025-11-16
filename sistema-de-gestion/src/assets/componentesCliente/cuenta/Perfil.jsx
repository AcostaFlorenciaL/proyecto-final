
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './perfil.css';

const Perfil = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [showAlert, setShowAlert] = useState({ show: false, message: '', type: '' });
  
  const [userData, setUserData] = useState({
    nombre: 'Juan',
    apellido: 'Pérez',
    email: 'juan.perez@email.com',
    telefono: '+54 11 1234-5678',
    direccion: 'Av. Corrientes 1234, CABA'
  });

  const [originalData, setOriginalData] = useState({ ...userData });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    const isLoggedIn = sessionStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
      navigate('/login');
    }
  }, [navigate]);

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

  const handleSave = (e) => {
    e.preventDefault();

    if (!userData.nombre || !userData.apellido || !userData.telefono || !userData.direccion) {
      displayAlert('Complete todos los campos obligatorios', 'danger');
      return;
    }

    setOriginalData({ ...userData });
    setIsEditing(false);
    displayAlert('Datos actualizados correctamente', 'success');
  };

  const handlePasswordSubmit = (e) => {
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

    displayAlert('Contraseña actualizada correctamente', 'success');
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  };

  const handleLogout = () => {
    if (window.confirm('¿Está seguro que desea cerrar sesión?')) {
      sessionStorage.clear();
      localStorage.clear();
      navigate('/login');
    }
  };

  return (
    <div className="profile-page">
      <div className="profile-container">
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
            <h2>{userData.nombre} {userData.apellido}</h2>
            <p className="mb-0">{userData.email}</p>
          </div>

          <div className="profile-body">
            <div className="section-title">
              <i className="bi bi-person-badge me-2"></i>Información Personal
            </div>

            <form onSubmit={handleSave}>
              <div className="row mb-3">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Nombre <span className="text-danger">*</span></label>
                  <input
                    type="text"
                    className="form-control"
                    name="nombre"
                    value={userData.nombre}
                    onChange={handleInputChange}
                    readOnly={!isEditing}
                    required
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Apellido <span className="text-danger">*</span></label>
                  <input
                    type="text"
                    className="form-control"
                    name="apellido"
                    value={userData.apellido}
                    onChange={handleInputChange}
                    readOnly={!isEditing}
                    required
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label">Correo Electrónico <span className="text-danger">*</span></label>
                <input
                  type="email"
                  className="form-control"
                  name="email"
                  value={userData.email}
                  readOnly
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
                  readOnly={!isEditing}
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
                  readOnly={!isEditing}
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
                    <button type="submit" className="btn btn-primary-custom">
                      <i className="bi bi-check-circle me-2"></i>Guardar Cambios
                    </button>
                    <button type="button" className="btn btn-secondary-custom" onClick={handleCancel}>
                      <i className="bi bi-x-circle me-2"></i>Cancelar
                    </button>
                  </>
                )}
              </div>
            </form>

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
      </div>
    </div>
  );
};

export default Perfil;
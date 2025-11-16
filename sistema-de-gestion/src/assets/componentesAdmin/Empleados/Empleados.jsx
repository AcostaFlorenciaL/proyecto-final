import React, { useState, useEffect } from 'react';
//import './Empleados.css';

export default function Empleados() {
  const [empleados, setEmpleados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [empleadoEditando, setEmpleadoEditando] = useState(null);
  const [filtroPuesto, setFiltroPuesto] = useState('todos');
  
  const [formData, setFormData] = useState({
    nombre_completo: '',
    puesto: '',
    telefono: '',
    email: ''
  });

  const puestos = ['Caja', 'Meseros', 'Cocina', 'Limpieza', 'Reparto', 'Barra', 'Supervisión'];

  // Cargar empleados al montar el componente
  useEffect(() => {
    cargarEmpleados();
  }, []);

  const cargarEmpleados = async () => {
    try {
      setLoading(true);
      const url = filtroPuesto === 'todos' 
        ? 'http://localhost:8000/personal/'
        : `http://localhost:8000/personal/puesto/${filtroPuesto}`;
      
      const response = await fetch(url);
      if (!response.ok) throw new Error('Error al cargar empleados');
      
      const data = await response.json();
      setEmpleados(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Recargar cuando cambia el filtro
  useEffect(() => {
    cargarEmpleados();
  }, [filtroPuesto]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const abrirModalNuevo = () => {
    setEmpleadoEditando(null);
    setFormData({
      nombre_completo: '',
      puesto: '',
      telefono: '',
      email: ''
    });
    setMostrarModal(true);
  };

  const editarEmpleado = (empleado) => {
    setEmpleadoEditando(empleado);
    setFormData({
      nombre_completo: empleado.nombre_completo,
      puesto: empleado.puesto,
      telefono: empleado.telefono || '',
      email: empleado.email
    });
    setMostrarModal(true);
  };

  const guardarEmpleado = async () => {
    try {
      const url = empleadoEditando
        ? `http://localhost:8000/empleados/${empleadoEditando.id_personal}`
        : 'http://localhost:8000/empleados/';
      
      const method = empleadoEditando ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error('Error al guardar empleado');
      
      await cargarEmpleados();
      setMostrarModal(false);
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const eliminarEmpleado = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este empleado?')) {
      try {
        const response = await fetch(`http://localhost:8000/empleados/${id}`, {
          method: 'DELETE'
        });

        if (!response.ok) throw new Error('Error al eliminar empleado');
        
        await cargarEmpleados();
        setError(null);
      } catch (err) {
        setError(err.message);
      }
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
        <p className="mt-3">Cargando empleados...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Gestión de Empleados</h1>
        <button className="btn btn-primary" onClick={abrirModalNuevo}>
          <i className="bi bi-plus-circle me-2"></i>
          Nuevo Empleado
        </button>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          {error}
          <button 
            type="button" 
            className="btn-close" 
            onClick={() => setError(null)}
          ></button>
        </div>
      )}

      {/* Filtros */}
      <div className="mb-3">
        <label className="me-2 fw-semibold">Filtrar por puesto:</label>
        <select
          className="form-select d-inline-block w-auto"
          value={filtroPuesto}
          onChange={(e) => setFiltroPuesto(e.target.value)}
        >
          <option value="todos">Todos</option>
          {puestos.map(puesto => (
            <option key={puesto} value={puesto}>{puesto}</option>
          ))}
        </select>
        <span className="ms-3 text-muted">
          Total: {empleados.length} empleado{empleados.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Tabla de empleados */}
      <div className="card shadow">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead className="table-dark">
                <tr>
                  <th>ID</th>
                  <th>Nombre Completo</th>
                  <th>Puesto</th>
                  <th>Teléfono</th>
                  <th>Email</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {empleados.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-4 text-muted">
                      <i className="bi bi-inbox fs-1 d-block mb-2"></i>
                      No hay empleados registrados
                    </td>
                  </tr>
                ) : (
                  empleados.map((empleado) => (
                    <tr key={empleado.id_personal}>
                      <td>#{empleado.id_personal}</td>
                      <td>
                        <i className="bi bi-person-fill text-primary me-2"></i>
                        {empleado.nombre_completo}
                      </td>
                      <td>
                        <span className="badge bg-info">
                          {empleado.puesto}
                        </span>
                      </td>
                      <td>
                        {empleado.telefono ? (
                          <>
                            <i className="bi bi-telephone me-2"></i>
                            {empleado.telefono}
                          </>
                        ) : (
                          <span className="text-muted">Sin teléfono</span>
                        )}
                      </td>
                      <td>
                        <i className="bi bi-envelope me-2"></i>
                        {empleado.email}
                      </td>
                      <td>
                        <button
                          className="btn btn-sm btn-outline-primary me-1"
                          onClick={() => editarEmpleado(empleado)}
                          title="Editar"
                        >
                          <i className="bi bi-pencil"></i>
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => eliminarEmpleado(empleado.id_personal)}
                          title="Eliminar"
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal para crear/editar */}
      {mostrarModal && (
        <div
          className="modal show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          onClick={(e) => {
            if (e.target.classList.contains('modal')) {
              setMostrarModal(false);
            }
          }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {empleadoEditando ? (
                    <>
                      <i className="bi bi-pencil me-2"></i>
                      Editar Empleado
                    </>
                  ) : (
                    <>
                      <i className="bi bi-plus-circle me-2"></i>
                      Nuevo Empleado
                    </>
                  )}
                </h5>
                <button
                  className="btn-close"
                  onClick={() => setMostrarModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label fw-semibold">
                    <i className="bi bi-person me-2"></i>
                    Nombre Completo *
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="nombre_completo"
                    value={formData.nombre_completo}
                    onChange={handleInputChange}
                    placeholder="Ej: Juan Pérez"
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-semibold">
                    <i className="bi bi-briefcase me-2"></i>
                    Puesto *
                  </label>
                  <select
                    className="form-select"
                    name="puesto"
                    value={formData.puesto}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Seleccionar puesto</option>
                    {puestos.map(puesto => (
                      <option key={puesto} value={puesto}>{puesto}</option>
                    ))}
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label fw-semibold">
                    <i className="bi bi-telephone me-2"></i>
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    className="form-control"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleInputChange}
                    placeholder="Ej: 1234567890"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-semibold">
                    <i className="bi bi-envelope me-2"></i>
                    Email *
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Ej: empleado@ejemplo.com"
                    required
                  />
                </div>
                <small className="text-muted">* Campos obligatorios</small>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setMostrarModal(false)}
                >
                  <i className="bi bi-x-circle me-2"></i>
                  Cancelar
                </button>
                <button 
                  className="btn btn-primary" 
                  onClick={guardarEmpleado}
                  disabled={!formData.nombre_completo || !formData.puesto || !formData.email}
                >
                  <i className="bi bi-check-circle me-2"></i>
                  Guardar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
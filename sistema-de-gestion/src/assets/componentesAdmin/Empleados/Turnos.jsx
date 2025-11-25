import { useState, useEffect } from 'react';
import { getPersonal, getTurnos, createTurno, deleteTurno } from '/src/api/api.js';

export default function Turnos() {
  const [empleados, setEmpleados] = useState([]);
  const [turnos, setTurnos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  
  const [formData, setFormData] = useState({
    id_personal: '',
    sector: '',
    turno: 'mañana',
    dia_semana: 'lunes'
  });

  const diasSemana = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
  const turnos_tipo = ['Mañana', 'Tarde', 'Noche'];
  const sectores = ['Caja', 'Cocina', 'Barra', 'Meseros', 'Reparto', 'Limpieza'];

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const [empleadosData, turnosData] = await Promise.all([
        getPersonal(),
        getTurnos()
      ]);
      setEmpleados(empleadosData);
      setTurnos(turnosData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const guardarTurno = async () => {
    try {
      await createTurno({
        ...formData,
        activo: true
      });
      await cargarDatos();
      setMostrarModal(false);
      setFormData({
        id_personal: '',
        sector: '',
        turno: 'mañana',
        dia_semana: 'lunes'
      });
    } catch (err) {
      setError(err.message);
    }
  };

  const eliminarTurno = async (id) => {
    if (window.confirm('¿Eliminar este turno?')) {
      try {
        await deleteTurno(id);
        await cargarDatos();
      } catch (err) {
        setError(err.message);
      }
    }
  };

  // Generar cronograma
  const generarCronograma = () => {
    const cronograma = {};
    
    diasSemana.forEach(dia => {
      cronograma[dia] = {};
      turnos_tipo.forEach(turno => {
        cronograma[dia][turno] = [];
      });
    });

    turnos.forEach(turno => {
      const dia = turno.dia_semana.charAt(0).toUpperCase() + turno.dia_semana.slice(1);
      const tipoTurno = turno.turno.charAt(0).toUpperCase() + turno.turno.slice(1);
      
      if (cronograma[dia] && cronograma[dia][tipoTurno]) {
        cronograma[dia][tipoTurno].push({
          id: turno.id_turno,
          empleado: turno.personal?.nombre_completo || 'N/A',
          sector: turno.sector
        });
      }
    });

    return cronograma;
  };

  const cronograma = generarCronograma();

  if (loading) return <div className="text-center py-5">Cargando turnos...</div>;

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Gestión de Turnos</h1>
        <button className="btn btn-primary" onClick={() => setMostrarModal(true)}>
          <i className="bi bi-plus-circle me-2"></i>Asignar Turno
        </button>
      </div>

      {error && (
        <div className="alert alert-danger alert-dismissible fade show">
          {error}
          <button className="btn-close" onClick={() => setError(null)}></button>
        </div>
      )}

      {/* CRONOGRAMA VISUAL */}
      <div className="card shadow mb-4">
        <div className="card-header bg-primary text-white">
          <h5 className="mb-0"><i className="bi bi-calendar3 me-2"></i>Cronograma Semanal</h5>
        </div>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-bordered mb-0" style={{ minWidth: '800px' }}>
              <thead className="table-light">
                <tr>
                  <th style={{ width: '100px' }}>Turno / Día</th>
                  {diasSemana.map(dia => (
                    <th key={dia} className="text-center">{dia}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {turnos_tipo.map(turno => (
                  <tr key={turno}>
                    <td className="fw-bold">{turno}</td>
                    {diasSemana.map(dia => (
                      <td key={`${dia}-${turno}`} style={{ minHeight: '80px', verticalAlign: 'top' }}>
                        {cronograma[dia][turno].map(item => (
                          <div key={item.id} className="badge bg-info text-dark mb-1 d-block text-start position-relative">
                            <small>
                              <strong>{item.empleado}</strong><br/>
                              <i className="bi bi-briefcase me-1"></i>{item.sector}
                            </small>
                            <button
                              className="btn btn-sm btn-danger position-absolute top-0 end-0"
                              style={{ fontSize: '0.6rem', padding: '0.1rem 0.3rem' }}
                              onClick={() => eliminarTurno(item.id)}
                              title="Eliminar"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* LISTA DE TURNOS */}
      <div className="card shadow">
        <div className="card-header">
          <h5 className="mb-0">Turnos Asignados</h5>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover">
              <thead className="table-dark">
                <tr>
                  <th>Empleado</th>
                  <th>Sector</th>
                  <th>Día</th>
                  <th>Turno</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {turnos.map((turno) => (
                  <tr key={turno.id_turno}>
                    <td>{turno.personal?.nombre_completo || 'N/A'}</td>
                    <td><span className="badge bg-secondary">{turno.sector}</span></td>
                    <td>{turno.dia_semana}</td>
                    <td>{turno.turno}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => eliminarTurno(turno.id_turno)}
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* MODAL */}
      {mostrarModal && (
        <div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Asignar Turno</h5>
                <button className="btn-close" onClick={() => setMostrarModal(false)}></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Empleado *</label>
                  <select
                    className="form-select"
                    name="id_personal"
                    value={formData.id_personal}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Seleccionar empleado</option>
                    {empleados.map(emp => (
                      <option key={emp.id_personal} value={emp.id_personal}>
                        {emp.nombre_completo} - {emp.puesto}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">Sector *</label>
                  <select
                    className="form-select"
                    name="sector"
                    value={formData.sector}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Seleccionar sector</option>
                    {sectores.map(sector => (
                      <option key={sector} value={sector}>{sector}</option>
                    ))}
                  </select>
                </div>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Día *</label>
                    <select
                      className="form-select"
                      name="dia_semana"
                      value={formData.dia_semana}
                      onChange={handleInputChange}
                      required
                    >
                      {diasSemana.map(dia => (
                        <option key={dia} value={dia.toLowerCase()}>{dia}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Turno *</label>
                    <select
                      className="form-select"
                      name="turno"
                      value={formData.turno}
                      onChange={handleInputChange}
                      required
                    >
                      {turnos_tipo.map(turno => (
                        <option key={turno} value={turno.toLowerCase()}>{turno}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setMostrarModal(false)}>
                  Cancelar
                </button>
                <button 
                  className="btn btn-primary" 
                  onClick={guardarTurno}
                  disabled={!formData.id_personal || !formData.sector}
                >
                  Asignar Turno
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
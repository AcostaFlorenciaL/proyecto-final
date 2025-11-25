import { useState, useEffect } from 'react';
import { getPersonal, updatePersonal } from '/src/api/api.js';

export default function Accesos() {
  const [empleados, setEmpleados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filtro, setFiltro] = useState('todos');

  useEffect(() => {
    cargarEmpleados();
  }, []);

  const cargarEmpleados = async () => {
    try {
      setLoading(true);
      const data = await getPersonal();
      setEmpleados(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleAcceso = async (empleado) => {
    try {
      // Agregar campo "puede_acceder" al empleado
      const nuevoEstado = !empleado.puede_acceder;
      
      await updatePersonal(empleado.id_personal, {
        ...empleado,
        puede_acceder: nuevoEstado
      });

      // Actualizar localmente
      setEmpleados(empleados.map(e => 
        e.id_personal === empleado.id_personal 
          ? { ...e, puede_acceder: nuevoEstado }
          : e
      ));

      alert(`Acceso ${nuevoEstado ? 'concedido' : 'revocado'} para ${empleado.nombre_completo}`);
    } catch (err) {
      setError(err.message);
    }
  };

  const empleadosFiltrados = filtro === 'todos' 
    ? empleados 
    : empleados.filter(e => 
        filtro === 'con_acceso' 
          ? e.puede_acceder 
          : !e.puede_acceder
      );

  if (loading) {
    return <div className="text-center py-5">Cargando empleados...</div>;
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Control de Accesos</h1>
        <div>
          <select
            className="form-select"
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
          >
            <option value="todos">Todos los empleados</option>
            <option value="con_acceso">Con acceso</option>
            <option value="sin_acceso">Sin acceso</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger alert-dismissible fade show">
          {error}
          <button className="btn-close" onClick={() => setError(null)}></button>
        </div>
      )}

      <div className="row">
        <div className="col-12">
          <div className="alert alert-info">
            <i className="bi bi-info-circle me-2"></i>
            Gestiona qué empleados pueden iniciar sesión en el sistema. Los empleados sin acceso no podrán usar sus credenciales.
          </div>
        </div>
      </div>

      <div className="card shadow">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead className="table-dark">
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Puesto</th>
                  <th>Email</th>
                  <th>Estado de Acceso</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {empleadosFiltrados.map((empleado) => {
                  const tieneAcceso = empleado.puede_acceder !== false;
                  
                  return (
                    <tr key={empleado.id_personal}>
                      <td>#{empleado.id_personal}</td>
                      <td>
                        <i className="bi bi-person-fill text-primary me-2"></i>
                        {empleado.nombre_completo}
                      </td>
                      <td>
                        <span className="badge bg-info">{empleado.puesto}</span>
                      </td>
                      <td>
                        <i className="bi bi-envelope me-2"></i>
                        {empleado.email}
                      </td>
                      <td>
                        {tieneAcceso ? (
                          <span className="badge bg-success">
                            <i className="bi bi-check-circle me-1"></i>
                            Puede acceder
                          </span>
                        ) : (
                          <span className="badge bg-danger">
                            <i className="bi bi-x-circle me-1"></i>
                            Acceso bloqueado
                          </span>
                        )}
                      </td>
                      <td>
                        <button
                          className={`btn btn-sm ${tieneAcceso ? 'btn-danger' : 'btn-success'}`}
                          onClick={() => toggleAcceso(empleado)}
                        >
                          <i className={`bi ${tieneAcceso ? 'bi-lock' : 'bi-unlock'} me-1`}></i>
                          {tieneAcceso ? 'Bloquear' : 'Permitir'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {empleadosFiltrados.length === 0 && (
            <div className="text-center py-4 text-muted">
              <i className="bi bi-inbox fs-1 d-block mb-2"></i>
              No hay empleados en esta categoría
            </div>
          )}
        </div>
      </div>

      {/* Estadísticas */}
      <div className="row mt-4">
        <div className="col-md-4">
          <div className="card bg-primary text-white">
            <div className="card-body text-center">
              <h3>{empleados.length}</h3>
              <p className="mb-0">Total Empleados</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card bg-success text-white">
            <div className="card-body text-center">
              <h3>{empleados.filter(e => e.puede_acceder !== false).length}</h3>
              <p className="mb-0">Con Acceso</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card bg-danger text-white">
            <div className="card-body text-center">
              <h3>{empleados.filter(e => e.puede_acceder === false).length}</h3>
              <p className="mb-0">Bloqueados</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
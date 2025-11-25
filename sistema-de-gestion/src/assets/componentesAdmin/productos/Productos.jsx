import { useState, useEffect } from 'react';
import { getProductos, getCategorias, createProducto, updateProducto, deleteProducto } from '/src/api/api.js';

export default function Productos() {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [productoEditando, setProductoEditando] = useState(null);
  
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    id_categoria: '',
    imagen: '',
    disponible: true
  });

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const [productosData, categoriasData] = await Promise.all([
        getProductos(),
        getCategorias()
      ]);
      setProductos(productosData);
      setCategorias(categoriasData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ 
      ...formData, 
      [name]: type === 'checkbox' ? checked : value 
    });
  };

  const abrirModalNuevo = () => {
    setProductoEditando(null);
    setFormData({
      nombre: '',
      descripcion: '',
      precio: '',
      id_categoria: '',
      imagen: '',
      disponible: true
    });
    setMostrarModal(true);
  };

  const editarProducto = (producto) => {
    setProductoEditando(producto);
    setFormData({
      nombre: producto.nombre,
      descripcion: producto.descripcion || '',
      precio: producto.precio,
      id_categoria: producto.id_categoria,
      imagen: producto.imagen || '',
      disponible: producto.disponible
    });
    setMostrarModal(true);
  };

  const guardarProducto = async () => {
    try {
      if (productoEditando) {
        await updateProducto(productoEditando.id_producto, formData);
      } else {
        await createProducto(formData);
      }
      
      await cargarDatos();
      setMostrarModal(false);
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const eliminarProducto = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este producto?')) {
      try {
        await deleteProducto(id);
        await cargarDatos();
      } catch (err) {
        setError(err.message);
      }
    }
  };

  if (loading) {
    return <div className="text-center py-5">Cargando productos...</div>;
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Gestión de Productos</h1>
        <button className="btn btn-primary" onClick={abrirModalNuevo}>
          <i className="bi bi-plus-circle me-2"></i>Nuevo Producto
        </button>
      </div>

      {error && (
        <div className="alert alert-danger alert-dismissible fade show">
          {error}
          <button className="btn-close" onClick={() => setError(null)}></button>
        </div>
      )}

      <div className="card shadow">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover">
              <thead className="table-dark">
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Categoría</th>
                  <th>Precio</th>
                  <th>Disponible</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {productos.map((producto) => (
                  <tr key={producto.id_producto}>
                    <td>#{producto.id_producto}</td>
                    <td>{producto.nombre}</td>
                    <td>
                      {categorias.find(c => c.id_categoria === producto.id_categoria)?.nombre_categoria || 'N/A'}
                    </td>
                    <td>${parseFloat(producto.precio).toLocaleString()}</td>
                    <td>
                      <span className={`badge ${producto.disponible ? 'bg-success' : 'bg-secondary'}`}>
                        {producto.disponible ? 'Sí' : 'No'}
                      </span>
                    </td>
                    <td>
                      <button
                        className="btn btn-sm btn-outline-primary me-1"
                        onClick={() => editarProducto(producto)}
                      >
                        <i className="bi bi-pencil"></i>
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => eliminarProducto(producto.id_producto)}
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

      {/* Modal */}
      {mostrarModal && (
        <div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {productoEditando ? "Editar Producto" : "Nuevo Producto"}
                </h5>
                <button className="btn-close" onClick={() => setMostrarModal(false)}></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Nombre *</label>
                  <input
                    type="text"
                    className="form-control"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Descripción</label>
                  <textarea
                    className="form-control"
                    name="descripcion"
                    value={formData.descripcion}
                    onChange={handleInputChange}
                    rows="3"
                  />
                </div>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Precio *</label>
                    <input
                      type="number"
                      className="form-control"
                      name="precio"
                      value={formData.precio}
                      onChange={handleInputChange}
                      step="0.01"
                      required
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Categoría *</label>
                    <select
                      className="form-select"
                      name="id_categoria"
                      value={formData.id_categoria}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Seleccionar</option>
                      {categorias.map(cat => (
                        <option key={cat.id_categoria} value={cat.id_categoria}>
                          {cat.nombre_categoria}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label">Imagen (nombre del archivo)</label>
                  <input
                    type="text"
                    className="form-control"
                    name="imagen"
                    value={formData.imagen}
                    onChange={handleInputChange}
                    placeholder="ejemplo: pizza.jpg"
                  />
                </div>
                <div className="form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    name="disponible"
                    checked={formData.disponible}
                    onChange={handleInputChange}
                  />
                  <label className="form-check-label">Disponible</label>
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setMostrarModal(false)}>
                  Cancelar
                </button>
                <button 
                  className="btn btn-primary" 
                  onClick={guardarProducto}
                  disabled={!formData.nombre || !formData.precio || !formData.id_categoria}
                >
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
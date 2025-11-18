import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getProductos } from "/src/api/api.js";
import Carta from "./carta";
import "./menu.css";

function Menu() {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [searchParams] = useSearchParams();
  const categoriaFiltro = searchParams.get('categoria');

  useEffect(() => {
    getProductos()
      .then((data) => {
        console.log('📦 Productos recibidos:', data);
        console.log('📦 Total productos:', data.length);
        setProductos(data);
        setCargando(false);
      })
      .catch((err) => {
        console.error('❌ Error al cargar productos:', err);
        setError(err.message);
        setCargando(false);
      });
  }, []);

  if (cargando) return <p>Cargando menú...</p>;
  if (error) return <p>Error: {error}</p>;

  // Si hay un filtro de categoría, mostrar solo esa categoría
  let productosFiltrados = productos;
  if (categoriaFiltro) {
    console.log(`🔍 Filtrando por categoría: ${categoriaFiltro}`);
    productosFiltrados = productos.filter(p => String(p.id_categoria) === String(categoriaFiltro));
    console.log(`✅ Productos encontrados después del filtro: ${productosFiltrados.length}`);
  }

  // Agrupamos productos por categoría
  const categorias = productosFiltrados.reduce((acc, prod) => {
    const key = prod.id_categoria;
    acc[key] = acc[key] || [];
    acc[key].push(prod);
    return acc;
  }, {});

  if (Object.keys(categorias).length === 0) {
    return (
      <div className="menu-container">
        <p className="text-center mt-5">No hay productos en esta categoría</p>
      </div>
    );
  }

  return (
    <div className="menu-container">
      {Object.keys(categorias).map((cat) => (
        <div key={cat} className="menu-section" id={cat.toLowerCase()}>
          <h2 className="section-title">Categoría {cat}</h2>
          {categorias[cat].map((p) => (
            <Carta
              key={p.id_producto}
              id_producto={p.id_producto}
              nombre={p.nombre}
              descripcion={p.descripcion}
              precio={p.precio}
              imagen={`img/${p.imagen}`}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export default Menu;
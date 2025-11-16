import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import menuData from './menuData.js';
import './buscador.css';

const Buscador = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [resultados, setResultados] = useState([]);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const valor = e.target.value.toLowerCase();
    setSearchTerm(valor);

    if (valor.trim() === '') {
      setResultados([]);
      return;
    }

    const filtrados = menuData.filter(item =>
      item.nombre.toLowerCase().includes(valor) ||
      item.descripcion.toLowerCase().includes(valor)
    );

    setResultados(filtrados);
  };

  const irAProducto = (categoria) => {
    navigate(`/carta#${categoria}`);
    setResultados([]);
    setSearchTerm('');
  };

  return (
    <div className="search-box">
      <i className="bi bi-search"></i>
      <input
        type="text"
        className="form-control"
        placeholder="Buscar en el menú..."
        value={searchTerm}
        onChange={handleChange}
      />
      {resultados.length > 0 && (
        <ul className="search-results">
          {resultados.map(item => (
            <li key={item.id} onClick={() => irAProducto(item.categoria)}>
              <img src={item.imagen} alt={item.nombre} />
              <div>
                <strong>{item.nombre}</strong>
                <p>{item.precio}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Buscador;
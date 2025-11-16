const API_URL = "http://localhost:8000/api/productos";

export async function obtenerProductos() {
  const response = await fetch(API_URL);
  if (!response.ok) throw new Error("Error al obtener productos");
  return response.json();
}

export async function obtenerProductoPorId(id) {
  const response = await fetch(`${API_URL}/${id}`);
  if (!response.ok) throw new Error("Producto no encontrado");
  return response.json();
}
const API_URL = "http://localhost:8000/api";

// --- Helper ---
const getToken = () => {
  return sessionStorage.getItem('token');
};

// --- Auth ---
export async function login(email, contraseña) {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      username: email,
      password: contraseña,
    }),
  });
  
  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.detail || "Error al iniciar sesión");
  }
  return response.json();
}

export async function registro(userData) {
  const response = await fetch(`${API_URL}/auth/registro`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });
  
  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.detail || "Error al registrar usuario");
  }
  return response.json();
}

// --- Productos ---
export async function getProductos() {
  const res = await fetch(`${API_URL}/productos/`);
  if (!res.ok) throw new Error("Error al obtener productos");
  return res.json();
}

// --- Pedidos ---
export async function crearPedido(userId, pedido) {
  const res = await fetch(`${API_URL}/pedidos/?user_id=${userId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(pedido),
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Error al crear el pedido: ${error}`);
  }

  return res.json();
}

export async function getPedidos(userId) {
  const res = await fetch(`${API_URL}/pedidos/usuario/${userId}`);
  if (!res.ok) throw new Error("Error al obtener pedidos");
  return res.json();
}

// 🔥 NUEVO: Obtener todos los pedidos (historial completo)
export async function getTodosPedidos() {
  const res = await fetch(`${API_URL}/pedidos/todos`);
  if (!res.ok) throw new Error("Error al obtener todos los pedidos");
  return res.json();
}

// 🔥 NUEVO: Obtener pedidos activos (para gestión de ventas)
export async function getPedidosActivos() {
  const res = await fetch(`${API_URL}/pedidos/activos`);
  if (!res.ok) throw new Error("Error al obtener pedidos activos");
  return res.json();
}

// 🔥 NUEVO: Actualizar estado de pedido
export async function actualizarEstadoPedido(pedidoId, nuevoEstado) {
  const res = await fetch(`${API_URL}/pedidos/${pedidoId}/estado`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ estado: nuevoEstado })
  });
  if (!res.ok) throw new Error("Error al actualizar estado");
  return res.json();
}

// 🔥 NUEVO: Actualizar pedido completo
export async function actualizarPedido(pedidoId, pedidoData) {
  const res = await fetch(`${API_URL}/pedidos/${pedidoId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(pedidoData)
  });
  if (!res.ok) throw new Error("Error al actualizar pedido");
  return res.json();
}

// --- Personal (Admin) ---
export async function getPersonal() {
  const res = await fetch(`${API_URL}/personal/`);
  if (!res.ok) throw new Error("Error al cargar empleados");
  return res.json();
}

export async function getPersonalByPuesto(puesto) {
  const res = await fetch(`${API_URL}/personal/puesto/${puesto}`);
  if (!res.ok) throw new Error("Error al filtrar empleados");
  return res.json();
}

export async function createPersonal(personalData) {
  const res = await fetch(`${API_URL}/personal/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(personalData)
  });
  if (!res.ok) throw new Error("Error al crear empleado");
  return res.json();
}

export async function updatePersonal(id, personalData) {
  const res = await fetch(`${API_URL}/personal/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(personalData)
  });
  if (!res.ok) throw new Error("Error al actualizar empleado");
  return res.json();
}

export async function deletePersonal(id) {
  const res = await fetch(`${API_URL}/personal/${id}`, {
    method: 'DELETE'
  });
  if (!res.ok) throw new Error("Error al eliminar empleado");
  return res.json();
}
// ACLARACIÓN: código revisado y mejorado por el estudiante a partir del generado por ChatGPT

/*
Funcionalidades:
- Arrays y objetos
- Métodos: find(), push(), pop(), filter(), reduce(), forEach()
- Control de stock, cantidades y validaciones
- Interacción con prompt(), alert() y console.log()
*/

// ==============================
// 🧠 Carrito de Compras v3
// Con Spread Operator aplicado correctamente
// ==============================

// Datos iniciales
const productos = [
  { id: 1, nombre: "Filtro de aceite", precio: 3500, stock: 8 },
  { id: 2, nombre: "Bujía NGK", precio: 4200, stock: 12 },
  { id: 3, nombre: "Pastilla de freno", precio: 9600, stock: 6 },
  { id: 4, nombre: "Aceite 10W40", precio: 14500, stock: 10 },
  { id: 5, nombre: "Correa dentada", precio: 8900, stock: 4 },
];

let carrito = [];

// ==============================
// Función para mostrar productos
// ==============================
function renderProductos() {
  const lista = document.getElementById("productos-list");
  lista.innerHTML = "";
  productos.forEach(p => {
    const div = document.createElement("div");
    div.className = "producto";
    div.innerHTML = `
      <strong>${p.nombre}</strong> - $${p.precio} | Stock: ${p.stock}
      <button onclick="agregarAlCarrito(${p.id})">Agregar</button>
    `;
    lista.appendChild(div);
  });
}

// ==============================
// Función para mostrar carrito
// ==============================
function renderCarrito() {
  const lista = document.getElementById("carrito-list");
  lista.innerHTML = "";
  carrito.forEach(p => {
    const div = document.createElement("div");
    div.className = "carrito-item";
    div.innerHTML = `
      <strong>${p.nombre}</strong> | $${p.precio} x ${p.cantidad} = $${p.precio * p.cantidad}
      <button onclick="modificarCantidad(${p.id}, -1)">➖</button>
      <button onclick="modificarCantidad(${p.id}, 1)">➕</button>
      <button onclick="eliminarProducto(${p.id})">Eliminar</button>
    `;
    lista.appendChild(div);
  });

  // Actualizar total
  const total = carrito.reduce((acc, p) => acc + p.precio * p.cantidad, 0);
  document.getElementById("total").textContent = `Total: $${total}`;
}

// ==============================
// Agregar producto al carrito
// ==============================
function agregarAlCarrito(id) {
  const producto = productos.find(p => p.id === id);
  if (!producto || producto.stock <= 0) return alert("No hay stock disponible");

  producto.stock--;
  const itemCarrito = carrito.find(p => p.id === id);
  if (itemCarrito) itemCarrito.cantidad++;
  else carrito.push({ ...producto, cantidad: 1 });

  renderProductos();
  renderCarrito();
}

// ==============================
// Modificar cantidad
// ==============================
function modificarCantidad(id, cambio) {
  const item = carrito.find(p => p.id === id);
  const original = productos.find(p => p.id === id);
  if (!item) return;

  if (cambio === 1 && original.stock <= 0) return alert("No hay más stock disponible");
  if (cambio === -1 && item.cantidad <= 1) {
    // Si queda 1 unidad y quiere restar, eliminar del carrito
    eliminarProducto(id);
    return;
  }

  item.cantidad += cambio;
  original.stock -= cambio;
  renderProductos();
  renderCarrito();
}

// ==============================
// Eliminar producto específico
// ==============================
function eliminarProducto(id) {
  const index = carrito.findIndex(p => p.id === id);
  if (index === -1) return;
  const item = carrito[index];
  productos.find(p => p.id === id).stock += item.cantidad;
  carrito.splice(index, 1);
  renderProductos();
  renderCarrito();
}

// ==============================
// Vaciar carrito
// ==============================
document.getElementById("vaciar-carrito").addEventListener("click", () => {
  if (!confirm("¿Seguro que deseas vaciar todo el carrito?")) return;
  carrito.forEach(item => productos.find(p => p.id === item.id).stock += item.cantidad);
  carrito = [];
  renderProductos();
  renderCarrito();
});

// ==============================
// Inicialización
// ==============================
renderProductos();
renderCarrito();
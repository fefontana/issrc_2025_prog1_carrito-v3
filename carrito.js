// ==============================
// 🛒 Carrito de Compras v4
// Persistencia + Eventos modernos + Debounce
// ==============================

// Datos iniciales
let productos = JSON.parse(localStorage.getItem("productos")) || [
  { id: 1, nombre: "Filtro de aceite", precio: 3500, stock: 8 },
  { id: 2, nombre: "Bujía NGK", precio: 4200, stock: 12 },
  { id: 3, nombre: "Pastilla de freno", precio: 9600, stock: 6 },
  { id: 4, nombre: "Aceite 10W40", precio: 14500, stock: 10 },
  { id: 5, nombre: "Correa dentada", precio: 8900, stock: 4 },
];

let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

// ==============================
// 🔁 Funciones de renderizado
// ==============================
function renderProductos() {
  const lista = document.getElementById("productos-list");
  lista.innerHTML = "";
  productos.forEach(p => {
    const div = document.createElement("div");
    div.className = "producto";
    div.innerHTML = `
      <strong>${p.nombre}</strong> - $${p.precio} | Stock: ${p.stock}
      <button data-id="${p.id}" class="btn-agregar">Agregar</button>
    `;
    lista.appendChild(div);
  });
}

function renderCarrito() {
  const lista = document.getElementById("carrito-list");
  lista.innerHTML = "";

  if (carrito.length === 0) {
    lista.innerHTML = "<em>El carrito está vacío</em>";
  } else {
    carrito.forEach(p => {
      const div = document.createElement("div");
      div.className = "carrito-item";
      div.innerHTML = `
        <strong>${p.nombre}</strong> | $${p.precio} x ${p.cantidad} = $${p.precio * p.cantidad}
        <button data-id="${p.id}" data-cambio="-1" class="btn-modificar">➖</button>
        <button data-id="${p.id}" data-cambio="1" class="btn-modificar">➕</button>
        <button data-id="${p.id}" class="btn-eliminar">Eliminar</button>
      `;
      lista.appendChild(div);
    });
  }

  const total = carrito.reduce((acc, p) => acc + p.precio * p.cantidad, 0);
  document.getElementById("total").textContent = `Total: $${total}`;
  guardarDatos();
}

function guardarDatos() {
  localStorage.setItem("productos", JSON.stringify(productos));
  localStorage.setItem("carrito", JSON.stringify(carrito));
}

// ==============================
// ⚙️ Lógica del carrito
// ==============================
function agregarAlCarrito(id) {
  const producto = productos.find(p => p.id === id);
  if (!producto || producto.stock <= 0) return alert("No hay stock disponible");

  producto.stock--;
  const item = carrito.find(p => p.id === id);
  if (item) item.cantidad++;
  else carrito.push({ ...producto, cantidad: 1 });

  renderProductos();
  renderCarrito();
}

function modificarCantidad(id, cambio) {
  const item = carrito.find(p => p.id === id);
  const original = productos.find(p => p.id === id);
  if (!item) return;

  if (cambio === 1 && original.stock <= 0) return alert("No hay más stock disponible");
  if (cambio === -1 && item.cantidad <= 1) return eliminarProducto(id);

  item.cantidad += cambio;
  original.stock -= cambio;
  renderProductos();
  renderCarrito();
}

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
// 🕒 Utilidad: debounce
// ==============================
function debounce(fn, delay = 4250) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

// ==============================
// 🧩 Eventos globales
// ==============================
document.addEventListener("click", e => {
  if (e.target.classList.contains("btn-agregar")) {
    const id = Number(e.target.dataset.id);
    debounce(() => agregarAlCarrito(id))();
  }

  if (e.target.classList.contains("btn-modificar")) {
    const id = Number(e.target.dataset.id);
    const cambio = Number(e.target.dataset.cambio);
    modificarCantidad(id, cambio);
  }

  if (e.target.classList.contains("btn-eliminar")) {
    eliminarProducto(Number(e.target.dataset.id));
  }
});

document.getElementById("vaciar-carrito").addEventListener("click", () => {
  if (!confirm("¿Seguro que deseas vaciar el carrito?")) return;
  carrito.forEach(i => productos.find(p => p.id === i.id).stock += i.cantidad);
  carrito = [];
  renderProductos();
  renderCarrito();
});

// ==============================
// 🚀 Inicialización
// ==============================
renderProductos();
renderCarrito();

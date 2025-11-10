# issrc_2025_prog1_carrito-v3
Carrito v3


Informe técnico partiendo de v2:

Fortalezas

Código limpio y legible, ideal para aprendizaje.
Buen uso de métodos modernos: find, forEach, reduce, spread.
Control de stock correcto (resta y devolución al eliminar o vaciar).
Renderización dinámica simple y funcional.
Separación clara de responsabilidades (renderProductos vs renderCarrito).
Uso consistente de confirmaciones y alertas.

Evaluación del HTML

*estructura semántica, estilos, y separación de responsabilidades.
*posibles mejoras (por ejemplo: manejo dinámico del total, UX, accesibilidad).

Evaluación del JS (carrito.js)

*cómo cargas los productos, cómo se agregan y eliminan del carrito.
*mejoras de eficiencia y legibilidad.
*persistencia con localStorage o almacenamiento temporal.
*protección contra clics rápidos (debounce o disabled momentáneo).
*posibilidad de modularizar para futuras versiones.

Sugerencias de evolución hacia v4

*arquitectura por módulos, eventos centralizados, separación de render.
*plantillas (template literals o DOM dinámico).
*UI con total interactivo, validación y persistencia.


Aspectos que probablemente requieran mejorar

*Manejo de eventos rápidos (por ejemplo doble clic o múltiples clics) — ahí podría entrar lo de debounce.
*Persistencia entre sesiones/pestañas (ej: usando localStorage, sessionStorage, o IndexedDB).
*Optimización del renderizado: sólo actualizar lo que cambió, no redibujar todo cada vez innecesariamente.
*Accesibilidad y usabilidad: botones deshabilitados, mensajes claros, feedback de errores.
*Testeo: asegurar que las funciones centrales del carrito estén cubiertas.
*Seguridad: sanitización de datos de entrada si hay interacción con servidor o usuario introduciendo datos.


Sobre debounce

Para que quede claro (y explicado de modo en que puedas decidir si lo necesitas en tu proyecto):
La función debounce sirve para limitar la frecuencia con la que una función puede ejecutarse. Por ejemplo: si tienes un botón “Añadir al carrito”, y el usuario hace varios clics rápidos, sin debounce podrían añadirse múltiples veces de forma no deseada o duplicarse. Con debounce, esperas un pequeño periodo (por ejemplo 300 ms) tras el último clic, y sólo entonces se ejecuta la acción.

Esto mejora:

*la experiencia del usuario (evita sobrecargas)
*el rendimiento (menos llamadas innecesarias)
*la lógica (evita duplicados)
*Se aplica también en inputs de búsqueda, scrolls, etc.

En tu caso del carrito podría aplicarse al botón “añadir” o “quitar” producto, si ves que ocurre doble click, o cuando la acción dispara varios cambios que pueden acumularse.

Áreas mejorables
1. Eficiencia del renderizado

Cada cambio re-renderiza toda la lista de productos y el carrito, aunque solo cambia un ítem.
👉 Solución: actualizar solo el nodo afectado o usar un render parcial.

2. Eventos inline (onclick)

Tener onclick en el HTML dinámico mezcla lógica y presentación.
👉 Mejor: usar addEventListener luego de crear los botones (separación de responsabilidades).

3. Persistencia del carrito

Si se recarga la página, se pierde el contenido del carrito y el stock.
👉 Mejor: guardar carrito y productos en localStorage.

4. Control de clics rápidos

Un doble clic rápido en “Agregar” puede provocar errores visuales (stock < 0 momentáneamente).
👉 Se puede usar debounce() o desactivar el botón temporalmente.

5. Accesibilidad y UX

No hay mensaje cuando el carrito está vacío.
👉 Mostrar un texto: “El carrito está vacío” cuando no hay ítems.

6. Código duplicado leve

Cada vez que cambias algo se llaman renderProductos() y renderCarrito().
👉 Se puede centralizar en una función actualizarVista().

Propuesta de evolución que agrega:

localStorage para persistir datos.

debounce para evitar clics múltiples.

separación total de eventos y render.

aviso de carrito vacío.


Resultado

✅ Persiste carrito y stock aunque recargues la página.

✅ Limpia separación entre vista, lógica y eventos.

✅ Evita duplicados por clics rápidos.

✅ Usa buenas prácticas JS modernas.

✅ Listo para evolución modular (por ejemplo: productos.js, carrito.js, utils.js).


ANEXO


Aplicacion de debounce... **pero con criterio selectivo** 👇

Vamos a verlo en detalle, porque no todas las funciones se benefician del `debounce`, y aplicarlo mal puede hasta *empeorar* la UX.

---

## 🧠 Qué hace `debounce` exactamente

* “Retrasa” la ejecución de una función hasta que **deja de ser invocada** por un tiempo determinado.
* Sirve cuando hay **múltiples eventos repetitivos** que no deben ejecutarse todos.
* Ejemplo clásico: escribir en un input, hacer scroll o clickear muchas veces seguidas.

---

## ⚙️ En tu carrito actual

### 🔹 Funciones que *sí* se benefician de `debounce`

| Función               | Motivo                                                                                                           |
| --------------------- | ---------------------------------------------------------------------------------------------------------------- |
| `agregarAlCarrito()`  | Puede dispararse múltiples veces si el usuario hace clic rápido → riesgo de duplicar.                            |
| `modificarCantidad()` | También puede activarse rápido (➕/➖), útil si no querés que se procesen muchos cambios seguidos.                 |
| `eliminarProducto()`  | Rara vez se clickea muchas veces, pero podría prevenir errores si el DOM no se actualiza instantáneamente.       |
| `vaciarCarrito()`     | Generalmente no hace falta, pero se podría proteger con un `confirm` + bloqueo temporal (mejor UX que debounce). |

---

### 🔹 Funciones que **NO** conviene aplicar `debounce`

| Función                                         | Motivo                                                                                                                                                   |
| ----------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `renderProductos()` / `renderCarrito()`         | Son llamadas sincronizadas por tu lógica interna, no dependen de input humano. Aplicar debounce haría que la UI se actualice tarde o de forma desfasada. |
| `guardarDatos()`                                | Se ejecuta después de cada render; retrasarlo puede provocar pérdida de estado si el usuario cierra rápido la página.                                    |
| `eliminarProducto()` (si se llama internamente) | Ya se ejecuta como parte de otra acción, y no tiene sentido retrasarla.                                                                                  |

---

## 🧩 Recomendación práctica

Usá `debounce` **solo en las funciones que responden directamente a eventos del usuario**, y en particular, donde **el usuario puede repetir el mismo evento muy rápido**.

Así, la versión más eficiente sería:

```js
// Crear una única versión "debounced" de agregar y modificar
const agregarDebounced = debounce(agregarAlCarrito, 250);
const modificarDebounced = debounce(modificarCantidad, 150);

// Luego en el event listener
document.addEventListener("click", e => {
  if (e.target.classList.contains("btn-agregar")) {
    agregarDebounced(Number(e.target.dataset.id));
  }

  if (e.target.classList.contains("btn-modificar")) {
    const id = Number(e.target.dataset.id);
    const cambio = Number(e.target.dataset.cambio);
    modificarDebounced(id, cambio);
  }

  if (e.target.classList.contains("btn-eliminar")) {
    eliminarProducto(Number(e.target.dataset.id)); // sin debounce
  }
});
```

💬 **Ventaja:**

* Evita clicks masivos → sin sobrecarga ni errores de stock.
* No ralentiza las actualizaciones visuales innecesariamente.
* Mejora la fluidez general sin perder sincronía con el DOM.

---

## 🧱 Tip adicional

Si en el futuro tuvieras un **renderizado más costoso** (por ejemplo con muchas tarjetas o imágenes), ahí sí convendría aplicar `debounce` o incluso `throttle` al render.

---



const container = document.querySelector('.card-list-products-ofertas');
const leftArrow = document.getElementById('izq');
const rightArrow = document.getElementById('der');

// Evento para mover hacia la izquierda
leftArrow.addEventListener('click', () => {
  container.scrollBy({
    left: -200, // Cantidad de desplazamiento hacia la izquierda
    behavior: 'smooth', // Movimiento suave
  });
});

// Evento para mover hacia la derecha
rightArrow.addEventListener('click', () => {
  container.scrollBy({
    left: 200, // Cantidad de desplazamiento hacia la derecha
    behavior: 'smooth', // Movimiento suave
  });
});



// sub menus

document.querySelectorAll('.menu-item').forEach(item => {
    item.addEventListener('mouseover', () => {
      const submenu = item.querySelector('.submenu');
      if (submenu) {
        submenu.style.display = 'block';
      }
    });
  
    item.addEventListener('mouseout', () => {
      const submenu = item.querySelector('.submenu');
      if (submenu) {
        submenu.style.display = 'none';
      }
    });
  });


// carrito

function actualizarContadorCarrito() {
  const memoria = JSON.parse(localStorage.getItem("productos")) || [];
  const totalProductos = memoria.reduce((total, item) => total + item.cantidad, 0);

  const contadorCarrito = document.getElementById("contador-productos");
  if (contadorCarrito) {
      contadorCarrito.textContent = totalProductos;
      contadorCarrito.style.display = totalProductos > 0 ? "block" : "none"; // Ocultar si está vacío
  }
}
function agregarAlCarrito(producto) {
  if (!producto || !producto.id || !producto.nombre || !producto.precio || !producto.imagen) {
      console.error("Producto inválido:", producto);
      return;
  }

  let memoria = JSON.parse(localStorage.getItem("productos")) || [];

  let itemExistente = memoria.find(item => item.id === producto.id);

  if (itemExistente) {
      // Si ya está en el carrito, aumentar la cantidad
      itemExistente.cantidad += 1;
  } else {
      // Si no está, agregarlo con su información de oferta
      const precio = parseFloat(producto.precio);
      const oferta = parseFloat(producto.oferta) || 0;
      const precioFinal = oferta ? precio * (1 - (oferta / 100)) : precio; // Calcular precio con descuento

      memoria.push({
          id: producto.id,
          nombre: producto.nombre,
          imagen: producto.imagen,
          cantidad: 1,
          precioOriginal: precio, // Guardamos el precio original
          oferta: oferta, // Porcentaje de oferta
          precioFinal: precioFinal // Guardamos el precio con descuento
      });
  }

  localStorage.setItem("productos", JSON.stringify(memoria));
  console.log("Carrito actualizado con oferta:", memoria);

  // 🔹 Actualizar el contador después de agregar
  actualizarContadorCarrito();
}








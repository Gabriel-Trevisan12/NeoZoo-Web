// Selección del contenedor de ofertas y los botones de desplazamiento
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

  



function agregarAlCarrito(producto) {
  if (!producto || !producto.id || !producto.nombre || !producto.precio || !producto.imagen) {
      console.error("Producto inválido:", producto);
      return;
  }

  let memoria = JSON.parse(localStorage.getItem("productos")) || [];
  console.log("Productos en memoria:", memoria);

  // Buscar si el producto ya está en el carrito
  let itemExistente = memoria.find(item => item.id === producto.id);

  if (itemExistente) {
      // Si ya está en el carrito, aumentar la cantidad
      itemExistente.cantidad += 1;
  } else {
      // Si no está, agregarlo con cantidad 1
      memoria.push(getNuevoProductoParaMemoria(producto));
  }

  // Guardar la memoria actualizada en el localStorage
  localStorage.setItem("productos", JSON.stringify(memoria));
  console.log("Carrito actualizado:", memoria);

  // Actualizar la vista del carrito
  renderCart();
}

function getNuevoProductoParaMemoria(producto) {
  return {
      id: producto.id,
      nombre: producto.nombre,
      precio: producto.precio,
      imagen: producto.imagen,
      cantidad: 1
  };
}

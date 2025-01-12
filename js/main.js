
/* js del carrusel  */


const grande = document.querySelector('.carrusel-grande');
const punto = document.querySelectorAll('.punto');

punto.forEach((cadaPunto, i) => {
    punto[i].addEventListener('click', () => {
        let posicion = i;
        let operacion = posicion * -50;

        
        grande.style.transform = `translateX(${operacion}%)`;

       
        punto.forEach((cadaPunto, i) => {
            punto[i].classList.remove('activo');
        });

        
        punto[i].classList.add('activo');
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

function agregarAlCarrito(producto) {
  const memoria = JSON.parse(localStorage.getItem("productos")) || [];
  console.log("Productos en memoria:", memoria);

  // Buscar si el producto ya está en el carrito
  const indiceProducto = memoria.findIndex((item) => item.id === producto.id);

  if (indiceProducto === -1) {
    // Si el producto no está en el carrito, lo añadimos con cantidad 1
    const nuevoProducto = getNuevoProductoParaMemoria(producto);
    memoria.push(nuevoProducto);
  } else {
    // Si el producto ya está, incrementamos su cantidad
    memoria[indiceProducto].cantidad += 1;
  }

  // Guardar la memoria actualizada en el localStorage
  localStorage.setItem("productos", JSON.stringify(memoria));
  console.log("Carrito actualizado:", memoria);
}

function getNuevoProductoParaMemoria(producto) {
  // Crear una copia del producto y agregar la cantidad
  return { ...producto, cantidad: 1 };
}




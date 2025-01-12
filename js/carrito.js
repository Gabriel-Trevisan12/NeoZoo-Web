const contenedorTarjetas = document.getElementById("contenedorCarrito");
const totalAmountElement = document.getElementById("totalAmount"); // Referencia al total

function crearCards() {
    const productos = JSON.parse(localStorage.getItem("productos")) || [];
    contenedorTarjetas.innerHTML = ""; // Limpia el contenedor antes de añadir nuevos productos

    productos.forEach((producto, index) => {
        const nuevoProducto = document.createElement("div");
        nuevoProducto.innerHTML = `
        <div class="card-carrito">
            <div class="left">
                <img class="img-card" src="${producto.imagen}" alt="${producto.nombre}">
                <h2>${producto.nombre}</h2>
            </div>
            <div class="right">
            <div class="container-quantity">
                <i class="fa-solid fa-plus" id="increment-${index}" class="increment"></i>
                <input type="number" placeholder="1" value="${producto.cantidad || 1}" min="1" class="input-card" data-index="${index}">
                <i class="fa-solid fa-minus" id="decrement-${index}" class="decrement"></i>
            </div>
                <p class="price-finaly">$${producto.precio}</p>
                <button class="btn-add-cart" data-index="${index}">X</button>
            </div>
        </div>
        `;
        contenedorTarjetas.appendChild(nuevoProducto);

        // Agregar evento al botón de eliminar
        const botonEliminar = nuevoProducto.querySelector(".btn-add-cart");
        botonEliminar.addEventListener("click", () => {
            eliminarProducto(index);
        });

        // Agregar evento al input para cambiar cantidad
        const inputCantidad = nuevoProducto.querySelector(".input-card");
        inputCantidad.addEventListener("input", (event) => {
            actualizarCantidad(index, event.target.value);
        });

        // Agregar eventos a los botones de incremento y decremento
        const btnIncrement = nuevoProducto.querySelector(`#increment-${index}`);
        const btnDecrement = nuevoProducto.querySelector(`#decrement-${index}`);

        btnIncrement.addEventListener('click', () => {
            const cantidadInput = nuevoProducto.querySelector(".input-card");
            let nuevaCantidad = parseInt(cantidadInput.value) + 1;
            cantidadInput.value = nuevaCantidad;
            actualizarCantidad(index, nuevaCantidad);
        });

        btnDecrement.addEventListener('click', () => {
            const cantidadInput = nuevoProducto.querySelector(".input-card");
            let nuevaCantidad = Math.max(1, parseInt(cantidadInput.value) - 1);
            cantidadInput.value = nuevaCantidad;
            actualizarCantidad(index, nuevaCantidad);
        });
    });

    actualizarTotal(); // Calcula y actualiza el total al renderizar las tarjetas
}

function actualizarCantidad(index, nuevaCantidad) {
    const productos = JSON.parse(localStorage.getItem("productos")) || [];
    productos[index].cantidad = parseInt(nuevaCantidad) || 1;
    localStorage.setItem("productos", JSON.stringify(productos));
    actualizarTotal(); // Calcula y actualiza el total cuando cambia la cantidad
}

function actualizarTotal() {
    const productos = JSON.parse(localStorage.getItem("productos")) || [];
    const total = productos.reduce((sum, producto) => {
        return sum + producto.precio * (producto.cantidad || 1);
    }, 0);
    totalAmountElement.textContent = total.toFixed(2); // Actualiza el elemento del total con 2 decimales
}

function eliminarProducto(index) {
    const productos = JSON.parse(localStorage.getItem("productos")) || [];
    productos.splice(index, 1); // Elimina el producto de la lista
    localStorage.setItem("productos", JSON.stringify(productos));
    actualizarCarrito(); // Vuelve a renderizar las tarjetas
}

function actualizarCarrito() {
    contenedorTarjetas.innerHTML = ""; // Limpia el contenedor
    crearCards(); // Vuelve a crear las tarjetas
}

// Inicializar el carrito
crearCards();


document.getElementById("enviarPedido").addEventListener("click", function() {
    const productos = JSON.parse(localStorage.getItem("productos")) || [];

    // Si no hay productos, no hacer nada
    if (productos.length === 0) {
        alert("El carrito está vacío.");
        return;
    }

    // Crear el mensaje para WhatsApp
    let mensaje = "Pedido de carrito:\n\n";
    productos.forEach(producto => {
        mensaje += `${producto.nombre} x${producto.cantidad} - $${producto.precio * producto.cantidad}\n`;
    });
    
    mensaje += `\nTotal: $${productos.reduce((sum, producto) => sum + producto.precio * producto.cantidad, 0).toFixed(2)}`;

    // Limpiar el carrito y el localStorage
    localStorage.removeItem("productos"); // O localStorage.clear() si quieres limpiar todo el localStorage

    // Redirigir a WhatsApp con el mensaje
    const numeroWhatsapp = "+5493413539527"; // Reemplaza con tu número de WhatsApp
    const urlWhatsApp = `https://wa.me/${numeroWhatsapp}?text=${encodeURIComponent(mensaje)}`;

    // Abrir el enlace de WhatsApp
    window.open(urlWhatsApp, "_blank");

    // Limpiar la interfaz de usuario
    contenedorTarjetas.innerHTML = "";
    actualizarTotal();
});

// Obtener el carrito desde localStorage o inicializarlo vacío
let cart = JSON.parse(localStorage.getItem("productos")) || [];

// Renderizar el carrito
function renderCart() {
    const cartItems = document.getElementById("cart-items");
    cartItems.innerHTML = "";

    cart.forEach((producto, index) => {
        const precio = parseFloat(producto.precioOriginal) || 0;
        const oferta = parseFloat(producto.oferta) || 0;
        const tieneOferta = oferta > 0;
        const precioFinal = parseFloat(producto.precioFinal) || 0;

        const itemElement = document.createElement("div");
        itemElement.className = "cart-item";
        itemElement.innerHTML = `
            <div class="img-carrito">
            <img src="${producto.imagen}" alt="${producto.nombre}">
            ${tieneOferta ? `<div class="precio-oferta">-${oferta}%</div>` : ''} 
            </div>
            <div class="item-details">
                <div class="item-name">${producto.nombre}</div>
                <p class="item-price">
                    ${tieneOferta ? `<span class="precio-original">$${precio.toFixed(2)}</span>` : ''} 
                    <span class="${tieneOferta ? 'precio-descontado' : 'precio-normal'}">$${precioFinal.toFixed(2)}</span>
                </p>
            </div>
            <div class="item-quantity">
                <button class="quantity-btn" onclick="updateQuantity(${index}, ${producto.cantidad - 1})">-</button>
                <span>${producto.cantidad}</span>
                <button class="quantity-btn" onclick="updateQuantity(${index}, ${producto.cantidad + 1})">+</button>
            </div>
            <button class="remove-btn" onclick="removeItem(${index})">Eliminar</button>
        `;
        cartItems.appendChild(itemElement);
    });

    updateTotal(); // Llamamos a la función de actualización de totales después de renderizar las cards
}



// Actualizar cantidad de un producto
function updateQuantity(index, newQuantity) {
    if (newQuantity <= 0) {
        removeItem(index);
    } else {
        cart[index].cantidad = newQuantity;
        localStorage.setItem("productos", JSON.stringify(cart));
        renderCart(); // Volver a renderizar el carrito con los nuevos datos
    }
}

// Eliminar un producto del carrito
function removeItem(index) {
    cart.splice(index, 1);
    localStorage.setItem("productos", JSON.stringify(cart));
    renderCart(); // Volver a renderizar el carrito con los productos actualizados
}

// Calcular y actualizar el total
function updateTotal() {
    let totalOriginal = 0;
    let totalDescuento = 0;

    // Recorrer el carrito para calcular los totales
    cart.forEach(producto => {
        const precioOriginal = parseFloat(producto.precioOriginal) || 0; // Usamos el precio original
        const precioFinal = parseFloat(producto.precioFinal) || 0; // Usamos el precio final con descuento

        totalOriginal += precioOriginal * producto.cantidad; // Total original sin descuento
        totalDescuento += precioFinal * producto.cantidad;  // Total con descuento aplicado
    });

    const totalDescuentoAcumulado = totalOriginal - totalDescuento;

    // Mostrar el total original y el total con descuento
    document.getElementById("cart-total-original").textContent = `Total Original: $${totalOriginal.toFixed(2)}`;
    document.getElementById("cart-total-desconto").textContent = `Descuento acumulado: -$${totalDescuentoAcumulado.toFixed(2)}`;
    document.getElementById("cart-total").textContent = `Total a pagar: $${totalDescuento.toFixed(2)}`;
}

// Enviar pedido por WhatsApp

document.getElementById("checkout-btn").addEventListener("click", function() {
    if (cart.length === 0) {
        alert("El carrito está vacío.");
        return;
    }

    let mensaje = "Pedido de carrito:\n\n";
    cart.forEach(producto => {
        const precioDescontado = parseFloat(producto.precioFinal) || 0;  // Usamos precioFinal con descuento
        mensaje += `${producto.nombre} x${producto.cantidad} - $${(precioDescontado * producto.cantidad).toFixed(2)}\n`;
    });

    // Calcular el total original, descuento acumulado y total a pagar
    const totalOriginal = cart.reduce((sum, producto) => sum + (producto.precioOriginal * producto.cantidad), 0);
    const totalDescuento = cart.reduce((sum, producto) => sum + (producto.precioFinal * producto.cantidad), 0);
    const descuentoAcumulado = totalOriginal - totalDescuento;

    mensaje += `\nTotal Original: $${totalOriginal.toFixed(2)}`;
    mensaje += `\nDescuento acumulado: -$${descuentoAcumulado.toFixed(2)}`;
    mensaje += `\nTotal a pagar: $${totalDescuento.toFixed(2)}`;

    // Número de WhatsApp
    const numeroWhatsapp = "+5493413539527";
    const urlWhatsApp = `https://wa.me/${numeroWhatsapp}?text=${encodeURIComponent(mensaje)}`;

    // Limpiar carrito
    localStorage.removeItem("productos");
    cart = [];
    renderCart(); // Volver a renderizar el carrito vacío

    // Redirigir a WhatsApp
    window.open(urlWhatsApp, "_blank");
});

// Inicializar el carrito
renderCart();

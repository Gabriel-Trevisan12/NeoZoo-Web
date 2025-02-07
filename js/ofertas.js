document.addEventListener('DOMContentLoaded', () => {
    const ofertasContainer = document.querySelector('.card-list-products-ofertas'); // Contenedor del carrusel

    // Cargar los productos con descuento desde el backend
    fetch('includes/get-ofertas.php')
        .then(response => response.json())
        .then(productos => {
            // Crear dinámicamente las cards
            productos.forEach(producto => {
                // Calcular el precio con descuento
                const precioDescontado = producto.precio * (1 - (producto.oferta / 100));

                const card = document.createElement('div');
                card.classList.add('item-ofertas'); // Clase de las cards

                // Crear los elementos HTML con los precios
                card.innerHTML = `
                    <img class="img-item" src="${producto.imagen}" alt="Producto con oferta">
                    <!-- Mostrar porcentaje de descuento en la parte superior izquierda -->
                    <div class="precio-oferta">-${producto.oferta}%</div> 
                    <div class="info-product">
                        <h2>${producto.nombre}</h2>
                        <p class="price">
                            <span class="precio-original">$${producto.precio}</span> <!-- Precio original tachado -->
                        </p>
                        <!-- Mostrar el precio con descuento debajo del precio original -->
                        <p class="precio-descontado">$${precioDescontado.toFixed(2)}</p>
                        <button onclick="window.location.href='info-product.html?id=${producto.id}'" class="btn">
                        Info
                        </button>
                    </div>
                `;
                ofertasContainer.appendChild(card); // Agregar la card al contenedor
            });
        })
        .catch(error => {
            console.error('Error al cargar los productos con oferta:', error);
        });
});

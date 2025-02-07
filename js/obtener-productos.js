// Obtener y mostrar los productos
async function obtenerProductos(contenedor) {
    if (!contenedor) return;

    try {
        const response = await fetch('obtener-productos.php');
        if (!response.ok) {
            throw new Error(`Error en la petición: ${response.statusText}`);
        }
        const productos = await response.json();

        if (productos && productos.length > 0) {
            renderizarProductos(productos, contenedor);
        } else {
            contenedor.innerHTML = '<p>No se encontraron productos.</p>';
        }
    } catch (error) {
        console.error('Error al cargar los productos:', error);
        contenedor.innerHTML = '<p>Ocurrió un error al cargar los productos.</p>';
    }
}

// Renderizar productos en cualquier contenedor
function renderizarProductos(productos) {
    const contenedor = document.getElementById('contenedorDinamico'); 
    if (!contenedor) {
        console.error("Error: No se encontró el contenedor dinámico.");
        return;
    }

    contenedor.innerHTML = ''; // Limpiar contenido anterior antes de agregar nuevos productos

    const fragment = document.createDocumentFragment(); 

    productos.forEach(producto => {
        const tarjetaProducto = document.createElement('div');
        tarjetaProducto.classList.add('item');

        const precio = parseFloat(producto.precio) || 0;
        const oferta = parseFloat(producto.oferta) || 0;
        const tieneOferta = oferta > 0;
        const precioDescontado = tieneOferta ? precio * (1 - (oferta / 100)) : precio;

        tarjetaProducto.innerHTML = `
            <figure>
                <img class="img-item" src="${producto.imagen}" alt="${producto.nombre}">
                ${tieneOferta ? `<div class="precio-oferta">-${oferta}%</div>` : ''} 
            </figure>
            <div class="info-product">
                <h2>${producto.nombre}</h2>
                <p class="price">
                    ${tieneOferta ? `<span class="precio-original">$${precio.toFixed(2)}</span>` : ''} 
                    <span class="${tieneOferta ? 'precio-descontado' : 'precio-normal'}">$${precioDescontado.toFixed(2)}</span>
                </p>
                <p class="id">ID: ${producto.id}</p>
                <button class="btn-add-cart" 
                        data-id="${producto.id}" 
                        data-nombre="${producto.nombre}" 
                        data-precio="${precioDescontado.toFixed(2)}"
                        data-oferta="${producto.oferta}"> <!-- Agregamos la oferta aquí -->
                    Añadir al carrito
                </button>
                <button onclick="window.location.href='info-product.html?id=${producto.id}'" class="btn">
                    Info
                </button>
            </div>
        `;

        fragment.appendChild(tarjetaProducto);
    });

    contenedor.appendChild(fragment); // Agregar los productos al contenedor

    document.querySelectorAll(".btn-add-cart").forEach(button => {
        button.addEventListener("click", function () {
            const producto = {
                id: this.dataset.id,
                nombre: this.dataset.nombre,
                imagen: this.closest(".item").querySelector(".img-item").src, 
                precio: parseFloat(this.dataset.precio),
                oferta: parseFloat(this.dataset.oferta) || 0 // Aquí usamos la oferta almacenada en el dataset
            };
    
            agregarAlCarrito(producto);
        });
    });
}


// Obtener y mostrar los productos
async function obtenerProductos(contenedor) {
    if (!contenedor) return;

    try {
        const response = await fetch('obtener-productos.php');
        if (!response.ok) {
            throw new Error(`Error en la petición: ${response.statusText}`);
        }
        const productos = await response.json();

        if (productos && productos.length > 0) {
            renderizarProductos(productos, contenedor);
        } else {
            contenedor.innerHTML = '<p>No se encontraron productos.</p>';
        }
    } catch (error) {
        console.error('Error al cargar los productos:', error);
        contenedor.innerHTML = '<p>Ocurrió un error al cargar los productos.</p>';
    }
}

// Obtener y mostrar productos en la página de inicio (index)
async function obtenerProductosIndex() {
    const contenedorPrincipal = document.getElementById('contenedorPrincipal');
    if (!contenedorPrincipal) return;

    try {
        const response = await fetch('obtener-productos.php');
        if (!response.ok) {
            throw new Error(`Error en la petición: ${response.statusText}`);
        }
        const productos = await response.json();

        if (productos && productos.length > 0) {
            renderizarProductosindex(productos, contenedorPrincipal);
        } else {
            contenedorPrincipal.innerHTML = '<p>No se encontraron productos para mostrar en el inicio.</p>';
        }
    } catch (error) {
        console.error('Error al cargar los productos en el inicio:', error);
        contenedorPrincipal.innerHTML = '<p>Ocurrió un error al cargar los productos del inicio.</p>';
    }
}



// Obtener productos según la página
if (document.getElementById('contenedorDinamico')) obtenerProductos(document.getElementById('contenedorDinamico'));
if (document.getElementById('contenedorPrincipal')) obtenerProductosIndex(); // Llamar la función de obtener productos para la página principal


function renderizarProductosindex(productos, contenedor) {
    if (!contenedor) {
        console.error("Error: No se encontró el contenedor principal.");
        return;
    }

    contenedor.innerHTML = ''; // Limpiar contenido anterior antes de agregar nuevos productos

    const fragment = document.createDocumentFragment(); 

    productos.forEach(producto => {
        const tarjetaProducto = document.createElement('div');
        tarjetaProducto.classList.add('item');

        const precio = parseFloat(producto.precio) || 0;
        const oferta = parseFloat(producto.oferta) || 0;
        const tieneOferta = oferta > 0;
        const precioDescontado = tieneOferta ? precio * (1 - (oferta / 100)) : precio;

        tarjetaProducto.innerHTML = `
            <figure>
                <img class="img-item" src="${producto.imagen}" alt="${producto.nombre}">
                ${tieneOferta ? `<div class="precio-oferta">-${oferta}%</div>` : ''} 
            </figure>
            <div class="info-product">
                <h2>${producto.nombre}</h2>
                <p class="price">
                    ${tieneOferta ? `<span class="precio-original">$${precio.toFixed(2)}</span>` : ''} 
                    <span class="${tieneOferta ? 'precio-descontado' : 'precio-normal'}">$${precioDescontado.toFixed(2)}</span>
                </p>
                <p class="id">ID: ${producto.id}</p>
                <button onclick="window.location.href='tienda.html'" class="btn">
                ver mas
                </button>
                <button onclick="window.location.href='info-product.html?id=${producto.id}'" class="btn">
                    Info
                </button>
            </div>
        `;

        fragment.appendChild(tarjetaProducto);
    });

    contenedor.appendChild(fragment); // Agregar los productos al contenedor
}


// Obtener productos según la página
// Obtener productos según la página
if (document.getElementById('contenedorDinamico')) obtenerProductos(document.getElementById('contenedorDinamico'));
if (document.getElementById('contenedorPrincipal')) renderizarProductosindex(productos, document.getElementById('contenedorPrincipal'));


// Búsqueda en tiempo real
let debounceTimer;
document.getElementById('busqueda')?.addEventListener('input', function () {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
        buscarProductos(this.value.trim());
    }, 300);
});

async function buscarProductos(busqueda) {
    const cDinamico = document.getElementById('contenedorDinamico');
    if (!cDinamico) return;

    if (!busqueda) {
        obtenerProductos(cDinamico);
        return;
    }

    try {
        const response = await fetch('busqueda.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `busqueda=${encodeURIComponent(busqueda)}`
        });

        if (!response.ok) {
            throw new Error(`Error en la petición: ${response.statusText}`);
        }

        const productos = await response.json();
        renderizarProductos(productos, cDinamico);
    } catch (error) {
        console.error('Error al buscar productos:', error);
        cDinamico.innerHTML = '<p>Ocurrió un error al buscar productos.</p>';
    }
}

// Mostrar información del producto en info-product.html
async function infoProductos() {
    const iDinamico = document.getElementById('infoDinamico');
    if (!iDinamico) return;

    const urlParams = new URLSearchParams(window.location.search);
    const productoId = parseInt(urlParams.get('id'));
    if (!productoId) {
        console.error('No se ha proporcionado un ID de producto.');
        return;
    }

    try {
        const response = await fetch('obtener-productos.php');
        const productos = await response.json();
        const producto = productos.find(p => p.id === productoId);

        if (!producto) {
            console.error('Producto no encontrado');
            return;
        }

        const precio = parseFloat(producto.precio) || 0;
        const oferta = parseFloat(producto.oferta) || 0;
        const tieneOferta = oferta > 0;
        const precioDescontado = tieneOferta ? precio * (1 - (oferta / 100)) : precio;

        iDinamico.innerHTML = `
            <div class="container-title">${producto.nombre}</div>
            <main class="main">
                <div class="container-img">
                <img src="${producto.imagen}" alt="img">
                <div class="precio-oferta">-${oferta}%</div>
                </div>
                <div class="container-info-product">
                    <div class="container-price">
                        <span id="precioProducto">
                            ${tieneOferta ? `<span tieneOferta class="precio-original">$${precio.toFixed(2)}</span>` : ''}
                            <span class="${tieneOferta ? 'precio-descontado' : 'precio-normal'}">$${precioDescontado.toFixed(2)}</span>
                        </span>
                    </div>
                    <div class="container-add-cart">
                        <div class="container-quantity">
                            <i class="fa-solid fa-plus" id="increment"></i>
                            <input type="number" id="inputCantidad" value="1" min="1" class="input-quantity">
                            <i class="fa-solid fa-minus" id="decrement"></i>
                        </div>
                        <button class="btn-add-cart">Añadir al carrito</button>
                    </div>
                    <div class="container-description">
                        <h4>Descripción</h4>
                        <p>${producto.descripcion}</p>    
                    </div>
                </div>
            </main>
        `;

    } catch (error) {
        console.error('Error al cargar la información del producto:', error);
    }
}

// Contador de productos en el carrito
function contadorCarrito() {
    const carritoContador = document.getElementById("contador-productos");
    if (!carritoContador) return;

    const memoria = JSON.parse(localStorage.getItem("productos")) || [];
    const cuenta = memoria.reduce((acum, item) => acum + item.cantidad, 0);  // Cambié producto por item
    carritoContador.innerText = cuenta;
}

contadorCarrito();

// Cargar info-productos si estamos en esa página
if (document.getElementById('infoDinamico')) infoProductos();

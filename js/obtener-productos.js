// Obtener productos para tienda.html
async function obtenerProductos() {
    const cDinamico = document.getElementById('contenedorDinamico');
    if (!cDinamico) return; // Validar existencia del contenedor

    try {
        const response = await fetch('obtener-productos.php');
        if (!response.ok) {
            throw new Error(`Error en la petición: ${response.statusText}`); // Si la respuesta no es OK
        }
        const productos = await response.json();
        productos.forEach(producto => {
            const tarjetaProducto = `
                <div class="item">
                    <figure>
                        <img class="img-item" src="${producto.imagen}" alt="${producto.nombre}">
                    </figure>
                    <div class="info-product">
                        <h2>${producto.nombre}</h2>
                        <p class="price">$${producto.precio}</p>
                        <p class="id">ID: ${producto.id}</p>
                        <button class="btn-add-cart" 
                                data-id="${producto.id}" 
                                data-nombre="${producto.nombre}" 
                                data-precio="${producto.precio}">
                            Añadir al carrito
                        </button>
                        <button onclick="window.location.href='info-product.html?id=${producto.id}'" class="btn">
                            Info
                        </button>
                    </div>
                </div>
            `;
            cDinamico.innerHTML += tarjetaProducto;
        });
    } catch (error) {
        console.error('Error al cargar los productos:', error);
        cDinamico.innerHTML = '<p>Ocurrió un error al cargar los productos.</p>';
    }
}



// Búsqueda en tiempo real
let debounceTimer;

document.getElementById('busqueda').addEventListener('input', function () {
    clearTimeout(debounceTimer); // Limpiar cualquier temporizador previo

    debounceTimer = setTimeout(() => {
        buscarProductos(this.value.trim());
    }, 300); // Espera 300 ms antes de ejecutar la búsqueda
});

async function buscarProductos(busqueda) {
    const cDinamico = document.getElementById('contenedorDinamico');

    if (!busqueda) {
        obtenerProductos(); // Si no hay texto, recargar todos los productos
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
        cDinamico.innerHTML = '';

        if (productos.length === 0) {
            cDinamico.innerHTML = '<p>No se encontraron productos.</p>';
        } else {
            productos.forEach(producto => {
                const tarjetaProducto = `
                    <div class="item">
                        <figure>
                            <img class="img-item" src="${producto.imagen}" alt="${producto.nombre}">
                        </figure>
                        <div class="info-product">
                            <h2>${producto.nombre}</h2>
                            <p class="price">$${producto.precio}</p>
                            <p class="id">ID: ${producto.id}</p>
                            <button class="btn-add-cart" 
                                    data-id="${producto.id}" 
                                    data-nombre="${producto.nombre}" 
                                    data-precio="${producto.precio}">
                                Añadir al carrito
                            </button>
                            <button onclick="window.location.href='info-product.html?id=${producto.id}'" class="btn">
                                Info
                            </button>
                        </div>
                    </div>
                `;
                cDinamico.innerHTML += tarjetaProducto;
            });
        }
    } catch (error) {
        console.error('Error al buscar productos:', error);
        cDinamico.innerHTML = '<p>Ocurrió un error al buscar productos.</p>';
    }
}

// Obtener productos para index.html
async function obtenerProductosIndex() {
    const cPrincipal = document.getElementById('contenedorPrincipal');
    if (!cPrincipal) return; // Validar existencia del contenedor

    try {
        const response = await fetch('obtener-productos.php'); 
        const productos = await response.json(); 

        productos.forEach(producto => {
            const tarjetaProducto = `
                <div class="item">
                    <figure>
                        <img class="img-item" src="${producto.imagen}" alt="${producto.nombre}">
                    </figure>
                    <div class="info-product">
                        <h2>${producto.nombre}</h2>
                        <p class="price">$${producto.precio}</p>
                        <p class="id">ID: ${producto.id}</p>
                        <button class="btn-add-cart" 
                                data-id="${producto.id}" 
                                data-nombre="${producto.nombre}" 
                                data-precio="${producto.precio}">
                            Añadir al carrito
                        </button>
                        <button onclick="window.location.href='tienda.html'" class="btn">Ver Más</button>
                    </div>
                </div>
            `;
            cPrincipal.innerHTML += tarjetaProducto;
        });
    } catch (error) {
        console.error('Error al cargar los productos:', error);
    }
}

// Mostrar información del producto en info-product.html
async function infoProductos() {
    const iDinamico = document.getElementById('infoDinamico');
    if (!iDinamico) return; // Validar existencia del contenedor

    const urlParams = new URLSearchParams(window.location.search);
    const productoId = urlParams.get('id');
    if (!productoId) {
        console.error('No se ha proporcionado un ID de producto.');
        return;
    }

    try {
        const response = await fetch(`obtener-productos.php?id=${productoId}`);
        const producto = await response.json(); 

        const tarjetaProducto = `
            <div class="container-title">${producto.nombre}</div>
            <main class="main">
                <div class="container-img">
                    <img src="${producto.imagen}" alt="img">
                </div>
                <div class="container-info-product">
                    <div class="container-price">
                        <span id="precioProducto">${producto.precio}</span>
                    </div>
                    <div class="container-details-products">
                        <div class="form-group">
                            <!-- color -->
                            <label for="color">Color</label>
                            <select name="color" id="color">
                                <option disabled selected value="">Escoge una opción</option>
                                <option value="color">${producto.color}</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <!-- talle -->
                            <label for="talle">Talle</label>
                            <select name="talle" id="talle">
                                <option disabled selected value="">Escoge una opción</option>
                                <option value="talle">${producto.talle}</option>
                            </select>
                        </div>
                    </div>

                    <div class="container-add-cart">
                        <div class="container-quantity">
                            <i class="fa-solid fa-plus" id="increment"></i>
                            <input type="number" id="inputCantidad" placeholder="1" value="1" min="1" class="input-quantity">
                            <i class="fa-solid fa-minus" id="decrement"></i>
                        </div>
                        <button class="btn-add-cart" 
                                data-id="${producto.id}" 
                                data-nombre="${producto.nombre}" 
                                data-precio="${producto.precio}"
                                onclick="window.location.href='carrito.html'"> Añadir al carrito</button>
                    </div>
                    <div class="container-description">
                        <div class="title-description">
                            <h4>Descripción</h4>
                        </div>
                        <div class="text-description">
                            <p>${producto.descripcion}</p>    
                        </div>
                    </div>
                </div>
            </main>
        `;
        iDinamico.innerHTML = tarjetaProducto;

        // Lógica para manejar la cantidad y precio al cambiar la cantidad
        const inputCantidad = document.getElementById("inputCantidad");
        const precioElemento = document.getElementById("precioProducto");
        const btnIncrement = document.getElementById("increment");
        const btnDecrement = document.getElementById("decrement");
        const btnAgregarCarrito = document.querySelector(".btn-add-cart");

        // Incrementar la cantidad
        btnIncrement.addEventListener("click", () => {
            inputCantidad.value = parseInt(inputCantidad.value) + 1;
            actualizarPrecio();
        });

        // Decrementar la cantidad
        btnDecrement.addEventListener("click", () => {
            if (inputCantidad.value > 1) {
                inputCantidad.value = parseInt(inputCantidad.value) - 1;
                actualizarPrecio();
            }
        });

        // Función para actualizar el precio
        function actualizarPrecio() {
            const cantidad = parseInt(inputCantidad.value);
            const precioUnitario = parseFloat(producto.precio);
            const precioTotal = cantidad * precioUnitario;
            precioElemento.textContent = `$${precioTotal.toFixed(2)}`;
        }

        // Lógica para agregar al carrito
        btnAgregarCarrito.addEventListener("click", () => {
            const cantidad = parseInt(inputCantidad.value);
            agregarAlCarrito(producto, cantidad);
        });

        // Función para agregar el producto al carrito
        function agregarAlCarrito(producto, cantidad) {
            const productosCarrito = JSON.parse(localStorage.getItem("productos")) || [];
            const productoExistente = productosCarrito.find(p => p.id === producto.id);

            if (productoExistente) {
                productoExistente.cantidad += cantidad; // Si ya existe, aumenta la cantidad
            } else {
                productosCarrito.push({
                    ...producto,
                    cantidad: cantidad
                }); // Si no existe, agrega el producto con la cantidad seleccionada
            }

            // Guardar los productos en el localStorage
            localStorage.setItem("productos", JSON.stringify(productosCarrito));

            // Actualizar el total del carrito
            actualizarTotalCarrito();
        }

        // Función para actualizar el total del carrito
        function actualizarTotalCarrito() {
            const productosCarrito = JSON.parse(localStorage.getItem("productos")) || [];
            const totalCarrito = productosCarrito.reduce((total, producto) => {
                return total + (producto.precio * producto.cantidad);
            }, 0);
            console.log("Total carrito:", totalCarrito.toFixed(2)); // Imprime el total del carrito (o muestra donde necesites)
        }

    } catch (error) {
        console.error('Error al cargar la información del producto:', error);
    }
}

// Manejar eventos dinámicos
document.addEventListener('click', (event) => {
    if (event.target.matches('.btn-add-cart')) {
        const card = event.target.closest('.item, .main'); // Encuentra el contenedor del producto
        const id = event.target.getAttribute('data-id');
        const nombre = event.target.getAttribute('data-nombre');
        const precio = parseFloat(event.target.getAttribute('data-precio'));
        const cantidad = document.querySelector('.input-quantity') 
            ? parseInt(document.querySelector('.input-quantity').value, 10) 
            : 1;
        const imagen = card.querySelector('img').getAttribute('src'); // Captura la imagen desde el contenedor

        agregarAlCarrito({ id, nombre, precio, cantidad, imagen });
    }
    contadorCarrito();
});

// Función para agregar productos al carrito
function agregarAlCarrito(producto) {
    const productosEnCarrito = JSON.parse(localStorage.getItem("productos")) || [];
    const index = productosEnCarrito.findIndex(item => item.id === producto.id);

    if (index !== -1) {
        // Si el producto ya está en el carrito, actualiza la cantidad
        productosEnCarrito[index].cantidad += producto.cantidad;
    } else {
        // Si no está, agrega el producto con todos los datos, incluyendo imagen
        productosEnCarrito.push({
            id: producto.id,
            nombre: producto.nombre,
            precio: producto.precio,
            cantidad: producto.cantidad,
            imagen: producto.imagen, // Asegúrate de incluir la imagen
        });
    }

    localStorage.setItem("productos", JSON.stringify(productosEnCarrito));
    contadorCarrito(); // Actualiza el contador del carrito
}

// Contador de productos en el carrito
const carritoContador = document.getElementById("contador-productos");
function contadorCarrito() {
    const memoria = JSON.parse(localStorage.getItem("productos")) || [];
    const cuenta = memoria.reduce((acum, current) => acum + current.cantidad, 0);
    carritoContador.innerText = cuenta;
}

contadorCarrito();

// Detectar la página y cargar la función correspondiente
if (document.getElementById('contenedorDinamico')) obtenerProductos();
if (document.getElementById('contenedorPrincipal')) obtenerProductosIndex();
if (document.getElementById('infoDinamico')) infoProductos();

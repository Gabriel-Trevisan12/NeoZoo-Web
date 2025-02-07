document.addEventListener('DOMContentLoaded', async function () {
    const menuContainer = document.getElementById('menu');

    try {
        const response = await fetch('categorias.php');
        if (!response.ok) {
            throw new Error(`Error en la petición: ${response.statusText}`);
        }

        const data = await response.json();
        renderizarMenu(data, menuContainer);
    } catch (error) {
        console.error('Error al cargar categorías:', error);
    }
});

function renderizarMenu(data, menuContainer) {
    data.forEach(categoria => {
        const menuItem = document.createElement('div');
        menuItem.classList.add('menu-item');
        menuItem.textContent = categoria.nombre;

        const submenu = document.createElement('div');
        submenu.classList.add('submenu');

        categoria.subcategorias.forEach(subcategoria => {
            const subcategoriaLink = document.createElement('a');
            subcategoriaLink.href = '#'; // Evita la navegación
            subcategoriaLink.textContent = subcategoria.nombre;
            subcategoriaLink.dataset.id = subcategoria.id; // Guarda el ID de la subcategoría

            // Agregar evento para cargar productos de la subcategoría
            subcategoriaLink.addEventListener('click', async function (event) {
                event.preventDefault(); // Evita la navegación por defecto
                const idSubcategoria = this.dataset.id;
                await obtenerProductosPorSubcategoria(idSubcategoria);
            });

            submenu.appendChild(subcategoriaLink);
        });

        menuItem.appendChild(submenu);
        menuContainer.appendChild(menuItem);
    });
}

async function obtenerProductosPorSubcategoria(idSubcategoria) {
    const cDinamico = document.getElementById('contenedorDinamico');
    
    if (!cDinamico) {
        console.error("Error: No se encontró el contenedor dinámico.");
        return;
    }

    cDinamico.innerHTML = '<p>Cargando productos...</p>'; // Mensaje de carga

    try {
        const response = await fetch(`obtener-productos.php?subcategoria=${idSubcategoria}`);
        if (!response.ok) {
            throw new Error(`Error en la petición: ${response.statusText}`);
        }

        const productos = await response.json();
        console.log("Productos obtenidos:", productos); // Verifica si hay datos

        if (productos.length > 0) {
            renderizarProductos(productos);
        } else {
            cDinamico.innerHTML = '<p>No hay productos en esta subcategoría.</p>';
        }
    } catch (error) {
        console.error('Error al cargar productos:', error);
        cDinamico.innerHTML = '<p>Ocurrió un error al cargar los productos.</p>';
    }
}



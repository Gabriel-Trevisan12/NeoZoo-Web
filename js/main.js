const btncart = document.querySelector('.container-cart-icon')
const containerCartProducts = document.querySelector('.container-cart-products')


btncart.addEventListener('click', () => {
containerCartProducts.classList.toggle('hidden-cart')

})


/* funcion carrito */


const cartInfo = document.querySelector('.cart-product')
const rowProduct = document.querySelector('.row-product')

// lista de contenedores de product//

const productsList = document.querySelector('.container-items');
let allProducts = [];

const valorTotal = document.querySelector('.total-pagar')

const countProducts = document.querySelector('#contador-productos')



productsList.addEventListener('click', e => {
    if (e.target.classList.contains('btn-add-cart')) {
        const product = e.target.parentElement;

        const infoProduct = {
            quantity: 1,
            title: product.querySelector('h2').textContent,
            price: product.querySelector('p').textContent,
        };

        // Verificar si el producto ya existe en el carrito
        const exists = allProducts.some(product => product.title === infoProduct.title);

        if (exists) {
            // Si existe, incrementar la cantidad
            allProducts = allProducts.map(product => {
                if (product.title === infoProduct.title) {
                    product.quantity++;
                }
                return product;
            });
        } else {
            // Si no existe, agregar el producto
            allProducts = [...allProducts, infoProduct];
        }

        showHTML();
    }
});

rowProduct.addEventListener('click', (e) =>{
    if(e.target.classList.contains('icon-close')){
        const product = e.target.parentElement;
        const title = product.querySelector('p').textContent;

        allProducts = allProducts.filter( product => product.title !== title

        );

        console.log(allProducts)

        showHTML()
    }
});

const showHTML = () => {

 if(!allProducts.length){
    containerCartProducts.innerHTML=`

<p class="cart-empty">El carrito esta vacio</p>

    `
    
    
 }

    // Limpiar productos del DOM
    rowProduct.innerHTML = '';

    let total = 0;
    let totalOfProducts = 0;

    // Mostrar todos los productos en el carrito
    allProducts.forEach(product => {
        const containerProduct = document.createElement('div');
        containerProduct.classList.add('cart-product');

        containerProduct.innerHTML = `
            <div class="info-cart-product">
                <span class="cantidad-producto-carrito">${product.quantity}</span>
                <p class="titulo-producto-carrito">${product.title}</p>
                <span class="precio-producto-carrito">${product.price}</span>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="icon-close">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
        `;

        rowProduct.append(containerProduct);

        total = total + parseInt(product.quantity * product.price.slice(1));
        totalOfProducts = totalOfProducts + product.quantity;
    });

valorTotal.innerText = `$${total}`;
countProducts.innerText = totalOfProducts;

};


/* js del carrusel  */


const grande = document.querySelector('.carrusel-grande');
const punto = document.querySelectorAll('.punto');

punto.forEach((cadaPunto, i) => {
    punto[i].addEventListener('click', () => {
        let posicion = i;
        let operacion = posicion * -50;

        // Corregido el uso de backticks para la interpolación
        grande.style.transform = `translateX(${operacion}%)`;

        // Remueve la clase "activo" de todos los puntos
        punto.forEach((cadaPunto, i) => {
            punto[i].classList.remove('activo');
        });

        // Agrega la clase "activo" al punto actual
        punto[i].classList.add('activo');
    });
});

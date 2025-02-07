document.addEventListener('DOMContentLoaded', function () {
    // Cargar las ofertas desde el servidor
    fetch('includes/obtener-portadas.php')
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al cargar las ofertas');
            }
            return response.json();
        })
        .then(ofertas => {
            const slidesContainer = document.querySelector('.slides');
            const controllerContainer = document.querySelector('.slider-controler');
            slidesContainer.innerHTML = '';
            controllerContainer.innerHTML = '';

            ofertas.forEach((oferta, index) => {
                // Crear cada slide
                const slide = document.createElement('li');
                slide.className = `slide ${index === 0 ? 'active' : ''}`;
                slide.id = `slide${index + 1}`;
                slide.innerHTML = `
                    <a href="#">
                        <img src="${oferta.imagen}" alt="Oferta ${index + 1}">
                    </a>
                `;
                slidesContainer.appendChild(slide);

                // Crear el bullet para el slider
                const bullet = document.createElement('li');
                bullet.innerHTML = `<a href="#slide${index + 1}">&bullet;</a>`;
                controllerContainer.appendChild(bullet);
            });

            // Inicializar el slider con las nuevas ofertas cargadas
            initSlider();
        })
        .catch(error => console.error('Error al cargar las ofertas:', error));

    function initSlider() {
        const slides = document.querySelectorAll('.slide');
        const controls = document.querySelectorAll('.slider-controler a');
        let currentIndex = 0;
        const slideInterval = 3000; // Tiempo entre cada cambio (en milisegundos)

        // Función para mostrar una diapositiva específica
        function showSlide(index) {
            if (index >= slides.length) index = 0;
            if (index < 0) index = slides.length - 1;

            // Quitar clase activa de todas las diapositivas y controles
            slides.forEach(slide => slide.classList.remove("active"));
            controls.forEach(control => control.classList.remove("active"));

            // Agregar clase activa al slide y control actual
            slides[index].classList.add("active");
            controls[index].classList.add("active");

            // Actualizar el índice actual
            currentIndex = index;
        }

        // Función para avanzar al siguiente slide
        function nextSlide() {
            showSlide(currentIndex + 1);
        }

        // Función para retroceder al slide anterior
        function prevSlide() {
            showSlide(currentIndex - 1);
        }

        // Iniciar el slider automático
        let autoSlide = setInterval(nextSlide, slideInterval);

        // Pausar el slider cuando el mouse está sobre él
        const sliderContainer = document.querySelector(".slider");
        sliderContainer.addEventListener("mouseenter", () => clearInterval(autoSlide));
        sliderContainer.addEventListener("mouseleave", () => {
            autoSlide = setInterval(nextSlide, slideInterval);
        });

        // Añadir eventos de clic a los controles
        controls.forEach((control, index) => {
            control.addEventListener("click", (event) => {
                event.preventDefault();
                showSlide(index);
            });
        });

        // Añadir eventos de clic a los botones "izquierda" y "derecha"
        const leftButton = document.getElementById("izq1");
        const rightButton = document.getElementById("der1");

        leftButton.addEventListener("click", () => {
            prevSlide();
            clearInterval(autoSlide); // Pausar el auto-slide temporalmente
            autoSlide = setInterval(nextSlide, slideInterval); // Reiniciar el auto-slide
        });

        rightButton.addEventListener("click", () => {
            nextSlide();
            clearInterval(autoSlide); // Pausar el auto-slide temporalmente
            autoSlide = setInterval(nextSlide, slideInterval); // Reiniciar el auto-slide
        });

        // Mostrar la primera diapositiva al cargar la página
        showSlide(currentIndex);
    }
});

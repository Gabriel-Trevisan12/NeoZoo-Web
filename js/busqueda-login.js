// Activar/Desactivar oferta
function updateOffer(productId, inputElement) {
    let newOffer = inputElement.value;

    if (newOffer < 0 || isNaN(newOffer)) {
        alert("La oferta debe ser un número válido y no negativa.");
        inputElement.value = 0;
        return;
    }

    let formData = new FormData();
    formData.append("id", productId);
    formData.append("oferta", newOffer);

    fetch("includes/actualizar-oferta.php", {
        method: "POST",
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            console.log("Oferta actualizada correctamente.");
            location.reload(); // Recarga la página para ver los cambios
        } else {
            alert("Error al actualizar la oferta: " + data.error);
        }
    })
}



// Aplicar oferta a productos
document.getElementById("offerForm").addEventListener("submit", function(event) {
    event.preventDefault();

    const oferta = document.getElementById("oferta").value;
    const marca = document.getElementById("marca_id_oferta").value;

    if (!oferta || !marca) {
        alert("Por favor, selecciona una marca y un porcentaje válido.");
        return;
    }

    // Enviar la oferta al servidor
    const formData = new FormData();
    formData.append('oferta', oferta);
    formData.append('marca_id', marca);
    formData.append('submitOffer', 'true');

    fetch('includes/precio-marca.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.text())
    .then(data => {
        alert(data);  // Mostrar mensaje de éxito/error
        // Actualizar la tabla para reflejar la nueva oferta
        updateTableOferta(marca, oferta);
    })
    .catch(error => console.error('Error:', error));
});

// Eliminar oferta de productos
document.getElementById("removeOfferButton").addEventListener("click", function(event) {
    event.preventDefault();

    const marca = document.getElementById("marca_id_oferta").value;

    if (!marca) {
        alert("Por favor, selecciona una marca.");
        return;
    }

    // Enviar la solicitud para eliminar la oferta
    const formData = new FormData();
    formData.append('marca_id', marca);
    formData.append('removeOffer', 'true');

    fetch('includes/precio-marca.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.text())
    .then(data => {
        alert(data);  // Mostrar mensaje de éxito/error
        // Eliminar la oferta de la tabla
        removeOfferFromTable(marca);
    })
    .catch(error => console.error('Error:', error));
});

function updateTableOferta(marcaId, oferta) {
    const rows = document.querySelectorAll('tr');
    rows.forEach(row => {
        const marcaCell = row.cells[7];  // Asumiendo que la columna de marca está en la posición 7
        if (marcaCell && marcaCell.textContent === marcaId) {
            const offerCell = row.cells[10];  // Columna de oferta
            const input = offerCell.querySelector('input');
            input.value = oferta;  // Actualiza el valor del porcentaje
        }
    });
}

function removeOfferFromTable(marcaId) {
    const rows = document.querySelectorAll('tr');
    rows.forEach(row => {
        const marcaCell = row.cells[7];  // Asumiendo que la columna de marca está en la posición 7
        if (marcaCell && marcaCell.textContent === marcaId) {
            const offerCell = row.cells[10];  // Columna de oferta
            const input = offerCell.querySelector('input');
            input.value = "";  // Elimina el valor de la oferta
        }
    });
}

// Función para filtrar productos por nombre y marca
document.getElementById("searchName").addEventListener("input", filterTable);
document.getElementById("searchBrand").addEventListener("input", filterTable);

function filterTable() {
    const searchName = document.getElementById("searchName").value.toLowerCase();
    const searchBrand = document.getElementById("searchBrand").value.toLowerCase();
    const rows = document.querySelectorAll("#productTable tbody tr");

    rows.forEach(row => {
        const name = row.cells[1].textContent.toLowerCase();
        const brand = row.cells[7].textContent.toLowerCase();

        if (name.includes(searchName) && brand.includes(searchBrand)) {
            row.style.display = "";
        } else {
            row.style.display = "none";
        }
    });
}

function deleteProduct(productId) {
    if (confirm("¿Estás seguro de que deseas eliminar este producto?")) {
        fetch("includes/eliminar-producto.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ productId: productId })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert("Producto eliminado correctamente.");
                location.reload();  // Recargar la página para actualizar la tabla
            } else {
                alert("Error al eliminar el producto: " + data.error);
            }
        })
        .catch(error => console.error("Error:", error));
    }
}

// Actualizar el precio
function updatePrice(productId, element) {
    const newPrice = parseFloat(element.textContent.trim());

    if (!isNaN(newPrice) && newPrice > 0) {
        console.log("Enviando datos:", { productId, newPrice }); // 🔹 Depuración

        fetch("includes/precio-manual.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ productId: productId, newPrice: newPrice })
        })
        .then(response => response.json())
        .then(data => {
            console.log("Respuesta del servidor:", data); // 🔹 Depuración
        })
        .catch(error => console.error("Error en la solicitud:", error));
    } else {
        alert("Ingrese un precio válido.");
        location.reload();
    }
}

document.getElementById("offerForm").addEventListener("submit", function (event) {
    event.preventDefault();

    const formData = new FormData(this);
    
    fetch("obtener-productos.php", {
        method: "POST",
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            data.productos.forEach(producto => {
                // Buscar la fila en la tabla por el ID del producto
                let row = document.querySelector(`#productTable tbody tr td:first-child:contains("${producto.id}")`).parentNode;
                if (row) {
                    row.querySelector(".offer-value").textContent = producto.oferta + "%";
                }
            });
            alert("Oferta aplicada correctamente.");
        } else {
            alert("Error al aplicar la oferta: " + data.error);
        }
    })
    .catch(error => console.error("Error:", error));
});



<?php
include 'includes/conexion.php'; // Conexión a la base de datos

// Función para agregar un producto
function agregarProducto($data, $file) {
    global $conn;
    
    $name = $data['name'];
    $price = $data['price'];
    $stock = $data['stock'];
    $description = $data['description'];
    $categoria = $data['categoria'];
    $subcategoria = $data['subcategoria'];
    $marca = $data['marca'];  
    $imagePath = null;

    // Procesar imagen
    if (isset($file['image']) && $file['image']['error'] === UPLOAD_ERR_OK) {
        $uploadDir = 'uploads/';
        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0777, true);
        }
        $fileName = uniqid() . '-' . basename($file['image']['name']);
        $imagePath = $uploadDir . $fileName;

        if (!move_uploaded_file($file['image']['tmp_name'], $imagePath)) {
            echo "Error al subir la imagen.";
            exit;
        }
    }

    // Insertar el producto en la base de datos
    $sql = "INSERT INTO productos (nombre, precio, stock, descripcion, imagen, id_categoria, id_subcategoria, id_marca) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("sisssiii", $name, $price, $stock, $description, $imagePath, $categoria, $subcategoria, $marca);

    if ($stmt->execute()) {
        echo "Producto agregado con éxito.";
    } else {
        echo "Error al agregar producto: " . $conn->error;
    }
}

// Función para aplicar una oferta
function aplicarOferta($oferta, $marca_id) {
    global $conn;

    if ($oferta >= 0 && $oferta <= 100) {
        $sql = "UPDATE productos SET oferta = ? WHERE id_marca = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("di", $oferta, $marca_id);

        if ($stmt->execute()) {
            echo "Oferta aplicada correctamente.";
        } else {
            echo "Error al aplicar la oferta: " . $conn->error;
        }
    } else {
        echo "Porcentaje de oferta no válido. Debe estar entre 0 y 100.";
    }
}

// Función para incrementar precios por marca
function incrementarPrecio($porcentaje, $marca_id) {
    global $conn;

    if ($porcentaje > 0) {
        // Primera consulta: Actualizar precios según el porcentaje
        $sql = "UPDATE productos SET precio = precio * ? WHERE id_categoria = ?";
        $stmt = $conn->prepare($sql);

        if ($stmt === false) {
            die('Error al preparar la consulta: ' . $conn->error);
        }

        $stmt->bind_param("di", $porcentaje, $idCategoria); // Se asume que $idCategoria está definido en alguna parte

        if ($stmt->execute()) {
            echo "Precios por categoría actualizados correctamente.<br>";
        } else {
            echo "Error al actualizar precios por categoría: " . $conn->error . "<br>";
        }

        // Segunda consulta: Actualizar precios de productos según marca
        $sql_aumento = "UPDATE productos SET precio = precio * (1 + ? / 100) WHERE id_marca = ?";
        $stmt_aumento = $conn->prepare($sql_aumento);

        if ($stmt_aumento === false) {
            die('Error al preparar la consulta para la marca: ' . $conn->error);
        }

        $stmt_aumento->bind_param("di", $porcentaje, $marca_id);

        if ($stmt_aumento->execute()) {
            echo "Precios por marca actualizados correctamente.";
        } else {
            echo "Error al actualizar precios por marca: " . $conn->error;
        }
    } else {
        echo "Porcentaje de incremento no válido.";
    }
}


// Función para actualizar el precio manualmente
function actualizarPrecio($productId, $newPrice) {
    global $conn;

    $sql = "UPDATE productos SET precio = ? WHERE id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("di", $newPrice, $productId);

    if ($stmt->execute()) {
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['success' => false, 'error' => $conn->error]);
    }
}

// Lógica de formulario
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_POST['submitAdd'])) {
        agregarProducto($_POST, $_FILES);
    } elseif (isset($_POST['submitOffer'])) {
        aplicarOferta($_POST['oferta'], $_POST['marca_id']);
    } elseif (isset($_POST['submitIncrease'])) {
        incrementarPrecio($_POST['porcentaje'], $_POST['marca_id']);
    }
}

// Lógica para recibir y actualizar el precio a través de AJAX (en formato JSON)
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['productId']) && isset($_POST['newPrice'])) {
    $productId = $_POST['productId'];
    $newPrice = $_POST['newPrice'];

    actualizarPrecio($productId, $newPrice);
}
?>


<!-- Parte HTML -->
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Productos</title>
    <link rel="stylesheet" href="css/productos.css">
</head>
<body>
<div class="main">
    <!-- Formulario para agregar producto -->
    <form id="productForm" class="form-container" method="POST" enctype="multipart/form-data">
        <h2>Agregar Producto</h2>
        <div class="form-group">
            <label for="name">Nombre del Producto</label>
            <input type="text" id="name" name="name" required>
        </div>
        <div class="form-group">
            <label for="price">Precio</label>
            <input type="number" id="price" name="price" step="0.01" required>
        </div>
        <div class="form-group">
            <label for="stock">Stock</label>
            <input type="number" id="stock" name="stock" required>
        </div>
        <div class="form-group">
            <label for="description">Descripción</label>
            <textarea id="description" name="description" rows="4" required></textarea>
        </div>
        <div class="form-group">
            <label for="categoria">Categoría</label>
            <select id="categoria" name="categoria" required onchange="cargarSubcategorias()">
                <option value="">Selecciona una categoría</option>
                <?php
                // Consulta para obtener las categorías
                $categorias = $conn->query("SELECT id_categoria, nombre_categoria FROM categorias");
                while ($categoria = $categorias->fetch_assoc()) {
                    echo "<option value='{$categoria['id_categoria']}'>{$categoria['nombre_categoria']}</option>";
                }
                ?>
            </select>
        </div>
        <div class="form-group">
            <label for="subcategoria">Subcategoría</label>
            <select id="subcategoria" name="subcategoria" required>
                <option value="">Selecciona una subcategoría</option>
            </select>
        </div>
        <script>
           function cargarSubcategorias() {
    const categoriaId = document.getElementById("categoria").value;
    const subcategoriaSelect = document.getElementById("subcategoria");

    // Reiniciar las opciones
    subcategoriaSelect.innerHTML = "<option value=''>Selecciona una subcategoría</option>";

    if (categoriaId) {
        // Hacer la solicitud al archivo subcategorias.php pasando el id de la categoría
        fetch(`subcategorias.php?categoria_id=${categoriaId}`)
            .then(response => response.json())
            .then(data => {
                // Verificar si hay subcategorías
                if (data.length > 0) {
                    data.forEach(subcategoria => {
                        const option = document.createElement("option");
                        option.value = subcategoria.id_subcategoria;  // Acceder al id_subcategoria
                        option.textContent = subcategoria.nombre_subcategoria;  // Acceder al nombre_subcategoria
                        subcategoriaSelect.appendChild(option);
                    });
                } else {
                    const option = document.createElement("option");
                    option.value = "";
                    option.textContent = "No hay subcategorías disponibles";
                    subcategoriaSelect.appendChild(option);
                }
            })
            .catch(error => console.error("Error al cargar subcategorías:", error));
    }
}




        </script>
        <div class="form-group">
            <label for="marca">Marca</label>
            <select id="marca" name="marca" required>
                <option value="">Selecciona una marca</option>
                <?php
                // Consulta para obtener las marcas
                $marcas = $conn->query("SELECT id_marca, nombre_marca FROM marcas");
                while ($marca = $marcas->fetch_assoc()) {
                    echo "<option value='{$marca['id_marca']}'>{$marca['nombre_marca']}</option>";
                }
                ?>
            </select>
        </div>
        <div class="form-group">
            <label for="image">Imagen</label>
            <input type="file" id="image" name="image" accept="image/*">
        </div>
        <button type="submit" name="submitAdd" class="btn-add">Agregar Producto</button>
    </form>
</div>

<hr>

<!-- Formulario para aumentar precios -->
<form id="increasePriceForm" class="form-container" method="POST">
    <h2>Incrementar Precios</h2>
    <div class="form-group">
        <label for="porcentaje">Porcentaje de Incremento</label>
        <input type="number" id="porcentaje" name="porcentaje" step="0.01" required>
    </div>
    <div class="form-group">
        <label for="marca_id">Marca</label>
        <select id="marca_id" name="marca_id" required>
            <option value="">Selecciona una marca</option>
            <?php 
            $marcas = $conn->query("SELECT id_marca, nombre_marca FROM marcas");
            while ($marca = $marcas->fetch_assoc()):
            ?>
                <option value="<?php echo $marca['id_marca']; ?>"><?php echo $marca['nombre_marca']; ?></option>
            <?php endwhile; ?>
        </select>
    </div>
    <button type="submit" name="submitIncrease" class="btn-increase">Incrementar Precios</button>
</form>

<!-- Formulario para aplicar oferta -->
<form id="offerForm" class="form-container" method="POST">
    <h2>Aplicar Oferta</h2>
    <div class="form-group">
        <label for="oferta">Porcentaje de Oferta (%)</label>
        <input type="number" id="oferta" name="oferta" min="0" max="100" required>
    </div>
    <div class="form-group">
        <label for="marca_id_oferta">Marca</label>
        <select id="marca_id_oferta" name="marca_id" required>
            <option value="">Selecciona una marca</option>
            <?php
            $marcas = $conn->query("SELECT id_marca, nombre_marca FROM marcas");
            while ($marca = $marcas->fetch_assoc()) {
                echo "<option value='{$marca['id_marca']}'>{$marca['nombre_marca']}</option>";
            }
            ?>
        </select>
    </div>
    <button type="submit" name="submitOffer" class="btn-offer">Aplicar Oferta</button>
    <!-- Botón para eliminar oferta -->
    <button type="button" id="removeOfferButton" class="btn-remove-offer">Eliminar Oferta</button>
</form>




<script>
document.getElementById("offerForm").addEventListener("submit", function(event) {
    const oferta = document.getElementById("oferta").value;
    const marca = document.getElementById("marca_id_oferta").value;
    if (!oferta || !marca) {
        alert("Por favor, selecciona una marca y un porcentaje válido.");
        event.preventDefault();
    }
});
</script>
<h2>Subir Nueva Imagen de Oferta</h2>
    <form action="includes/ofertas-portada.php" method="POST" enctype="multipart/form-data">
        <input type="file" name="imagen" accept="image/*" required>
        <button type="submit">Subir Imagen</button>
    </form>
    <?php
$conexion = include 'includes/conexion.php';
$resultado = $conexion->query("SELECT id_oferta, imagen FROM ofertas");

echo "<h2>Galería de Ofertas</h2>";
echo "<table border='1'>
        <tr>
            <th>Imagen</th>
            <th>Acciones</th>
        </tr>";
while ($row = $resultado->fetch_assoc()) {
    echo "<tr>
            <td><img src='" . str_replace('../', '', $row['imagen']) . "' width='150'></td>
            <td>
                <form action='includes/eliminar-imagen.php' method='POST' style='display:inline;'>
                    <input type='hidden' name='id_oferta' value='{$row['id_oferta']}'>
                    <button type='submit' name='eliminar'>Eliminar</button>
                </form>
            </td>
          </tr>";
}
echo "</table>";
?>

<script>
    document.querySelectorAll('.eliminar-imagen-btn').forEach(button => {
    button.addEventListener('click', function() {
        const idOferta = this.getAttribute('data-id_oferta');

        if (confirm("¿Estás seguro de que quieres eliminar la imagen?")) {
            fetch('include/eliminar-imagen.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: `id_oferta=${idOferta}`
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert(data.message);
                    location.reload(); // Recargar la página para reflejar los cambios
                } else {
                    alert("Error al eliminar la imagen.");
                }
            })
            .catch(error => console.error('Error:', error));
        }
    });
});
</script>

    <hr>

    <!-- Tabla de productos -->
    <div class="tabla">
        <h2>Productos en la Base de Datos</h2>
        <table border="1" id="productTable">
            <thead>
                <tr>
                    <th>ID</th>
                    <th><input type="text" id="searchName" placeholder="Buscar nombre"></th>
                    <th>Precio</th>
                    <th>Stock</th>
                    <th>Descripción</th>
                    <th>Categoría</th>
                    <th>Subcategoría</th>
                    <th><input type="text" id="searchBrand" placeholder="Buscar marca"></th>
                    <th>Imagen</th>
                    <th>Eliminar</th>
                    <th>Oferta</th>
                    
                </tr>
            </thead>
            <tbody>
                <?php
                $result = $conn->query("SELECT productos.*, categorias.nombre_categoria, subcategorias.nombre_subcategoria, marcas.nombre_marca 
                                        FROM productos
                                        JOIN categorias ON productos.id_categoria = categorias.id_categoria
                                        JOIN subcategorias ON productos.id_subcategoria = subcategorias.id_subcategoria
                                        JOIN marcas ON productos.id_marca = marcas.id_marca");

                while ($producto = $result->fetch_assoc()):
                ?>
                    <tr>
                        <td><?php echo $producto['id']; ?></td>
                        <td><?php echo $producto['nombre']; ?></td>
                        <td contenteditable="true" onblur="updatePrice(<?php echo $producto['id']; ?>, this)"><?php echo $producto['precio']; ?></td>
                        <td><?php echo $producto['stock']; ?></td>
                        <td><?php echo $producto['descripcion']; ?></td>
                        <td><?php echo $producto['nombre_categoria']; ?></td>
                        <td><?php echo $producto['nombre_subcategoria']; ?></td>
                        <td><?php echo $producto['nombre_marca']; ?></td>
                        <td><img src="<?php echo $producto['imagen']; ?>" width="100"></td>
                        <td><button onclick="deleteProduct(<?php echo $producto['id']; ?>)">Eliminar</button></td>
                        <td>
                            <input type="number" class="offer-percentage" value="<?php echo $producto['oferta']; ?>" style="width: 60px;" onblur="updateOffer(<?php echo $producto['id']; ?>, this)">
                        </td>

                        
                    </tr>
                <?php endwhile; ?>
            </tbody>
        </table>
    </div>
</div>
<script src="js/busqueda-login.js"></script>
</body>
</html>

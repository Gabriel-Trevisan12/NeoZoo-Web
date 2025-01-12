<?php
include 'includes/conexion.php';

// Función para verificar si un color ya existe y obtener su ID
function getColorId($colorName, $conn) {
    $sql = "SELECT id FROM colores WHERE nombre = ?";
    $stmt = $conn->prepare($sql);
    $stmt->execute([$colorName]);
    $color = $stmt->fetch();
    if ($color) {
        return $color['id']; // Retorna el ID del color si existe
    } else {
        // Si no existe, lo insertamos
        $insertSQL = "INSERT INTO colores (nombre) VALUES (?)";
        $stmtInsert = $conn->prepare($insertSQL);
        $stmtInsert->execute([$colorName]);
        return mysqli_insert_id($conn); // Usamos mysqli_insert_id aquí
    }
}

// Función para verificar si un talle ya existe y obtener su ID
function getTalleId($talleName, $conn) {
    $sql = "SELECT id FROM talles WHERE nombre = ?";
    $stmt = $conn->prepare($sql);
    $stmt->execute([$talleName]);
    $talle = $stmt->fetch();
    if ($talle) {
        return $talle['id']; // Retorna el ID del talle si existe
    } else {
        // Si no existe, lo insertamos
        $insertSQL = "INSERT INTO talles (nombre) VALUES (?)";
        $stmtInsert = $conn->prepare($insertSQL);
        $stmtInsert->execute([$talleName]);
        return mysqli_insert_id($conn); // Usamos mysqli_insert_id aquí
    }
}

// Si se envió el formulario para agregar producto
if (isset($_POST['submitAdd'])) {
    $name = $_POST['name'];
    $price = $_POST['price'];
    $stock = $_POST['stock'];
    $description = $_POST['description'];
    $size = $_POST['size'];
    $color = $_POST['color'];
    $categoria = $_POST['categoria'];

    // Procesar la imagen
    $imagePath = null;
    if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
        $uploadDir = 'uploads/';
        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0777, true);
        }
        $fileName = uniqid() . '-' . basename($_FILES['image']['name']);
        $imagePath = $uploadDir . $fileName;

        if (!move_uploaded_file($_FILES['image']['tmp_name'], $imagePath)) {
            echo "Error al subir la imagen.";
            exit;
        }
    }

    // Insertar el producto
    $sql = "INSERT INTO productos (nombre, precio, stock, descripcion, talle, color, imagen, categoria) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
    $stmt = $conn->prepare($sql);
    $stmt->execute([$name, $price, $stock, $description, $size, $color, $imagePath, $categoria]);

    // Obtener el ID del producto recién insertado
    $productId = mysqli_insert_id($conn); // Usamos mysqli_insert_id aquí

    // Verificar e insertar el color
    $colorId = getColorId($color, $conn);

    // Verificar e insertar el talle
    $sizeId = getTalleId($size, $conn);

    // Asociar color y talle con el producto
    $sql_color = "INSERT INTO producto_colores (producto_id, color_id) VALUES (?, ?)";
    $stmt_color = $conn->prepare($sql_color);
    $stmt_color->execute([$productId, $colorId]);

    $sql_talle = "INSERT INTO producto_talles (producto_id, talle_id) VALUES (?, ?)";
    $stmt_talle = $conn->prepare($sql_talle);
    $stmt_talle->execute([$productId, $sizeId]);

    echo "Producto agregado con éxito.";
}

// Si se envió el formulario para actualizar producto
if (isset($_POST['submitUpdate'])) {
    $id = $_POST['id'];
    $name = $_POST['nombre'];
    $price = $_POST['precio'];
    $stock = $_POST['stockk'];
    $description = $_POST['descripcion'];
    $size = $_POST['talle'];
    $color = $_POST['colorr'];
    $categoria = $_POST['categoriaa'];

    // Procesar la imagen (si se cambia)
    $imagePath = null;
    if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
        $uploadDir = 'uploads/';
        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0777, true);
        }
        $fileName = uniqid() . '-' . basename($_FILES['image']['name']);
        $imagePath = $uploadDir . $fileName;

        if (!move_uploaded_file($_FILES['image']['tmp_name'], $imagePath)) {
            echo "Error al subir la imagen.";
            exit;
        }
    }

    // Actualizar el producto
    $sql = "UPDATE productos SET nombre = ?, precio = ?, stock = ?, descripcion = ?, talle = ?, color = ?, imagen = ?, categoria = ? WHERE id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->execute([$name, $price, $stock, $description, $size, $color, $imagePath, $categoria, $id]);

    // Eliminar las relaciones previas
    $conn->exec("DELETE FROM producto_colores WHERE producto_id = $id");
    $conn->exec("DELETE FROM producto_talles WHERE producto_id = $id");

    // Verificar e insertar el color
    $colorId = getColorId($color, $conn);

    // Verificar e insertar el talle
    $sizeId = getTalleId($size, $conn);

    // Asociar color y talle con el producto
    $sql_color = "INSERT INTO producto_colores (producto_id, color_id) VALUES (?, ?)";
    $stmt_color = $conn->prepare($sql_color);
    $stmt_color->execute([$id, $colorId]);

    $sql_talle = "INSERT INTO producto_talles (producto_id, talle_id) VALUES (?, ?)";
    $stmt_talle = $conn->prepare($sql_talle);
    $stmt_talle->execute([$id, $sizeId]);

    echo "Producto actualizado con éxito.";
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
    <!-- Formulario para agregar o actualizar producto -->
    <form id="productForm" class="form-container" method="POST" enctype="multipart/form-data">
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
            <label for="size">Talle</label>
            <input type="text" id="size" name="size" placeholder="Ingresa el talle" required>
        </div>
        <div class="form-group">
            <label for="color">Color</label>
            <input type="text" id="color" name="color" placeholder="Ingresa el color" required>
        </div>
        <div class="form-group">
            <label for="categoria">Categoria</label>
            <input type="text" id="categoria" name="categoria" required>
        </div>
        <div class="form-group">
            <label for="image">Imagen</label>
            <input type="file" id="image" name="image" accept="image/*">
        </div>
        <button type="submit" name="submitAdd" class="btn-add">Agregar Producto</button>
        <button type="submit" name="submitUpdate" class="btn-update">Actualizar Producto</button>
    </form>
</div>

<hr>

<!-- Tabla de productos -->
<h2>Productos en la Base de Datos</h2>
<table border="1">
    <thead>
        <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Precio</th>
            <th>Stock</th>
            <th>Descripción</th>
            <th>Talle</th>
            <th>Color</th>
            <th>Categoría</th>
            <th>Imagen</th>
            <th>Eliminar</th>
        </tr>
    </thead>
    <tbody>
        <?php
            $result = $conn->query("SELECT * FROM productos");
            if ($result): 
                while ($producto = $result->fetch_assoc()): ?>
                    <tr>
                        <td><?php echo $producto['id']; ?></td>
                        <td><?php echo $producto['nombre']; ?></td>
                        <td><?php echo $producto['precio']; ?></td>
                        <td><?php echo $producto['stock']; ?></td>
                        <td><?php echo $producto['descripcion']; ?></td>
                        <td><?php echo $producto['talle']; ?></td>
                        <td><?php echo $producto['color']; ?></td>
                        <td><?php echo $producto['categoria']; ?></td>
                        <td><img src="<?php echo $producto['imagen']; ?>" alt="Imagen del producto" width="100"></td>
                        <td>
                            <form method="POST" action="">
                                <input type="hidden" name="id" value="<?php echo $producto['id']; ?>">
                                <button type="submit" name="submitDelete" class="btn-delete">Eliminar</button>
                            </form>
                        </td>
                    </tr>
                <?php endwhile; ?>
            <?php else: ?>
                <tr>
                    <td colspan="10">No se encontraron productos.</td>
                </tr>
            <?php endif; ?>
    </tbody>
</table>
</body>
</html>

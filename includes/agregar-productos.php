<?php
include 'conexion.php'; // Asegúrate de conectar a la base de datos

// Función para agregar un producto
function agregarProducto($data, $file) {
    global $conn;

    // Asignar los valores del formulario a las variables
    $name = $data['name'];
    $price = $data['price'];
    $stock = $data['stock'];
    $description = $data['description'];
    $categoria = $data['categoria'];
    $subcategoria = $data['subcategoria'];
    $marca = $data['marca'];  // Marca añadida
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
?>

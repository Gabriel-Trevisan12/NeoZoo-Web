<?php
include 'includes/conexion.php';

// Verificar si se proporcionó un ID en la URL
if (isset($_GET['id'])) {
    $id = intval($_GET['id']); // Convertir a entero para evitar inyección SQL

    // Consulta para un producto específico
    $sql = "SELECT id, nombre, precio, stock, descripcion, talle, color, imagen, categoria FROM productos WHERE id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $id); // Vincular el parámetro ID
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $producto = $result->fetch_assoc(); // Obtener el producto como un array asociativo
        echo json_encode($producto); // Retornar el producto en formato JSON
    } else {
        echo json_encode(["error" => "Producto no encontrado."]); // Manejar error si no existe el producto
    }

    $stmt->close();
} else {
    // Consulta para obtener todos los productos
    $sql = "SELECT id, nombre, precio, stock, descripcion, talle, color, imagen, categoria FROM productos";
    $result = $conn->query($sql);

    $productos = array();
    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $productos[] = $row; // Agregar cada producto al array
        }
    }

    echo json_encode($productos); // Retornar todos los productos en formato JSON
}

$conn->close();
?>






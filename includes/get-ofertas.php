<?php
include 'conexion.php'; // Asegúrate de incluir la conexión a la base de datos

// Consulta para obtener productos con una oferta activa
$query = "SELECT id, nombre, precio, imagen, oferta FROM productos WHERE oferta > 0";
$result = $conn->query($query);

$productos = [];

// Recolectar los datos de los productos
while ($producto = $result->fetch_assoc()) {
    $productos[] = $producto; // Agregar el producto al array
}

echo json_encode($productos); // Devolver los productos en formato JSON
?>

<?php
include 'includes/conexion.php'; // Conexión a la base de datos

// Mostrar errores para depuración
error_reporting(E_ALL);
ini_set('display_errors', 1);

if ($conn->connect_error) {
    die("Conexión fallida: " . $conn->connect_error);
}

$sql = "SELECT c.id_categoria AS categoria_id, c.nombre_categoria AS categoria_nombre, 
               s.id_subcategoria AS subcategoria_id, s.nombre_subcategoria AS subcategoria_nombre
        FROM categorias c
        LEFT JOIN subcategorias s ON c.id_categoria = s.id_categoria
        ORDER BY c.id_categoria, s.id_subcategoria";

$result = $conn->query($sql);

if (!$result) {
    die("Error en la consulta SQL: " . $conn->error);
}

$categorias = [];
while ($row = $result->fetch_assoc()) {
    $categoria_id = $row['categoria_id'];
    if (!isset($categorias[$categoria_id])) {
        $categorias[$categoria_id] = [
            'nombre' => $row['categoria_nombre'],
            'subcategorias' => []
        ];
    }
    if ($row['subcategoria_id']) {
        $categorias[$categoria_id]['subcategorias'][] = [
            'id' => $row['subcategoria_id'],
            'nombre' => $row['subcategoria_nombre']
        ];
    }
}

// Enviar respuesta JSON
header('Content-Type: application/json');
echo json_encode(array_values($categorias), JSON_UNESCAPED_UNICODE);

$conn->close();



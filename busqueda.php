<?php
include 'includes/conexion.php';
if ($conn->connect_error) {
    die("Conexión fallida: " . $conn->connect_error);
}

// Obtener el término de búsqueda
$busqueda = isset($_POST['busqueda']) ? $_POST['busqueda'] : '';
$busqueda_like = "%" . $busqueda . "%";

// Consulta preparada
$sql = $conn->prepare("SELECT * FROM productos WHERE nombre LIKE ?");
$sql->bind_param("s", $busqueda_like);
$sql->execute();
$result = $sql->get_result();

$productos = [];
while ($row = $result->fetch_assoc()) {
    $productos[] = $row;
}

echo json_encode($productos);
$conn->close();

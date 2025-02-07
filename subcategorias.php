<?php
include 'includes/conexion.php';

$categoriaId = $_GET['categoria_id'];

$stmt = $conn->prepare("SELECT id_subcategoria, nombre_subcategoria FROM subcategorias WHERE id_categoria = ?");
$stmt->bind_param("i", $categoriaId);
$stmt->execute();
$result = $stmt->get_result();

$subcategorias = [];
while ($row = $result->fetch_assoc()) {
    $subcategorias[] = $row;
}

echo json_encode($subcategorias);
?>

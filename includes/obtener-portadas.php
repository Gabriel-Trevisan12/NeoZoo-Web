<?php
header('Content-Type: application/json');
$conexion = include 'conexion.php';

$resultado = $conexion->query("SELECT id_oferta, imagen FROM ofertas ORDER BY id_oferta DESC");

$ofertas = [];
while ($row = $resultado->fetch_assoc()) {
    $ofertas[] = [
        'id' => $row['id_oferta'],
        'imagen' => str_replace('../', '', $row['imagen']) // Ajuste de ruta si es necesario
    ];
}

echo json_encode($ofertas);
?>

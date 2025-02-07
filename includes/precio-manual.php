<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
header("Content-Type: application/json");

include 'conexion.php';

function actualizarPrecio($conn, $productId, $newPrice) {
    $sql = "UPDATE productos SET precio = ? WHERE id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("di", $newPrice, $productId);

    if ($stmt->execute()) {
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['success' => false, 'error' => $conn->error]);
    }
}

$data = json_decode(file_get_contents("php://input"), true);

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($data['productId']) && isset($data['newPrice'])) {
    actualizarPrecio($conn, $data['productId'], $data['newPrice']);
} else {
    echo json_encode(['success' => false, 'error' => 'Datos no recibidos']);
}
?>

<?php
include 'conexion.php'; // Conexión a la base de datos

// Verifica si se ha recibido la solicitud POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Obtiene el ID del producto
    $data = json_decode(file_get_contents('php://input'), true);
    $productId = $data['productId'];

    if ($productId) {
        // Eliminar producto de la base de datos
        $sql = "DELETE FROM productos WHERE id = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("i", $productId);

        if ($stmt->execute()) {
            echo json_encode(["success" => true]);
        } else {
            echo json_encode(["success" => false, "error" => $conn->error]);
        }
    } else {
        echo json_encode(["success" => false, "error" => "ID de producto no válido."]);
    }
}
?>

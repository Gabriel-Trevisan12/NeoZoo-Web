<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

include 'conexion.php'; // Conexión a la base de datos

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $id = isset($_POST["id"]) ? intval($_POST["id"]) : 0;
    $oferta = isset($_POST["oferta"]) ? floatval($_POST["oferta"]) : 0;

    if ($id > 0) {
        $stmt = $conn->prepare("UPDATE productos SET oferta = ? WHERE id = ?");
        if (!$stmt) {
            echo json_encode(["success" => false, "error" => "Error en la preparación: " . $conn->error]);
            exit;
        }

        $stmt->bind_param("di", $oferta, $id);

        if ($stmt->execute()) {
            echo json_encode(["success" => true]);
        } else {
            echo json_encode(["success" => false, "error" => "Error en la ejecución: " . $stmt->error]);
        }

        $stmt->close();
    } else {
        echo json_encode(["success" => false, "error" => "ID de producto inválido."]);
    }
}

$conn->close();
?>

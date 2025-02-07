<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

$conexion = include 'conexion.php';

// ✅ SUBIR IMAGEN
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_FILES['imagen'])) {
    $directorioDestino = '../uploads/';

    if (!is_dir($directorioDestino)) {
        if (!mkdir($directorioDestino, 0755, true)) {
            die('No se pudo crear el directorio de destino.');
        }
    }

    $imagenTemp = $_FILES['imagen']['tmp_name'];
    $nombreArchivo = uniqid('oferta_', true) . '.' . pathinfo($_FILES['imagen']['name'], PATHINFO_EXTENSION);
    $rutaFinal = $directorioDestino . $nombreArchivo;

    if (move_uploaded_file($imagenTemp, $rutaFinal)) {
        $stmt = $conexion->prepare("INSERT INTO ofertas (imagen) VALUES (?)");
        if (!$stmt) {
            die("Error en la preparación de la consulta: " . $conexion->error);
        }

        $stmt->bind_param("s", $rutaFinal);
        if (!$stmt->execute()) {
            die("Error al insertar en la base de datos: " . $stmt->error);
        }

        // Redirigir si todo está bien
        header("Location: ../cargar-productos.php");
        exit();
    } else {
        die('Error al mover la imagen al directorio.');
    }
} else {
    die('No se recibió ninguna imagen o la solicitud no es POST.');
}
?>

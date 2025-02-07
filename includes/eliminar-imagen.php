<?php
if (isset($_POST['eliminar'])) {
    $conexion = include 'conexion.php';
    $idOferta = $_POST['id_oferta'];

    $stmt = $conexion->prepare("SELECT imagen FROM ofertas WHERE id_oferta = ?");
    $stmt->bind_param("i", $idOferta);
    $stmt->execute();
    $stmt->bind_result($rutaImagen);
    $stmt->fetch();
    $stmt->close();

    if ($rutaImagen && file_exists("../" . basename($rutaImagen))) {
        unlink("../" . basename($rutaImagen));
    }

    $stmt = $conexion->prepare("DELETE FROM ofertas WHERE id_oferta = ?");
    $stmt->bind_param("i", $idOferta);
    $stmt->execute();
}

header("Location: ../cargar-productos.php");
exit();
?>

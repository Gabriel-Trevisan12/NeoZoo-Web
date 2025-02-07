<?php
include 'conexion.php'; // Conexión a la base de datos

// Función para aplicar oferta o descuento
function aplicarOferta($oferta, $marca_id) {
    global $conn;

    if ($oferta >= 0 && $oferta <= 100) {
        $sql = "UPDATE productos SET oferta = ? WHERE id_marca = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("di", $oferta, $marca_id);

        if ($stmt->execute()) {
            echo "Oferta aplicada correctamente a la marca ID: $marca_id con $oferta% de descuento.";
        } else {
            echo "Error al aplicar la oferta: " . $stmt->error;
        }
    } else {
        echo "Porcentaje de oferta no válido. Debe estar entre 0 y 100.";
    }
}

// Función para eliminar oferta
function eliminarOferta($marca_id) {
    global $conn;

    $sql = "UPDATE productos SET oferta = NULL WHERE id_marca = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $marca_id);

    if ($stmt->execute()) {
        echo "Oferta eliminada correctamente de la marca ID: $marca_id.";
    } else {
        echo "Error al eliminar la oferta: " . $stmt->error;
    }
}

// Verifica si se ha recibido una solicitud POST y los datos están definidos
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_POST['submitOffer'])) {
        // Verificar que los datos de oferta y marca_id estén definidos
        if (isset($_POST['oferta']) && isset($_POST['marca_id']) && is_numeric($_POST['oferta'])) {
            $oferta = $_POST['oferta'];
            $marca_id = $_POST['marca_id'];
            aplicarOferta($oferta, $marca_id);
        } else {
            echo "Por favor, ingrese un porcentaje de oferta válido y seleccione una marca.";
        }
    } elseif (isset($_POST['removeOffer'])) {
        // Verificar que los datos de marca_id estén definidos
        if (isset($_POST['marca_id']) && is_numeric($_POST['marca_id'])) {
            $marca_id = $_POST['marca_id'];
            eliminarOferta($marca_id);
        } else {
            echo "Por favor, seleccione una marca para eliminar la oferta.";
        }
    }
}

?>

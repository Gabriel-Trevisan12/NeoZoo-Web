<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
header('Content-Type: application/json');

include 'includes/conexion.php';

// Variables para filtros
$categoria = isset($_GET['categoria']) && $_GET['categoria'] !== "" ? intval($_GET['categoria']) : null;
$subcategoria = isset($_GET['subcategoria']) && $_GET['subcategoria'] !== "" ? intval($_GET['subcategoria']) : null;
$marca = isset($_GET['marca']) && $_GET['marca'] !== "" ? intval($_GET['marca']) : null;
$id = isset($_GET['id']) && $_GET['id'] !== "" ? intval($_GET['id']) : null;

$sql = "SELECT 
            id AS id, 
            nombre, 
            descripcion, 
            stock, 
            precio, 
            imagen, 
            id_categoria AS categoria, 
            id_subcategoria AS subcategoria, 
            id_marca AS marca,
            oferta
        FROM productos 
        WHERE 1=1";

$params = [];
$types = "";

// Si se busca un producto específico por ID
if ($id !== null) {
    $sql .= " AND id = ?";
    $params[] = $id;
    $types .= "i"; 
} else {
    // Filtrar por categoría
    if ($categoria !== null) {
        $sql .= " AND id_categoria = ?";
        $params[] = $categoria;
        $types .= "i";
    }

    // Filtrar por subcategoría
    if ($subcategoria !== null) {
        $sql .= " AND id_subcategoria = ?";
        $params[] = $subcategoria;
        $types .= "i";
    }

    // Filtrar por marca
    if ($marca !== null) {
        $sql .= " AND id_marca = ?";
        $params[] = $marca;
        $types .= "i";
    }
}

$stmt = $conn->prepare($sql);
if (!empty($params)) {
    $stmt->bind_param($types, ...$params);
}
$stmt->execute();
$result = $stmt->get_result();

$productos = [];
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $productos[] = $row;
    }
}

echo json_encode($productos);
$stmt->close();
$conn->close();
?>

<?php

require_once __DIR__ . "/conexao.php";

header("Content-Type: application/json; charset=UTF-8");

$sql = "SELECT id, nome, email, criado FROM usuario ORDER BY id DESC";

$resultado = $con->query($sql);

$usuarios = [];

while ($user = $resultado->fetch_assoc()) {
    $usuarios[] = $user;
}

echo json_encode([
    "sucesso" => true,
    "usuarios" => $usuarios
]);

$con->close();

?>
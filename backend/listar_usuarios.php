<?php
require_once __DIR__ . "/conexao.php";

$sql = "SELECT * FROM usuario";
$resultado = $con->query($sql);

while($user = $resultado->fetch_assoc()){
    echo "e-mail: {$user["email"]} <br>";
    echo "nome: {$user["nome"]} <br>";
    echo "cod: {$user["id"]} <br>";
    echo "registro: {$user["criado"]} <br>";
    echo "<br>";
}
?>
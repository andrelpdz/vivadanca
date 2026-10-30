<?php
$local = "sql207.infinityfree.com";
$usuario = "if0_43064424";
$senha = "eqLAmYukYnfC";
$banco = "if0_43064424_pi_danca";

if(strpos($_SERVER['SERVER_NAME'],'localhost') !== false) {
    $local = "localhost";
    $usuario = "root";
    $senha = "";
    $banco = "pi_danca"; 
}

$con = new mysqli($local, $usuario, $senha, $banco);

if ($con->connect_error){
    die("Erro na conexão");
}

?>
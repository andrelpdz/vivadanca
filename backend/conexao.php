<?php
//$local = "sql102.infinityfree.com";
//$usuario = "if0_43466453";
//$senha = "GDgWWUQxYQ";
//$banco = "if0_43466453_vivadanca";

//if(strpos($_SERVER['SERVER_NAME'],'localhost') !== false) {
    $local = "localhost";
    $usuario = "root";
    $senha = "";
    $banco = "pi_danca"; 
//}

$con = new mysqli($local, $usuario, $senha, $banco);

if ($con->connect_error){
    die("Erro na conexão");
}

?>
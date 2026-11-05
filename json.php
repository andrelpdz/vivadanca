<?php
header("Content-Type: application/json; charset=utf-8");

$titulo = "SENAC";

$resposta = ["msg" => $titulo];

echo json_encode($resposta, JSON_UNESCAPED_UNICODE);
?>
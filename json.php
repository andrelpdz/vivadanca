<<<<<<< HEAD
<?php
=======
<?php 
>>>>>>> 68dbd040a00246639b9e1fd06d8c4dc604fcf4fd
header("Content-Type: application/json; charset=utf-8");

$titulo = "SENAC";

$resposta = ["msg" => $titulo];

echo json_encode($resposta, JSON_UNESCAPED_UNICODE);
?>
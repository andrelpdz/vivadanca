<?php
require_once __DIR__ . "/conexao.php";

if ($_SERVER['REQUEST_METHOD'] !== "POST"){
    header("location: /projetodanca/pages/cadastro_coreografia.html");
    exit;
}

$titulo = trim($_POST['titulo']);
$descricao = trim($_POST['descricao']);
$data_criacao = trim($_POST['data_criacao']);
$modalidade = trim($_POST['modalidade']);

try{
    $sql = "INSERT INTO coreografias(titulo, descricao, data_criacao, modalidade) 
    VALUES (?, ?, ?, ?)";
    $stmt = $con->prepare($sql);
    $stmt->bind_param("ssss", $titulo, $descricao, $data_criacao, $modalidade);
    $stmt->execute();
    $stmt->close();
    $con->close();
    echo "Cadastro realizado com sucesso";

}catch(Throwable $e){

    echo $e;
    exit;
}


?>
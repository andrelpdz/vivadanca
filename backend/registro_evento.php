<?php
require_once __DIR__ . "/conexao.php";

if ($_SERVER['REQUEST_METHOD'] !== "POST"){
    header("location: /projetodanca/pages/cadastro_evento.html");
    exit;
}

$nome = trim($_POST['nome']);
$descricao = trim($_POST['descricao']);
$data_inicio = trim($_POST['data_inicio']);
$data_termino = trim($_POST['data_termino']);
$cidade = trim($_POST['cidade']);
$local = trim($_POST['local']);
$premiacao = trim($_POST['premiacao']);

$data_inicio = DateTimeImmutable::createFromFormat("!Y-m-d\TH:i", $data_inicio)->format("Y-m-d H:i:s");
$data_termino = DateTimeImmutable::createFromFormat("!Y-m-d\TH:i", $data_termino)->format("Y-m-d H:i:s");

try{
    $sql = "INSERT INTO eventos(nome, descricao, data_inicio, data_termino, cidade, local, premiacao) 
    VALUES (?, ?, ?, ?, ?, ?, ?)";
    $stmt = $con->prepare($sql);
    $stmt->bind_param("sssssss", $nome, $descricao, 
        $data_inicio, 
        $data_termino,
        $cidade, $local, $premiacao);
    $stmt->execute();
    $stmt->close();
    $con->close();
    echo "Cadastro realizado com sucesso";

}catch(Throwable $e){

    echo $e;
    exit;
}





// echo VAR_DUMP($data_inicio); exit;
?>
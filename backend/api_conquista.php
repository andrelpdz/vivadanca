<?php
require_once __DIR__ . "/conquista.php";
require_once __DIR__ . "/foto.php";

$metodo = $_SERVER['REQUEST_METHOD'];
$status = true;
$resp = [];

function cadastrar(){
    $evento_id = trim($_POST['evento_id']);
    $coreografia_id = trim($_POST['coreografia_id']);
    $nome = trim($_POST['nome']);
    $descricao = trim($_POST['descricao']);
    $foto = $_FILES['foto'];
    
    try{
        $nome_foto = salvarFoto("conquistas", $foto);
        $resposta = cadastrarConquista($evento_id, $coreografia_id, $nome, $descricao, $nome_foto);
        if (!$resposta) throw new Exception("Erro ao cadastrar conquista");
        return "Cadastro Efetuado com sucesso";
    }catch(Throwable $e){
        throw $e;
    }
}

function atualizar(){
    $id = trim($_POST['id']);
    $evento_id = trim($_POST['evento_id']);
    $coreografia_id = trim($_POST['coreografia_id']);
    $nome = trim($_POST['nome']);
    $descricao = trim($_POST['descricao']);
    $foto = $_FILES['foto'];
    
    try{
        $nome_foto = salvarFoto("conquistas", $foto);
        $resposta = atualizarConquista($id, $evento_id, $coreografia_id, $nome, $descricao, $nome_foto);
        if (!$resposta) throw new Exception("Erro ao atualizar conquista");
        return "Atualizado com sucesso";
    }catch(Throwable $e){
        throw $e;
    }
}

function deletar(){
    $id = $_GET['id'] ?? 0;
    try{
        $item = obterConquista($id);
        excluirFoto("conquistas", $item["foto"]);
        excluirConquista($id);
        return true;
    }catch(Throwable $e){
        throw $e;
    }
}

try{
    if ($metodo == "GET"){
        $resp = ["conquistas" => listarConquistas()];
    }
    else if ($metodo == "POST"){
        if($_POST['btnEnviar'] == "Cadastrar") cadastrar();
        else if($_POST['btnEnviar'] == "Atualizar") atualizar();
        header("location: ../admin/conquistas.html");
        exit;
    }
    else if ($metodo == "DELETE"){
        deletar();
    }
    else{
        throw new Exception("Metodo invalido!");
    }
}catch(Throwable $e){
    http_response_code(500);
    $status = false;
    $resp = ["erro" => $e->getMessage()];
}
finally{
    header("Content-Type: application/json; charset=utf-8");
    echo json_encode( ["sucesso"=> $status] + $resp );
}
?>
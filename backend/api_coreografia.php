<?php
require_once __DIR__ . "/coreografia.php";

$metodo = $_SERVER['REQUEST_METHOD'];
$status = true;
$resp = [];

function cadastrar(){
    $titulo = trim($_POST['titulo']);
    $descricao = trim($_POST['descricao']);
    $data_criacao = trim($_POST['data_criacao']);
    $modalidade = trim($_POST['modalidade']);
    
    try{
        $resposta = cadastrarCoreografia($titulo, $descricao, $data_criacao, $modalidade);
        if (!$resposta) throw new Exception("Erro ao cadastrar coreografia");
        return "Cadastro Efetuado com sucesso";
    }catch(Throwable $e){
        throw $e;
    }
}

function atualizar(){
    $id = trim($_POST['id']);
    $titulo = trim($_POST['titulo']);
    $descricao = trim($_POST['descricao']);
    $data_criacao = trim($_POST['data_criacao']);
    $modalidade = trim($_POST['modalidade']);
    
    try{
        $resposta = atualizarCoreografia($id, $titulo, $descricao, $data_criacao, $modalidade);
        if (!$resposta) throw new Exception("Erro ao atualizar coreografia");
        return "Atualizado com sucesso";
    }catch(Throwable $e){
        throw $e;
    }
}

function deletar(){
    $id = $_GET['id'] ?? 0;
    try{
        excluirCoreografia($id);
        return true;
    }catch(Throwable $e){
        throw $e;
    }
}

try{
    if ($metodo == "GET"){
        $resp = ["coreografias" => listarCoreografias()];
    }
    else if ($metodo == "POST"){
        if($_POST['btnEnviar'] == "Cadastrar") cadastrar();
        else if($_POST['btnEnviar'] == "Atualizar") atualizar();
        header("location: ../admin/coreografias.html");
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
<?php
require_once __DIR__ . "/evento.php";

$metodo = $_SERVER['REQUEST_METHOD'];
$status = true;
$resp = [];

#-> Responsável pelo cadastro
function cadastrar(){
    $nome = trim($_POST['nome']);
    $descricao = trim($_POST['descricao']);
    $data_inicio = trim($_POST['data_inicio']);
    $data_termino = trim($_POST['data_termino']);
    $cidade = trim($_POST['cidade']);
    $local = trim($_POST['local']);
    $premiacao = trim($_POST['premiacao']);
    
    try{
        $resposta = cadastrarEvento($nome, $descricao, $data_inicio, $data_termino, $cidade, $local, $premiacao);
        if (!$resposta){
            throw new Exception("Erro ao cadastrar o evento");
        }
        return "Cadastro Efetuado com sucesso";
    }catch(Throwable $e){
        throw $e;
    }
}

function atualizar(){
    $id = trim($_POST['id']);
    $nome = trim($_POST['nome']);
    $descricao = trim($_POST['descricao']);
    $data_inicio = trim($_POST['data_inicio']);
    $data_termino = trim($_POST['data_termino']);
    $cidade = trim($_POST['cidade']);
    $local = trim($_POST['local']);
    $premiacao = trim($_POST['premiacao']);
    
    try{
        $resposta = atualizarEvento($id, $nome, $descricao, $data_inicio, $data_termino, $cidade, $local, $premiacao);
        if (!$resposta){
            throw new Exception("Erro ao atualizar o evento");
        }
        return "Atualizado com sucesso";
    }catch(Throwable $e){
        throw $e;
    }
}

#-> Exclui o Item no Banco
function deletar(){
    $id = $_GET['id'] ?? 0;
    try{
        excluirEvento($id);
        return true;
    }catch(Throwable $e){
        throw $e;
    }
}

#-> Executado ao Carregar Arquivo
try{
    if ($metodo == "GET"){
        $resp = ["eventos" => listarEventos()];
    }
    else if ($metodo == "POST"){
        if($_POST['btnEnviar'] == "Cadastrar"){
            cadastrar();
        }else if($_POST['btnEnviar'] == "Atualizar"){
            atualizar();
        }
        header("location: ../admin/eventos.html");
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
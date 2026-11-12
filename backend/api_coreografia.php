<?php
require_once __DIR__ . "/coreografia.php";

$metodo = $_SERVER['REQUEST_METHOD'];
$status = true;
$resp = [];


function cadastrar(){
    $titulo = trim($_POST['titulo']) ?? "";
    $descricao = trim($_POST['descricao']) ?? "";
    $data_criacao = $_POST["data_criacao"] ?? "";
    $modalidade = trim($_POST["modalidade"]) ?? "";
    $dancarinos = empty(trim($_POST["listaIntegrantes"])) ? [] : explode("," , $_POST["listaIntegrantes"]);

    try{
        $resposta = cadastrarCoreografia($titulo, $descricao, $data_criacao, $modalidade, $dancarinos);
        if (!$resposta){
            throw new Exception("Erro ao cadastrar a coreografia");
        }
        return "Cadastro Efetuado com sucesso";
    }catch(throwable $e){
        throw $e;
    }
}

function atualizar(){
    $id = trim($_POST['id']);
    $titulo = trim($_POST['titulo']) ?? "";
    $descricao = trim($_POST['descricao']) ?? "";
    $data_criacao = $_POST["data_criacao"] ?? "";
    $modalidade = trim($_POST["modalidade"]) ?? "";
    $dancarinos = empty(trim($_POST["listaIntegrantes"])) ? [] : explode("," , $_POST["listaIntegrantes"]);

    try{
        $resposta = atualizarCoreografia($id, $titulo, $descricao, $data_criacao, $modalidade, $dancarinos);
        if (!$resposta){
            throw new Exception("Erro ao atualizar a coreografia");
        }
        return "Atualizado com sucesso";
    }catch(throwable $e){
        throw $e;
    }
}

function deletar(){
    $id = $_GET['id'] ?? 0;
    try{
        excluirCoreografia($id);
        return true;
    }catch(throwable $e){
        throw $e;
    }
}


try{
    if ($metodo == "GET"){
        $id = isset($_GET['id']) ? $_GET['id'] : null;
        if ($id){
            $resp = ["coreografia" => obterCoreografia($id)];
        }else{
            $resp = ["coreografias" => listarCoreografias()];
        }
    }
    else if ($metodo == "POST"){
        if ($_POST["tipo"] == "PUT"){
            atualizar();
        }else{
            cadastrar();
        }
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
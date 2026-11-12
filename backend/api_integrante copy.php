<?php
require_once __DIR__ . "/integrante.php";
require_once __DIR__ . "/foto.php";


$metodo = $_SERVER['REQUEST_METHOD'];
$status = true;
$resp = [];


function cadastrar(){
    $nome = trim($_POST['nome']);
    $descricao = trim($_POST['descricao']);
    $ativo = isset($_POST['ativo']) ? 1 : 0 ;
    $foto = $_FILES['foto'];
    try{
        $nome_foto = salvarFoto("integrantes", $foto);
        $resposta = cadastrarIntegrante($nome, $descricao, $nome_foto, $ativo);
        if (!$resposta){
            throw new Exception("Erro ao cadastrar o integrante");
        }
        return "Cadastro Efetuado com sucesso";
    }catch(throwable $e){
        throw $e;
    }
}

function atualizar(){
    $id = trim($_POST['id']);
    $nome = trim($_POST['nome']);
    $descricao = trim($_POST['descricao']);
    $ativo = isset($_POST['ativo']) ? 1 : 0 ;
    $foto = $_FILES['foto'];
    try{
        $integrante = obterIntegrante($id);
        $nome_foto = $integrante["foto"];
        try{
            $nome_foto = salvarFoto("integrantes", $foto);
            excluirFoto("integrantes", $integrante["foto"]);
        }catch(throwable $e){}

        $resposta = atualizarIntegrante($id, $nome, $descricao, $nome_foto, $ativo);
        if (!$resposta){
            throw new Exception("Erro ao atualizar o integrante");
        }
        return "Atualizado com sucesso";
    }catch(throwable $e){
        throw $e;
    }
}

function deletar(){
    $id = $_GET['id'] ?? 0;
    try{
        $integrante = obterIntegrante($id);
        excluirFoto("integrantes", $integrante["foto"]);
        excluirIntegrante($id);
        return true;

    }catch(throwable $e){
        throw $e;
    }
}




try{
    if ($metodo == "GET"){
        $id = isset($_GET['id']) ? $_GET['id'] : null;
        if ($id){
            $resp = ["integrante" => obterIntegrante($id)];
        }else{
            $resp = ["integrantes" => listarIntegrantes()];
        }
    }
    else if ($metodo == "POST"){
        if ($_POST["tipo"] == "PUT"){
            atualizar();
        }else{
            cadastrar();
        }
        header("location: ../admin/integrantes.html");
        exit;
    }
    // else if ($metodo == "PUT"){
    //     header("location: ../admin/integrantes.html");
    //     exit;
    // }
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
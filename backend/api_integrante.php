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
    // verificar a foto na atualização, precisa confirmar se tem foto ou nao
    // se nao tem a foto no formulario, então nao precisa mudar a foto
    // mudifique o metodo de atualizar para deixar a foto como OPCIONAL
    $id = trim($_POST['id']);
    $nome = trim($_POST['nome']);
    $descricao = trim($_POST['descricao']);
    $ativo = isset($_POST['ativo']) ? 1 : 0 ;
    $foto = $_FILES['foto'];
    try{
        $nome_foto = salvarFoto("integrantes", $foto);
        $resposta = atualizarIntegrante($nome, $descricao, $nome_foto, $ativo);
        if (!$resposta){
            throw new Exception("Erro ao atualizar o integrante");
        }
        return "Atualizado com sucesso";
    }catch(throwable $e){
        throw $e;
    }
}



try{
    if ($metodo == "GET"){
        // listar os integrantes
        $resp = ["integrantes" => listarIntegrantes()];
    }
    else if ($metodo == "POST"){
        cadastrar();
        header("location: ../admin/integrantes.html");
        exit;
    }
    else if ($metodo == "PUT"){
        // atualização integrante
        header("location: ../admin/integrantes.html");
        exit;
    }
    else if ($metodo == "DELETE"){
        // excluir integrante
        echo "DELETE";
        exit;
        // $id = trim($_POST['id']);
        // $resposta = excluirIntegrante($id);
        // header("location: ../admin/integrantes.html");
        // exit;
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
<?php
require_once __DIR__ . "/galeria.php";
require_once __DIR__ . "/foto.php";

$metodo = $_SERVER['REQUEST_METHOD'];
$status = true;
$resp = [];

function cadastrar(){
    $descricao = trim($_POST['descricao']);
    $foto = $_FILES['foto'];
    try{
        $nome_foto = salvarFoto("galeria", $foto);
        $resposta = cadastrarGaleria($nome_foto, $descricao);
        if (!$resposta) throw new Exception("Erro ao cadastrar foto na galeria");
        return "Cadastro Efetuado com sucesso";
    }catch(Throwable $e){
        throw $e;
    }
}

function atualizar(){
    $id = trim($_POST['id']);
    $descricao = trim($_POST['descricao']);
    $foto = $_FILES['foto'] ?? null;
    try{
        $atual = obterGaleria($id);
        if (!$atual) throw new Exception('Registro não encontrado.');
        $nome_foto = $atual['foto'];
        if ($foto && $foto['error'] !== UPLOAD_ERR_NO_FILE) {
            $nome_foto = salvarFoto('galeria', $foto);
        }
        $resposta = atualizarGaleria($id, $nome_foto, $descricao);
        if (!$resposta) throw new Exception("Erro ao atualizar galeria");
        return "Atualizado com sucesso";
    }catch(Throwable $e){
        throw $e;
    }
}

function deletar(){
    $id = $_GET['id'] ?? 0;
    try{
        $item = obterGaleria($id);
        excluirFoto("galeria", $item["foto"]);
        excluirGaleria($id);
        return true;
    }catch(Throwable $e){
        throw $e;
    }
}

try{
    if ($metodo == "GET"){
        $resp = ["galeria" => listarGaleria()];
    }
    else if ($metodo == "POST"){
        if($_POST['btnEnviar'] == "Cadastrar") cadastrar();
        else if($_POST['btnEnviar'] == "Atualizar") atualizar();
        header("location: ../admin/galeria.html");
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
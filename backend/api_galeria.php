<?php
require_once __DIR__ . "/galeria.php";
require_once __DIR__ . "/foto.php";

$metodo = $_SERVER['REQUEST_METHOD'];
$status = true;
$resp = [];

function validarDataFoto($data){
    if ($data === '' || $data === null) return null;
    if (!is_string($data) || !preg_match('/^([1-9][0-9]{3})-([0-9]{2})-([0-9]{2})$/D', $data, $partes)
        || !checkdate((int) $partes[2], (int) $partes[3], (int) $partes[1])) {
        throw new InvalidArgumentException('Informe uma data válida para a foto.');
    }
    return $data;
}

function cadastrar(){
    $dataFoto = validarDataFoto($_POST['data_foto'] ?? null);
    $descricao = trim($_POST['descricao']);
    $foto = $_FILES['foto'];
    try{
        $nome_foto = salvarFoto("galeria", $foto);
        $resposta = cadastrarGaleria($nome_foto, $descricao, $dataFoto);
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
        $dataFoto = validarDataFoto($_POST['data_foto'] ?? ($atual['data_foto'] ?? null));
        $nome_foto = $atual['foto'];
        if ($foto && $foto['error'] !== UPLOAD_ERR_NO_FILE) {
            $nome_foto = salvarFoto('galeria', $foto);
        }
        $resposta = atualizarGaleria($id, $nome_foto, $descricao, $dataFoto);
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
    http_response_code($e instanceof InvalidArgumentException ? 422 : 500);
    $status = false;
    $resp = ["erro" => $e->getMessage()];
}
finally{
    header("Content-Type: application/json; charset=utf-8");
    echo json_encode( ["sucesso"=> $status] + $resp );
}
?>
<?php
require_once __DIR__ . "/linha_tempo.php";
require_once __DIR__ . "/foto.php";

$metodo = $_SERVER['REQUEST_METHOD'];
$status = true;
$resp = [];

function cadastrar(){
    $descricao = trim($_POST['descricao']);
    $data = intval($_POST['data']); // Tratado como inteiro (ano)
    $foto = $_FILES['foto'];
    try{
        $nome_foto = salvarFoto("linha_tempo", $foto);
        $resposta = cadastrarLinhaTempo($nome_foto, $descricao, $data);
        if (!$resposta) throw new Exception("Erro ao cadastrar item na linha do tempo");
        return "Cadastro Efetuado com sucesso";
    }catch(Throwable $e){
        throw $e;
    }
}

function atualizar(){
    $id = trim($_POST['id']);
    $descricao = trim($_POST['descricao']);
    $data = intval($_POST['data']); // Tratado como inteiro (ano)
    $foto = $_FILES['foto'];
    try{
        // Verifica se veio uma nova foto ou se mantém a antiga
        if ($foto['error'] === UPLOAD_ERR_OK) {
            $itemAntigo = obterLinhaTempo($id);
            excluirFoto("linha_tempo", $itemAntigo["foto"]);
            $nome_foto = salvarFoto("linha_tempo", $foto);
        } else {
            $itemAntigo = obterLinhaTempo($id);
            $nome_foto = $itemAntigo["foto"];
        }

        $resposta = atualizarLinhaTempo($id, $nome_foto, $descricao, $data);
        if (!$resposta) throw new Exception("Erro ao atualizar linha do tempo");
        return "Atualizado com sucesso";
    }catch(Throwable $e){
        throw $e;
    }
}

function deletar(){
    $id = $_GET['id'] ?? 0;
    try{
        $item = obterLinhaTempo($id);
        if ($item) {
            excluirFoto("linha_tempo", $item["foto"]);
            excluirLinhaTempo($id);
        }
        return true;
    }catch(Throwable $e){
        throw $e;
    }
}

try{
    if ($metodo == "GET"){
        $resp = ["linha_tempo" => listarLinhasTempo()];
    }
    else if ($metodo == "POST"){
        if($_POST['btnEnviar'] == "Cadastrar") cadastrar();
        else if($_POST['btnEnviar'] == "Atualizar") atualizar();
        header("location: ../admin/linha_tempo.html");
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
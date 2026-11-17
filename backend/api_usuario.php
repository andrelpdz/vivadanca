<?php
require_once __DIR__ . "/usuario.php";

$metodo = $_SERVER['REQUEST_METHOD'];
$status = true;
$resp = [];

function cadastrar(){
    $nome = trim($_POST['nome']);
    $email = trim($_POST['email']);
    $senha = $_POST['senha'];
    $confirmarSenha = $_POST['confirmarSenha'] ?? '';
    $tipo_usuario = trim($_POST['tipo_usuario'] ?? 'editor');
    
    // Trata as permissões que vêm como array de checkboxes do HTML
    $permissoes_arr = $_POST['permissoes'] ?? [];
    $permissoes = is_array($permissoes_arr) ? implode(", ", $permissoes_arr) : $permissoes_arr;

    try{
        if (strlen($senha) < 8) {
            throw new Exception("A senha deve ter pelo menos 8 caracteres.");
        }
        if (!empty($senha) && $senha !== $confirmarSenha) {
            throw new Exception("As senhas não coincidem!");
        }

        $resposta = cadastrarUsuario($nome, $email, $senha, $tipo_usuario, $permissoes);
        if (!$resposta){
            throw new Exception("Erro ao cadastrar o usuário (E-mail já pode estar cadastrado)");
        }
        return "Cadastro efetuado com sucesso";
    }catch(Throwable $e){
        throw $e;
    }
}

function atualizar(){
    $id = trim($_POST['idUsuario']);
    $nome = trim($_POST['nome']);
    $email = trim($_POST['email']);
    $senha = $_POST['senha'] ?? '';
    $tipo_usuario = trim($_POST['tipo_usuario'] ?? 'editor');
    
    $permissoes_arr = $_POST['permissoes'] ?? [];
    $permissoes = is_array($permissoes_arr) ? implode(", ", $permissoes_arr) : $permissoes_arr;

    try{
        $resposta = atualizarUsuario($id, $nome, $email, $senha, $tipo_usuario, $permissoes);
        if (!$resposta){
            throw new Exception("Erro ao atualizar o usuário");
        }
        return "Atualizado com sucesso";
    }catch(Throwable $e){
        throw $e;
    }
}

function deletar(){
    $id = $_GET['id'] ?? 0;
    try{
        $resposta = excluirUsuario($id);
        if (!$resposta){
            throw new Exception("Erro ao excluir usuário");
        }
        return true;
    }catch(Throwable $e){
        throw $e;
    }
}

try{
    if ($metodo == "GET"){
        $resp = ["usuarios" => listarUsuarios()];
    }
    else if ($metodo == "POST"){
        // Verifica se é edição (id preenchido) ou cadastro
        $idUsuario = $_POST['idUsuario'] ?? '';
        if(!empty($idUsuario)){
            atualizar();
        } else {
            cadastrar();
        }
        $resp = ["mensagem" => "Usuário salvo com sucesso."];
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

<?php
require_once __DIR__ . "/conexao.php";

function cadastrarUsuario($nome, $email, $senha, $tipo_usuario, $permissoes){
    global $con;
    try{
        $senha_cripto = password_hash($senha, PASSWORD_DEFAULT);
        $sql = "INSERT INTO usuario(nome, email, senha, tipo_usuario, permissoes) VALUES (?, ?, ?, ?, ?)";
        $stmt = $con->prepare($sql);
        $stmt->bind_param("sssss", $nome, $email, $senha_cripto, $tipo_usuario, $permissoes);
        $stmt->execute();
        $stmt->close();
        return true;
    }catch(Throwable $e){
        return false;
    }
}

function listarUsuarios(){
    global $con;
    $sql = "SELECT id, nome, email, tipo_usuario, permissoes, criado FROM usuario";
    $resultado = $con->query($sql);
    return $resultado->fetch_all(MYSQLI_ASSOC);
}

function obterUsuario($id){
    global $con;
    $sql = "SELECT id, nome, email, tipo_usuario, permissoes FROM usuario WHERE id=?";
    $stmt = $con->prepare($sql);
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $usuario = $stmt->get_result()->fetch_assoc();
    $stmt->close();
    return $usuario ? $usuario : null;
}

function atualizarUsuario($id, $nome, $email, $senha, $tipo_usuario, $permissoes){
    global $con;
    try {
        if(!empty($senha)){
            $senha_cripto = password_hash($senha, PASSWORD_DEFAULT);
            $sql = "UPDATE usuario SET nome = ?, email = ?, senha = ?, tipo_usuario = ?, permissoes = ? WHERE id = ?";
            $stmt = $con->prepare($sql);
            $stmt->bind_param("sssssi", $nome, $email, $senha_cripto, $tipo_usuario, $permissoes, $id);
        } else {
            // Atualiza sem alterar a senha caso o campo venha em branco
            $sql = "UPDATE usuario SET nome = ?, email = ?, tipo_usuario = ?, permissoes = ? WHERE id = ?";
            $stmt = $con->prepare($sql);
            $stmt->bind_param("ssssi", $nome, $email, $tipo_usuario, $permissoes, $id);
        }
        $resultado = $stmt->execute();
        $stmt->close();
        return $resultado;
    } catch(Throwable $e) {
        return false;
    }
}

function excluirUsuario($id){
    global $con;
    $sql = "DELETE FROM usuario WHERE id=?";
    $stmt = $con->prepare($sql);
    $stmt->bind_param("i", $id);
    $resultado = $stmt->execute();
    $stmt->close();
    return $resultado;
}
?>
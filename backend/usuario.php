<?php
require_once __DIR__ . "/conexao.php";

function cadastrarUsuario($nome, $email, $senha, $tipo_usuario, $permissoes){
    global $con;
    try{
        $senha_cripto = password_hash($senha, PASSWORD_DEFAULT);
        $sql = "INSERT INTO usuario(nome, email, senha) VALUES (?, ?, ?)";
        $stmt = $con->prepare($sql);
        $stmt->bind_param("sss", $nome, $email, $senha_cripto);
        $stmt->execute();
        $stmt->close();
        return true;
    }catch(Throwable $e){
        return false;
    }
}

function listarUsuarios(){
    global $con;
    $sql = "SELECT id, nome, email, criado FROM usuario";
    $resultado = $con->query($sql);
    return $resultado->fetch_all(MYSQLI_ASSOC);
}

function obterUsuario($id){
    global $con;
    $sql = "SELECT id, nome, email FROM usuario WHERE id=?";
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
            $sql = "UPDATE usuario SET nome = ?, email = ?, senha = ? WHERE id = ?";
            $stmt = $con->prepare($sql);
            $stmt->bind_param("sssi", $nome, $email, $senha_cripto, $id);
        } else {
            // Atualiza sem alterar a senha caso o campo venha em branco
            $sql = "UPDATE usuario SET nome = ?, email = ? WHERE id = ?";
            $stmt = $con->prepare($sql);
            $stmt->bind_param("ssi", $nome, $email, $id);
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

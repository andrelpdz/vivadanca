<?php
#-> Cadastro de Usuário
require_once __DIR__ . "/conexao.php";

if ($_SERVER['REQUEST_METHOD'] === 'POST'){
    $nome = trim( $_POST['nome'] );
    $email = trim( $_POST['email'] );
    $senha = trim( $_POST['senha'] );

    if (empty($nome) || empty($email) || empty($senha)){
        echo "Campos obrigatórios";
        exit;
    }

    $senha_hash = password_hash($senha, PASSWORD_BCRYPT); // criptografando a senha

    $sql = "INSERT INTO usuario(nome, email, senha) VALUES (?, ?, ?)";
    $stmt = $con->prepare($sql);
    $stmt->bind_param("sss",$nome, $email, $senha_hash);

    $stmt->execute();
    $stmt->close();
    $con->close();
    echo "Usuario cadastrado com sucesso!";
}
?>
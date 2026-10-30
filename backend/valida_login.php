<?php
#-> Valida usuário
session_start();

require_once __DIR__ . "/conexao.php";

if ($_SERVER['REQUEST_METHOD'] === 'POST'){
    $email = trim( $_POST['email'] );
    $senha = trim( $_POST['senha'] );

    if (empty($email) || empty($senha)){
        echo "Campos obrigatórios";
        exit;
    }
    
    $sql = "SELECT * FROM usuario WHERE email = ?";
    $stmt = $con->prepare($sql);
    $stmt->bind_param("s",$email);

    $stmt->execute(); //-> Executa Comando SQL

    $resultado = $stmt->get_result(); //-> Extrai resultado da consulta

    if($resultado->num_rows == 1){
        $usuario = $resultado->fetch_assoc(); //-> Salva os dados do banco em usuario
        if(password_verify($senha, $usuario['senha'])){ //-> Verifica os Hashs
           $_SESSION['email'] = $usuario['email'];
           $_SESSION['nome'] = $usuario['nome'];

           header("location: /projetodanca");
        }else{
           echo "Senha Incorreta!"; 
        }
    }else{
        echo "Usuario não encontrado!";
    }




    $stmt->close();
    $con->close();
}
?>
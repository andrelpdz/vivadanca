<?php
require_once __DIR__ . "/conexao.php";


function cadastrarIntegrante($nome, $descricao, $nome_foto, $ativo){
    global $con;
    try{
        $sql = "INSERT INTO integrantes(nome, descricao, foto, ativo) VALUES (?, ?, ?, ?)";
        $stmt = $con->prepare($sql);
        $stmt->bind_param("sssi", $nome, $descricao, $nome_foto, $ativo);
        $stmt->execute();
        $stmt->close();
        $con->close();
        return true;
    }catch(Throwable $e){
        return false;
    }
}

function listarIntegrantes(){
    global $con;
    $sql = "SELECT * FROM integrantes";
    $resultado = $con->query($sql);
    return $resultado->fetch_all(MYSQLI_ASSOC);
}

function obterIntegrante($id){
    global $con;
    $sql = "SELECT * FROM integrantes WHERE id=?";
    $stmt = $con->prepare($sql);
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $resultado = $stmt->get_result();
    $integrante = $resultado->fetch_assoc();
    $stmt->close();
    if(!$integrante){
        return null;
    }
    return $integrante;
}

function atualizarIntegrante($id, $nome, $descricao, $nome_foto, $ativo){
    global $con;
    $sql = "UPDATE integrantes SET
        nome = ?, descricao = ?, foto = ?, ativo = ?
        WHERE id = ?";
    $stmt = $con->prepare($sql);
    $stmt->bind_param("sssii", $nome, $descricao, $nome_foto, $ativo, $id);
    $resultado = $stmt->execute();
    $stmt->close();
    return $resultado;
}

function excluirIntegrante($id){
    global $con;
    $sql = "DELETE FROM integrantes WHERE id=?";
    $stmt = $con->prepare($sql);
    $stmt->bind_param("i", $id);
    $resultado = $stmt->execute();
    $stmt->close();
    return $resultado;
}




?>
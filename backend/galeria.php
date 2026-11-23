<?php
require_once __DIR__ . "/conexao.php";
require_once __DIR__ . "/foto.php";

function cadastrarGaleria($foto, $nome, $descricao, $dataFoto){
    global $con;
    try{
        $sql = "INSERT INTO galeria(foto, nome, descricao, data) VALUES (?, ?, ?, ?)";
        $stmt = $con->prepare($sql);
        $stmt->bind_param("ssss", $foto, $nome, $descricao, $dataFoto);
        $stmt->execute();
        $stmt->close();
        return true;
    }catch(Throwable $e){
        return false;
    }
}

function listarGaleria(){
    global $con;
    $sql = "SELECT * FROM galeria";
    $resultado = $con->query($sql);
    return $resultado->fetch_all(MYSQLI_ASSOC);
}

function obterGaleria($id){
    global $con;
    $sql = "SELECT * FROM galeria WHERE id=?";
    $stmt = $con->prepare($sql);
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $resultado = $stmt->get_result();
    return $resultado->fetch_assoc();
}

function atualizarGaleria($id, $foto, $nome, $descricao, $dataFoto){
    global $con;
    $sql = "UPDATE galeria SET foto = ?, nome = ?, descricao = ?, data = ? WHERE id = ?";
    $stmt = $con->prepare($sql);
    $stmt->bind_param("ssssi", $foto, $nome, $descricao, $dataFoto, $id);
    $resultado = $stmt->execute();
    $stmt->close();
    return $resultado;
}

function excluirGaleria($id){
    global $con;
    $sql = "DELETE FROM galeria WHERE id=?";
    $stmt = $con->prepare($sql);
    $stmt->bind_param("i", $id);
    $resultado = $stmt->execute();
    $stmt->close();
    return $resultado;
}
?>
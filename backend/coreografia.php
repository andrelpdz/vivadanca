<?php
require_once __DIR__ . "/conexao.php";

function cadastrarCoreografia($titulo, $descricao, $data_criacao, $modalidade){
    global $con;
    try{
        $sql = "INSERT INTO coreografias(titulo, descricao, data_criacao, modalidade) VALUES (?, ?, ?, ?)";
        $stmt = $con->prepare($sql);
        $stmt->bind_param("ssss", $titulo, $descricao, $data_criacao, $modalidade);
        $stmt->execute();
        $stmt->close();
        return true;
    }catch(Throwable $e){
        return false;
    }
}

function listarCoreografias(){
    global $con;
    $sql = "SELECT * FROM coreografias";
    $resultado = $con->query($sql);
    return $resultado->fetch_all(MYSQLI_ASSOC);
}

function atualizarCoreografia($id, $titulo, $descricao, $data_criacao, $modalidade){
    global $con;
    $sql = "UPDATE coreografias SET titulo = ?, descricao = ?, data_criacao = ?, modalidade = ? WHERE id = ?";
    $stmt = $con->prepare($sql);
    $stmt->bind_param("ssssi", $titulo, $descricao, $data_criacao, $modalidade, $id);
    $resultado = $stmt->execute();
    $stmt->close();
    return $resultado;
}

function excluirCoreografia($id){
    global $con;
    $sql = "DELETE FROM coreografias WHERE id=?";
    $stmt = $con->prepare($sql);
    $stmt->bind_param("i", $id);
    $resultado = $stmt->execute();
    $stmt->close();
    return $resultado;
}
?>
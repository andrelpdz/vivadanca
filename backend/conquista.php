<?php
require_once __DIR__ . "/conexao.php";

function cadastrarConquista($nome, $descricao, $foto, $evento_id, $coreografia_id){
    global $con;
    $sql = "INSERT INTO conquistas
        (nome, descricao, foto, evento_id, coreografia_id)
        VALUES (?, ?, ?, ?, ?)";
    $stmt = $con->prepare($sql);
    $stmt->bind_param("sssii", $nome, $descricao, $foto, $evento_id, $coreografia_id);
    $stmt->execute();
    $stmt->close();
    return true;
} 

function listarConquistas(){
    global $con;
    $sql = "SELECT * FROM conquistas";
    $resultado = $con->query($sql);
    return $resultado->fetch_all(MYSQLI_ASSOC);
}

function obterConquista($id){
    global $con;
    $sql = "SELECT * FROM conquistas WHERE id = ?";
    $stmt = $con->prepare($sql);
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $resultado = $stmt->get_result();
    $stmt->close();
    $conquista = $resultado->fetch_assoc();
    if(!$conquista){
        return null;
    }
    return $conquista;
}

function atualizarConquista($id, $nome, $descricao, $foto, $evento_id, $coreografia_id){
    global $con;
    $con->begin_transaction();
    try{
        $sql = "UPDATE conquistas SET
            nome = ?, descricao = ?, foto = ?, evento_id = ?, coreografia_id = ?
            WHERE id = ?";
        $stmt = $con->prepare($sql);
        $stmt->bind_param(
            "sssiii", 
            $nome, $descricao, $foto, $evento_id, $coreografia_id, $id
        );
        $stmt->execute();
        $stmt->close();
        $con->commit();
        return true;

    }catch(throwable $e){
        $con->rollback();
        throw $e;
    }
}

function excluirConquista($id){
    global $con;
    $sql = "DELETE FROM conquistas WHERE id = ?";
    $stmt = $con->prepare($sql);
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $stmt->close();
    return true;
}


?>
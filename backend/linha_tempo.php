<?php
require_once __DIR__ . "/conexao.php";

function cadastrarLinhaTempo($foto, $descricao, $data){
    global $con;
    try{
        $sql = "INSERT INTO linha_tempo(foto, descricao, data) VALUES (?, ?, ?)";
        $stmt = $con->prepare($sql);
        $stmt->bind_param("sss", $foto, $descricao, $data);
        $stmt->execute();
        $stmt->close();
        return true;
    }catch(Throwable $e){
        return false;
    }
}

function listarLinhasTempo(){
    global $con;
    $sql = "SELECT * FROM linha_tempo ORDER BY data DESC";
    $resultado = $con->query($sql);
    return $resultado->fetch_all(MYSQLI_ASSOC);
}

function obterLinhaTempo($id){
    global $con;
    $sql = "SELECT * FROM linha_tempo WHERE id=?";
    $stmt = $con->prepare($sql);
    $stmt->bind_param("i", $id);
    $stmt->execute();
    return $stmt->get_result()->fetch_assoc();
}

function atualizarLinhaTempo($id, $foto, $descricao, $data){
    global $con;
    $sql = "UPDATE linha_tempo SET foto = ?, descricao = ?, data = ? WHERE id = ?";
    $stmt = $con->prepare($sql);
    $stmt->bind_param("sssi", $foto, $descricao, $data, $id);
    $resultado = $stmt->execute();
    $stmt->close();
    return $resultado;
}

function excluirLinhaTempo($id){
    global $con;
    $sql = "DELETE FROM linha_tempo WHERE id=?";
    $stmt = $con->prepare($sql);
    $stmt->bind_param("i", $id);
    $resultado = $stmt->execute();
    $stmt->close();
    return $resultado;
}
?>
<?php
require_once __DIR__ . "/conexao.php";

function cadastrarEvento($nome, $descricao, $data_inicio, $data_termino, $cidade, $local, $premiacao){
    global $con;
    try{
        $sql = "INSERT INTO eventos(nome, descricao, data_inicio, data_termino, cidade, local, premiacao) VALUES (?, ?, ?, ?, ?, ?, ?)";
        $stmt = $con->prepare($sql);
        $stmt->bind_param("sssssss", $nome, $descricao, $data_inicio, $data_termino, $cidade, $local, $premiacao);
        $stmt->execute();
        $stmt->close();
        return true;
    }catch(Throwable $e){
        return false;
    }
}

function listarEventos(){
    global $con;
    $sql = "SELECT * FROM eventos";
    $resultado = $con->query($sql);
    return $resultado->fetch_all(MYSQLI_ASSOC);
}

function obterEvento($id){
    global $con;
    $sql = "SELECT * FROM eventos WHERE id=?";
    $stmt = $con->prepare($sql);
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $resultado = $stmt->get_result();
    $evento = $resultado->fetch_assoc();
    $stmt->close();
    return $evento ? $evento : null;
}

function atualizarEvento($id, $nome, $descricao, $data_inicio, $data_termino, $cidade, $local, $premiacao){
    global $con;
    $sql = "UPDATE eventos SET nome = ?, descricao = ?, data_inicio = ?, data_termino = ?, cidade = ?, local = ?, premiacao = ? WHERE id = ?";
    $stmt = $con->prepare($sql);
    $stmt->bind_param("sssssssi", $nome, $descricao, $data_inicio, $data_termino, $cidade, $local, $premiacao, $id);
    $resultado = $stmt->execute();
    $stmt->close();
    return $resultado;
}

function excluirEvento($id){
    global $con;
    $sql = "DELETE FROM eventos WHERE id=?";
    $stmt = $con->prepare($sql);
    $stmt->bind_param("i", $id);
    $resultado = $stmt->execute();
    $stmt->close();
    return $resultado;
}
?>
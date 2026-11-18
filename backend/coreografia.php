<?php
require_once __DIR__ . '/conexao.php';

function cadastrarCoreografia($titulo, $descricao, $data_criacao, $modalidade, $foto = null) {
    global $con;
    $stmt = $con->prepare('INSERT INTO coreografias (titulo, descricao, data_criacao, modalidade, foto) VALUES (?, ?, ?, ?, ?)');
    $stmt->bind_param('sssss', $titulo, $descricao, $data_criacao, $modalidade, $foto);
    $ok = $stmt->execute();
    $stmt->close();
    return $ok;
}

function listarCoreografias() {
    global $con;
    return $con->query('SELECT * FROM coreografias ORDER BY data_criacao DESC, id DESC')->fetch_all(MYSQLI_ASSOC);
}

function obterCoreografia($id) {
    global $con;
    $stmt = $con->prepare('SELECT * FROM coreografias WHERE id = ?');
    $stmt->bind_param('i', $id);
    $stmt->execute();
    return $stmt->get_result()->fetch_assoc();
}

function atualizarCoreografia($id, $titulo, $descricao, $data_criacao, $modalidade, $foto = null) {
    global $con;
    $stmt = $con->prepare('UPDATE coreografias SET titulo = ?, descricao = ?, data_criacao = ?, modalidade = ?, foto = ? WHERE id = ?');
    $stmt->bind_param('sssssi', $titulo, $descricao, $data_criacao, $modalidade, $foto, $id);
    $ok = $stmt->execute();
    $stmt->close();
    return $ok;
}

function excluirCoreografia($id) {
    global $con;
    $stmt = $con->prepare('DELETE FROM coreografias WHERE id = ?');
    $stmt->bind_param('i', $id);
    return $stmt->execute();
}

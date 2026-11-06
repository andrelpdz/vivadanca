<?php
require_once __DIR__ . "/conexao.php";

function cadastrarImagemGaleria($foto, $descricao, $data = null)
{
    global $con;

    if ($data === null) {
        $sql = "INSERT INTO galeria (foto, descricao) VALUES (?, ?)";
        $stmt = $con->prepare($sql);
        $stmt->bind_param("ss", $foto, $descricao);
    } else {
        $sql = "INSERT INTO galeria (foto, descricao, data) VALUES (?, ?, ?)";
        $stmt = $con->prepare($sql);
        $stmt->bind_param("sss", $foto, $descricao, $data);
    }

    $stmt->execute();
    $stmt->close();

    return true;
}

function listarGaleria()
{
    global $con;

    $sql = "SELECT * FROM galeria ORDER BY data DESC";
    $resultado = $con->query($sql);

    return $resultado->fetch_all(MYSQLI_ASSOC);
}

function obterImagemGaleria($id)
{
    global $con;

    $sql = "SELECT * FROM galeria WHERE id = ?";
    $stmt = $con->prepare($sql);
    $stmt->bind_param("i", $id);
    $stmt->execute();

    $resultado = $stmt->get_result();
    $stmt->close();

    $imagem = $resultado->fetch_assoc();

    if (!$imagem) {
        return null;
    }

    return $imagem;
}

function atualizarImagemGaleria($id, $foto, $descricao, $data = null)
{
    global $con;

    if ($data === null) {
        $sql = "UPDATE galeria SET foto = ?, descricao = ? WHERE id = ?";
        $stmt = $con->prepare($sql);
        $stmt->bind_param("ssi", $foto, $descricao, $id);
    } else {
        $sql = "UPDATE galeria SET foto = ?, descricao = ?, data = ? WHERE id = ?";
        $stmt = $con->prepare($sql);
        $stmt->bind_param("sssi", $foto, $descricao, $data, $id);
    }

    $stmt->execute();
    $stmt->close();

    return true;
}

function excluirImagemGaleria($id)
{
    global $con;

    $sql = "DELETE FROM galeria WHERE id = ?";
    $stmt = $con->prepare($sql);
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $stmt->close();

    return true;
}
?>

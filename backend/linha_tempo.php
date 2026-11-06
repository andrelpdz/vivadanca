<?php
require_once __DIR__ . "/conexao.php";

function cadastrarLinhaTempo($foto, $descricao, $data)
{
    global $con;

    $sql = "INSERT INTO linha_tempo (foto, descricao, data)
            VALUES (?, ?, ?)";

    $stmt = $con->prepare($sql);
    $stmt->bind_param("sss", $foto, $descricao, $data);
    $stmt->execute();
    $stmt->close();

    return true;
}

function listarLinhaTempo()
{
    global $con;

    $sql = "SELECT * FROM linha_tempo";
    $resultado = $con->query($sql);

    return $resultado->fetch_all(MYSQLI_ASSOC);
}

function obterLinhaTempo($id)
{
    global $con;

    $sql = "SELECT * FROM linha_tempo WHERE id = ?";
    $stmt = $con->prepare($sql);
    $stmt->bind_param("i", $id);
    $stmt->execute();

    $resultado = $stmt->get_result();
    $stmt->close();

    $linhaTempo = $resultado->fetch_assoc();

    if (!$linhaTempo) {
        return null;
    }

    return $linhaTempo;
}

function atualizarLinhaTempo($id, $foto, $descricao, $data)
{
    global $con;

    $sql = "UPDATE linha_tempo
            SET foto = ?, descricao = ?, data = ?
            WHERE id = ?";

    $stmt = $con->prepare($sql);
    $stmt->bind_param("sssi", $foto, $descricao, $data, $id);
    $stmt->execute();
    $stmt->close();

    return true;
}

function excluirLinhaTempo($id)
{
    global $con;

    $sql = "DELETE FROM linha_tempo WHERE id = ?";
    $stmt = $con->prepare($sql);
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $stmt->close();

    return true;
}
?>

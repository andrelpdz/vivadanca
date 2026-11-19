<?php
require_once __DIR__ . "/conexao.php";

function cadastrarConquista($evento_id, $coreografia_id, $nome, $descricao, $foto){
    global $con;
    try{
        $sql = "INSERT INTO conquistas(evento_id, coreografia_id, nome, descricao, foto) VALUES (?, ?, ?, ?, ?)";
        $stmt = $con->prepare($sql);
        $stmt->bind_param("iisss", $evento_id, $coreografia_id, $nome, $descricao, $foto);
        $stmt->execute();
        $stmt->close();
        return true;
    }catch(Throwable $e){
        return false;
    }
}

function listarConquistas(){
    global $con;

    $sql = "SELECT c.*, 
                   e.nome as evento_nome, 
                   cor.titulo as coreografia_titulo 
            FROM conquistas c 
            JOIN eventos e ON c.evento_id = e.id 
            LEFT JOIN coreografias cor ON c.coreografia_id = cor.id";

    $resultado = $con->query($sql);
    return $resultado->fetch_all(MYSQLI_ASSOC);
}

function obterConquista($id){
    global $con;
    $sql = "SELECT * FROM conquistas WHERE id=?";
    $stmt = $con->prepare($sql);
    $stmt->bind_param("i", $id);
    $stmt->execute();
    return $stmt->get_result()->fetch_assoc();
}

function atualizarConquista($id, $evento_id, $coreografia_id, $nome, $descricao, $foto){
    global $con;
    $sql = "UPDATE conquistas SET evento_id = ?, coreografia_id = ?, nome = ?, descricao = ?, foto = ? WHERE id = ?";
    $stmt = $con->prepare($sql);
    $stmt->bind_param("iisssi", $evento_id, $coreografia_id, $nome, $descricao, $foto, $id);
    $resultado = $stmt->execute();
    $stmt->close();
    return $resultado;
}

function excluirConquista($id){
    global $con;
    $sql = "DELETE FROM conquistas WHERE id=?";
    $stmt = $con->prepare($sql);
    $stmt->bind_param("i", $id);
    $resultado = $stmt->execute();
    $stmt->close();
    return $resultado;
}

// Funções auxiliares para popular os selects
function listarEventosSimples() {
    global $con;
    $sql = "SELECT id, nome FROM eventos";
    $res = $con->query($sql);
    return $res ? $res->fetch_all(MYSQLI_ASSOC) : [];
}

function listarCoreografiasSimples() {
    global $con;
    $sql = "SELECT id, titulo FROM coreografias";
    $res = $con->query($sql);
    return $res ? $res->fetch_all(MYSQLI_ASSOC) : [];
}
?>

<?php
require_once __DIR__ . "/conexao.php";


function cadastrarCoreografia($titulo, $descricao, $data_criacao, $modalidade, $dancarinos=[]){
    global $con;
    $con->begin_transaction();
    try{
        // inserir coreografia
        $sql = "INSERT INTO coreografias
            (titulo, descricao, data_criacao, modalidade) VALUES (?, ?, ?, ?)";
        $stmt = $con->prepare($sql);
        $stmt->bind_param("ssss", $titulo, $descricao, $data_criacao, $modalidade);
        $stmt->execute();
        $id = $con->insert_id;
        $stmt->close();
        

        // inserir dançarinos
        $sql = "INSERT INTO dancarinos (integrante_id, coreografia_id) VALUES (?, ?)";
        $stmt = $con->prepare($sql);
        foreach( array_unique($dancarinos) as $integrante_id ){
            $stmt->bind_param("ii", $integrante_id, $id);
            $stmt->execute();
        }
        $stmt->close();
        $con->commit();
        return true;

    }catch(Throwable $e){
        $con->rollback();
        throw $e;
    }

}

function listarCoreografias(){
    global $con;
    $sql = "SELECT * FROM coreografias";
    $coreografias = $con->query($sql)->fetch_all(MYSQLI_ASSOC);

    $sql = "SELECT * FROM dancarinos";
    $dancarinos = $con->query($sql)->fetch_all(MYSQLI_ASSOC);

    $participantes = [];

    foreach($dancarinos as $dancarino){
        $participantes[$dancarino["coreografia_id"]][] = $dancarino["integrante_id"];
    }

    foreach($coreografias as &$coreografia){
        $coreografia['integrantes'] = $participantes[$coreografia['id']] ?? [];
    }
    
    return $coreografias;
}

function obterCoreografia($id){
    global $con;
    $sql = "SELECT
            c.*,
            GROUP_CONCAT(d.integrante_id) as integrantes
        FROM coreografias c
        LEFT JOIN dancarinos d
            ON d.coreografia_id = c.id
        WHERE c.id = ? GROUP BY c.id";
    $stmt = $con->prepare($sql);
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $resultado = $stmt->get_result();
    $stmt->close();
    $coreografia = $resultado->fetch_assoc();
    if(!$coreografia){
        return null;
    }
    $coreografia['integrantes'] = $coreografia['integrantes'] !== null
        ? array_map("intval", explode(",", $coreografia['integrantes']))
        : [];
    return $coreografia;
}

function atualizarCoreografia($id, $titulo, $descricao, $data_criacao, $modalidade, $dancarinos=[]){
    global $con;
    $con->begin_transaction();
    try{
        $sql = "UPDATE coreografias SET
            titulo = ?, descricao = ?, data_criacao = ?, modalidade = ?
            WHERE id = ?";
        $stmt = $con->prepare($sql);
        $stmt->bind_param(
            "ssssi", $titulo, $descricao, $data_criacao, $modalidade, $id
        );
        $stmt->execute();
        $stmt->close();

        $sql = "DELETE FROM dancarinos WHERE coreografia_id = ?";
        $stmt = $con->prepare($sql);
        $stmt->bind_param("i", $id);
        $stmt->execute();
        $stmt->close();

        // inserir dançarinos
        $sql = "INSERT INTO dancarinos (integrante_id, coreografia_id) VALUES (?, ?)";
        $stmt = $con->prepare($sql);
        foreach( array_unique($dancarinos) as $integrante_id ){
            $stmt->bind_param("ii", $integrante_id, $id);
            $stmt->execute();
        }

        $stmt->close();
        $con->commit();
        return true;

    }catch(throwable $e){
        $con->rollback();
        throw $e;
    }
}


function excluirCoreografia($id){
    global $con;
    $con->begin_transaction();
    try{
        // excluir os dançarinos
        $sql = "DELETE FROM dancarinos WHERE coreografia_id = ?";
        $stmt = $con->prepare($sql);
        $stmt->bind_param("i", $id);
        $stmt->execute();
        $stmt->close();

        // excluir coreografia
        $sql = "DELETE FROM coreografias WHERE id = ?";
        $stmt = $con->prepare($sql);
        $stmt->bind_param("i", $id);
        $stmt->execute();
        $stmt->close();

        $con->commit();
        return true;

    }catch(throwable $e){
        $con->rollback();
        throw $e;
    }
}

?>
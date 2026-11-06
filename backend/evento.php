<?php
require_once __DIR__ . "/conexao.php";


// function cadastrarEvento($nome, $descricao, $data_inico, $data_termino, $cidade, $local, $premiacao, $participantes=[]){
//     global $con;
//     $con->begin_transaction();
//     try{
//         // cadastro do evento
//         $sql = "INSERT INTO eventos 
//             (nome, descricao, data_inicio, data_termino, cidade, local, premiacao)
//             VALUES (?, ?, ?, ?, ?, ?, ?)";
//         $stmt = $con->prepare($sql);
//         $stmt->bind_param("sssssss", 
//             $nome, $descricao, 
//             $data_inico, $data_termino, 
//             $cidade, $local, $premiacao);

//         $stmt->execute();
//         $id = $con->insert_id;
//         $stmt->close();

//         // inserindo os participantes
//         $sql = "INSERT INTO participantes (integrante_id, evento_id)
//             VALUES (?, ?)";
//         $stmt = $con->prepare($sql);
//         foreach ( array_unique($participantes) as $integrante_id ){
//             $stmt->bind_param("ii", $integrante_id, $id);
//             $stmt->execute();
//         }

//         // confirmar transação
//         $stmt->close();
//         $con->commit();
//         return true;

//     }catch (Throwable $e){
//         $con->rollback();
//         return false;
//     }
// }

// function obterEvento($id){
//     global $con;
//     $sql = "SELECT * FROM eventos WHERE id=?";
//     $stmt = $con->prepare($sql);
//     $stmt->bind_param("i", $id);
//     $stmt->execute();
//     $resultado = $stmt->get_result();
//     $evento = $resultado->fetch_assoc();
//     $stmt->close();
//     if(!$evento){
//         return null;
//     }
//     return $evento;
// }

// function atualizarEvento($id, $nome, $descricao, $data_inico, $data_termino, $cidade, $local, $premiacao, $participantes=[]){
//     global $con;
//     $con->begin_transaction();
//     try{
//         // atualizando o evento
//         $sql = "UPDATE eventos SET
//             nome = ?, descricao = ?, data_inicio = ?, data_termino = ?, cidade = ?,
//             local = ?, premiacao = ? WHERE id = ?";
//         $stmt = $con->prepare($sql);
//         $stmt->bind_param("sssssssi", $nome, $descricao, 
//         $data_inico, $data_termino, 
//         $cidade, $local, $premiacao, $id);
//         $resultado = $stmt->execute();

//         // removendo os participantes
//         $sql = "DELETE FROM participantes WHERE evento_id = ?";
//         $stmt = $con->prepare($sql);
//         $stmt->bind_param("i", $id);
//         $resultado = $stmt->execute();

//         // inserindo os participantes
//         $sql = "INSERT INTO participantes (integrante_id, evento_id)
//             VALUES (?, ?)";
//         $stmt = $con->prepare($sql);
//         foreach ( array_unique($participantes) as $integrante_id ){
//             $stmt->bind_param("ii", $integrante_id, $id);
//             $stmt->execute();
//         }

//         // confirmar transação
//         $stmt->close();
//         $con->commit();
//         return true;

//     }catch (Throwable $e){
//         $con->rollback();
//         return false;
//     }
// }

// function excluirEvento($id){
//     global $con;
//     $con->begin_transaction();
//     try{
//         // removendo os participantes
//         $sql = "DELETE FROM participantes WHERE evento_id = ?";
//         $stmt = $con->prepare($sql);
//         $stmt->bind_param("i", $id);
//         $resultado = $stmt->execute();
//         $stmt->close();

//         // falta remover a conquista relacionada ao evento
//         // PENDENTE !!!!!!
//         $sql = "DELETE FROM conquistas WHERE evento_id = ?";
//         $stmt = $con->prepare($sql);
//         $stmt->bind_param("i", $id);
//         $stmt->execute();
//         $stmt->close();

//         // excluir evento
//         $sql = "DELETE FROM eventos WHERE id = ?";
//         $stmt = $con->prepare($sql);
//         $stmt->bind_param("i", $id);
//         $stmt->execute();

//         // confirmar transação
//         $stmt->close();
//         $con->commit();
//         return true;

//     }catch (Throwable $e){
//         $con->rollback();
//         return false;
//     }
// }

function listarEventos(){
    global $con;
    $sql = "SELECT * FROM eventos";
    $resultado = $con->query($sql);
    return $resultado->fetch_all(MYSQLI_ASSOC);
}

try {
    if ($_SERVER["REQUEST_METHOD"] !== "GET") {
        http_response_code(405);
        throw new Exception("Método não permitido.");
    }
 
    echo json_encode(
        [
            "sucesso" => true,
            "eventos" => listarEventos()
        ],
        JSON_UNESCAPED_UNICODE
    );
} catch (Throwable $erro) {
    if (http_response_code() < 400) {
        http_response_code(500);
    }
 
    error_log($erro->getMessage());
    echo json_encode(
        [
            "sucesso" => false,
            "mensagem" => "Não foi possível carregar os eventos."
        ],
        JSON_UNESCAPED_UNICODE
    );
}
?>
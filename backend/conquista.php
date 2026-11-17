<?php
require_once __DIR__ . "/conexao.php";
require_once __DIR__ . "/foto.php";

$metodo = $_SERVER['REQUEST_METHOD'];

function cadastrar(){
    global $con;

    $evento_id = 1; //teste
    $coreografia_id = 3; //teste

    $nome = $_POST['nome'];
    $descricao  = $_POST['descricao'];
    $foto = $_FILES['foto'];
    $nome_foto = salvarFoto("conquistas", $foto);

    $sql = "INSERT INTO conquistas
        (nome, descricao, foto, evento_id, coreografia_id)
        VALUES (?, ?, ?, ?, ?)";
    $stmt = $con->prepare($sql);
    $stmt->bind_param("sssii", $nome, $descricao, $nome_foto, $evento_id, $coreografia_id);
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

try {
    $status = true;

    if ($metodo == "GET") {

        $resp = ["conquista" => listarConquistas()];

    } 
    else if ($metodo == "POST") {

        cadastrar();
        header("location: ../admin/cadastro_conquista.html");
        exit;

    } 
    else if ($metodo == "DELETE") {

        $id = $_GET['id'];
        excluirConquista($id);

        $resp = ["mensagem" => "Conquista excluída!"];

    } 
    else {

        throw new Exception("Método inválido!");

    }

} catch (Throwable $e) {

    http_response_code(500);
    $status = false;
    $resp = ["erro" => $e->getMessage()];

}

header("Content-Type: application/json; charset=utf-8");
echo json_encode(["sucesso" => $status] + $resp);


?>
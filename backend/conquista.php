<?php
require_once __DIR__ . "/conexao.php";
require_once __DIR__ . "/foto.php";

<<<<<<< HEAD
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
=======
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
>>>>>>> b53359648acc28bfb299e25220db34b65ce444bb

function listarConquistas(){
    global $con;
    $sql = "SELECT c.*, e.nome as evento_nome, e.data_inicio, e.cidade, cor.titulo as coreografia_titulo 
            FROM conquistas c 
            LEFT JOIN eventos e ON c.evento_id = e.id 
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
<<<<<<< HEAD
<<<<<<< HEAD

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


=======
>>>>>>> b53359648acc28bfb299e25220db34b65ce444bb
=======

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
>>>>>>> 42fe8ba85f30bcaee2a6c4d0e29a445e968fef1b
?>
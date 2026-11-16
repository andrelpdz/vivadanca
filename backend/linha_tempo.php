<?php
require_once __DIR__ . "/conexao.php";
require_once __DIR__ . "/foto.php";

$metodo = $_SERVER['REQUEST_METHOD'];
$status = true;
$resp = [];

function cadastrar()
{
    global $con;
    $descricao = trim($_POST['descricao']);
    $data = $_POST['ano'];
    $foto = $_FILES['foto'];
    $nome_foto = salvarFoto("linha_tempo", $foto);

    $sql = "INSERT INTO linha_tempo (foto, descricao, data)
            VALUES (?, ?, ?)";

    $stmt = $con->prepare($sql);
    $stmt->bind_param("ssi", $nome_foto, $descricao, $data);
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

function atualizarLinhaTempo()
{
    global $con;

    $id = $_POST['id'];
    $descricao = $_POST['descricao'];
    $data = $_POST['ano'];
    $foto = $_FILES['foto'];
    $nome_foto = salvarFoto("linha_tempo", $foto);

    $sql = "UPDATE linha_tempo
            SET foto = ?, descricao = ?, data = ?
            WHERE id = ?";

    $stmt = $con->prepare($sql);
    $stmt->bind_param("ssii", $nome_foto, $descricao, $data, $id);
    $stmt->execute();
    $stmt->close();

    return true;
}

function excluirLinhaTempo()
{
    $id = $_GET['id'] ?? 0;
    global $con;

    $sql = "DELETE FROM linha_tempo WHERE id = ?";
    $stmt = $con->prepare($sql);
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $stmt->close();

    return true;
}



try{
    if ($metodo == "GET"){
        // listar os integrantes
        $resp = ["linha_tempo" => listarLinhaTempo()];        
    }
    else if ($metodo == "POST"){
        if($_POST['btnEnviar'] == 'Cadastrar'){
            cadastrar();
        }else if($_POST['btnEnviar'] == 'Atualizar'){
            atualizarLinhaTempo();
        }
        header("location: ../admin/linha_tempo.html");
        exit;
    }
    else if ($metodo == "PUT"){
        // atualização integrante
        header("location: ../admin/linha_tempo.html");
        exit;
    }
    else if ($metodo == "DELETE"){
        excluirLinhaTempo();
    }
    else{
        throw new Exception("Metodo invalido!");
    }
}catch(Throwable $e){
    http_response_code(500);
    $status = false;
    $resp = ["erro" => $e->getMessage()];
}finally{
    header("Content-Type: application/json; charset=utf-8");
     echo json_encode( ["sucesso"=> $status] + $resp );
}
?>

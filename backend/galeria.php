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

    try {
        if (!$stmt->execute()) {
            throw new RuntimeException($stmt->error);
        }
    } finally {
        $stmt->close();
    }

    return true;
}

function listarGaleria(){
    global $con;

    $resultado = $con->query("SELECT * FROM galeria ORDER BY data DESC");

    return $resultado->fetch_all(MYSQLI_ASSOC);
}

function obterImagemGaleria($id){
    global $con;

    $stmt = $con->prepare("SELECT * FROM galeria WHERE id = ?");
    $stmt->bind_param("i", $id);
    $stmt->execute();

    $imagem = $stmt->get_result()->fetch_assoc();
    $stmt->close();

    return $imagem;
}

function atualizarImagemGaleria($id, $foto, $descricao, $data = null){
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

function excluirImagemGaleria($id){
    global $con;

    $stmt = $con->prepare("DELETE FROM galeria WHERE id = ?");
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $stmt->close();

    return true;
}

header("Content-Type: application/json; charset=utf-8");

$metodo = $_SERVER["REQUEST_METHOD"];

try{
    if ($metodo === "POST") {
        $imagem = $_FILES["imagem"] ?? null;
        $descricao = trim($_POST["descricao"] ?? "");

        if (($imagem["error"] ?? null) !== UPLOAD_ERR_OK) {
            http_response_code(400);
            echo json_encode([
                "sucesso" => false,
                "mensagem" => "Falha no envio da imagem."
            ], JSON_UNESCAPED_UNICODE);
            exit;
        }

        $tipo = (new finfo(FILEINFO_MIME_TYPE))->file($imagem["tmp_name"]);
        $extensoes = [
            "image/jpeg" => "jpg",
            "image/png" => "png",
            "image/webp" => "webp"
        ];

        if (!isset($extensoes[$tipo])) {
            http_response_code(400);
            echo json_encode([
                "sucesso" => false,
                "mensagem" => "Envie uma imagem JPEG ou PNG."
            ], JSON_UNESCAPED_UNICODE);
            exit;
        }

        $pasta = __DIR__ . "/../assets/galeria";

        if (!is_dir($pasta)) {
            throw new RuntimeException("A pasta assets/galeria não existe.");
        }

        $foto = bin2hex(random_bytes(16)) . "." . $extensoes[$tipo];
        $destino = $pasta . "/" . $foto;

        if (!move_uploaded_file($imagem["tmp_name"], $destino)) {
            throw new RuntimeException("Falha ao salvar a foto em assets/galeria.");
        }

        try {
            cadastrarImagemGaleria($foto, $descricao);
        } catch (Throwable $erro) {
            unlink($destino);
            throw $erro;
        }

        http_response_code(201);
        echo json_encode(["sucesso" => true]);
        exit;
    }

    if ($metodo === "GET") {
        echo json_encode([
            "sucesso" => true,
            "galeria" => listarGaleria()
        ], JSON_UNESCAPED_UNICODE | JSON_THROW_ON_ERROR);
        exit;
    }

    header("Allow: GET, POST");
    http_response_code(405);
    echo json_encode([
        "sucesso" => false,
        "mensagem" => "Método não permitido."
    ], JSON_UNESCAPED_UNICODE);
} catch (Throwable $erro){
    error_log("Galeria ($metodo): " . $erro->getMessage());

    http_response_code(500);
    echo json_encode([
        "sucesso" => false,
        "mensagem" => $metodo === "POST"
            ? "Não foi possível cadastrar a foto."
            : "Não foi possível carregar a galeria."
    ], JSON_UNESCAPED_UNICODE);
}


?>
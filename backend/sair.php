<?php
require_once __DIR__ . "/conexao.php";

header("Content-Type: application/json; charset=utf-8");

function listarGaleria()
{
    global $con;

    $sql = "SELECT * FROM galeria ORDER BY data DESC";
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
            "imagens" => listarGaleria()
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
            "mensagem" => "Não foi possível carregar a galeria."
        ],
        JSON_UNESCAPED_UNICODE
    );
}
?>

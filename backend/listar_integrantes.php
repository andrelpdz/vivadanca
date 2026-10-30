<?php
require_once __DIR__ . "/conexao.php";
header("Content-Type: application/json; charset=utf-8");



try{
    $sql = "SELECT * FROM integrantes";
    $resultado = $con->query($sql);
    if ($resultado === false){
        throw new Exception("Erro na consulta");
    }
    $integrantes = [];

    while ($integrante = $resultado->fetch_assoc()){
        $integrantes[] = [
            "id" => $integrante['id'],
            "nome" => $integrante['nome'],
            "descricao" => $integrante['descricao'],
            "foto" => $integrante['foto'], 
            "ativo" => $integrante['ativo']
        ];
    }
    echo json_encode(
        ['sucesso' => true,
        'integrantes' => $integrantes]
    );

}catch(Throwable $e){
    http_response_code(500);
    echo json_encode(
        ['sucesso' => false,
        'mensagem' => "Erro ao carregar os integrantes"]
    );
    exit;
}

?>
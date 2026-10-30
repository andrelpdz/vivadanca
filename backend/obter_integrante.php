<?php
require_once __DIR__ . "/conexao.php";
header("Content-Type: application/json; charset=utf-8");


try{
    $integrante = [];
    $id = filter_input(INPUT_GET, "id");
    if ($id === false || $id === null){
        throw new Exception("ID incorreto!");
    }

    $sql = "SELECT * FROM integrantes WHERE id=?";
    $stmt = $con->prepare($sql);
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $resultado = $stmt->get_result();
    $integrante = $resultado->fetch_assoc();


    $coreografias = [];
    $sql = "SELECT
        co.id, co.titulo, co.data_criacao
        FROM coreografias as co
        JOIN dancarinos ON dancarinos.coreografia_id = co.id
        JOIN integrantes ON integrantes.id = dancarinos.integrante_id
        WHERE integrantes.id = ?";
    $stmt = $con->prepare($sql);
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $resultado = $stmt->get_result();

    while ($coregrafia = $resultado->fetch_assoc()){
        $coreografias[] = [
            "id" => $coregrafia['id'],
            "titulo" => $coregrafia['titulo'],
            "data_criacao" => $coregrafia['data_criacao']
        ];
    }

    $conquistas = [];
    $sql = "SELECT 
        co.id, co.nome, co.foto,
        ev.data_inicio, ev.nome AS nome_evento
    FROM conquistas AS co
    JOIN eventos AS ev ON ev.id = co.evento_id
    JOIN participantes AS pa ON pa.evento_id = ev.id
    JOIN integrantes ON integrantes.id = pa.integrante_id
    WHERE integrantes.id = ?";
    $stmt = $con->prepare($sql);
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $resultado = $stmt->get_result();

    while ($conquista = $resultado->fetch_assoc()){
        $conquistas[] = [
            "id" => $conquista['id'],
            "nome" => $conquista['nome'],
            "foto" => $conquista['foto'],
            "data_inicio" => $conquista['data_inicio'],
            "nome_evento" => $conquista['nome_evento']
        ];
    }

    echo json_encode(
        ['sucesso' => true,
        'integrante' => $integrante,
        'coreografias' => $coreografias,
        'conquistas' => $conquistas
        ]
    );

}catch(Throwable $e){
    http_response_code(500);
    echo json_encode(
        ['sucesso' => false,
        'mensagem' => "Erro ao carregar o integrante"]
    );
    exit;
}

?>
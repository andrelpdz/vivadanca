<?php

require_once __DIR__ . "/backend/evento.php";
require_once __DIR__ . "/backend/coreografia.php";
require_once __DIR__ . "/backend/conquista.php";

header("Content-Type: application/json; charset=utf-8");

try{
    // executar testes eventso
    // $resp = excluirEvento(3);

    // teste da COREOGRAFIAS
    // $resp = cadastrarCoreografia("Dança dos famosos", 
    //     "Dança cria para o faustão", "2026-10-26", "Contemporanea", [9, 5, 4]);
    // $resp = listarCoreografias();
    // $resp = obterCoreografia(5); 
    // $resp = excluirCoreografia(6);
    // $resp = atualizarCoreografia(1, "Dança no SBT", 
    //     "Dança cria para o programa qual é o seu talento", "2016-02-10", "FreeStyle", [9]);

    // teste da Conquista
    // $resp = cadastrarConquista("Conquista1", "Melhor dançarino da noite","foto.png", 2, 5);
    // $resp = listarConquistas();
    // $resp = obterConquista(1);
    // $resp = atualizarConquista(2, "O mais BELO", "Melhor Figurino MASC","AFOTO.png", 2, 5);
    $resp = excluirConquista(4);

    echo json_encode([
        "sucesso" => true,
        "resp" => $resp
    ]);

   

}catch(Throwable $e){
    http_response_code(500);
    echo json_encode([
        "sucesso" => false,
        "mensagem" => $e->getMessage()
    ]);
}



?>
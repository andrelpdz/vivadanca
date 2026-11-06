<?php
include "../backend/conexao.php";

<?php
//-> Inclui conexão
include "../backend/conexao.php";
//-> Utiliza variavel CON em conexao
global $con;
//-> Envia ao banco o comando SELECT
$sql = "SELECT * FROM galeria";
//-> Armazena em resultado o retorno do banco
$resultado = $con->query($sql);
//-> Transforma o resultado em Array com todos os dados
//$dados = $resultado->fetch_all(MYSQLI_ASSOC);
//-> ou este que Transforma o resultado em Array com 1 resultado
$dados = $resultado->fetch_assoc();
//-> Falta algo a partir daqui.....
echo $dados['foto'];
?>
 


$eventos = [];


$eventos 
          "id" => $evento['id'],
            "nome" => $evento['nome'],
            "descricao" => $evento['descricao'],
            "data_inicio" => $evento['data_inicio'], 
            "data_termino" => $evento['data_inicio'],
            "cidade" => $evento['cidade'],
            "local" => $evento['local'],
            "premiacao" => $evento['premiacao']
        ];
}





echo $dados ['foto'];




if ($resultado === false){
    throw new Exception("Erro na consulta");
}
$eventos = [];

while ($evento = $resultado->fetch_assoc()){
    $eventos 
          "id" => $evento['id'],
            "nome" => $evento['nome'],
            "descricao" => $evento['descricao'],
            "data_inicio" => $evento['data_inicio'], 
            "data_termino" => $evento['data_inicio'],
            "cidade" => $evento['cidade'],
            "local" => $evento['local'],
            "premiacao" => $evento['premiacao']
        ];
    }
    echo json_encode(
        ['sucesso' => true,
        'eventos' => $eventos]
    );

}catch(Throwable $e){
    http_response_code(500);
    echo json_encode(
        ['sucesso' => false,
        'mensagem' => "Erro ao carregar os eventos"]
    );
    exit;
}
    


// $resultado->fetch_all(MYSQLI_ASSOC);

// echo $resultado


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



?>





<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cadastro Evento</title>
</head>
<body>
    <?php include "header.php";?>
    <a href="cadastro_integrante.html"> ir para cadastro de integrantes</a><br>
    <a href="cadastro_conquista.html">Cadastro Conquista</a><br>
    <a href="cadastro_coreografia.html"> ir para cadastro de coreografia</a><br>

    <br>

    <form action="../backend/registro_evento.php" method="POST">
        <input type="text" name="nome" placeholder="Nome do Evento"><br>
        <input type="text" name="descricao" placeholder="Descrição do Evento"><br>
        <input type="datetime-local" name="data_inicio"><br>
        <input type="datetime-local" name="data_termino"><br>
        <input type="text" name="cidade" placeholder="Cidade"><br>
        <input type="text" name="local" placeholder="Local do evento"><br>
        <input type="text" name="premiacao" placeholder="Premiação do evento"><br><br>
        <input type="submit" value="Cadastrar Evento">
    </form>

    
</body>
</html>
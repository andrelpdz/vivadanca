<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cadastro Coreografia</title>
</head>
<body>
    <?php inlude header.php; ?>
    <a href="cadastro_integrante.html"> ir para cadastro de integrantes</a><br>
    <a href="cadastro_conquista.html">Cadastro Conquista</a><br>
    <a href="cadastro_evento.html"> ir para cadastro evento</a><br>

    <br>

    <form action="../backend/registro_coreografia.php" method="POST">
        <input type="text" name="titulo" placeholder="Nome coreografia"><br>
        <input type="text" name="descricao" placeholder="Descrição da coreografia"><br>
        <input type="date" name="data_criacao"><br>
        <input type="text" name="modalidade" placeholder="modalidade"><br><br>
        <input type="submit" value="Cadastrar Evento">
    </form>

    
</body>
</html>
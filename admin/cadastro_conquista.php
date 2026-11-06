<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cadastro de Conquistas</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
<?php include "header.php"; ?>
    <main class="container">

        <h1>Cadastro de Conquistas</h1>
        <p>Preencha os dados da conquista.</p>

        <form action="#" method="POST" enctype="multipart/form-data">

            <label>Evento ID:</label>
            <input type="number" name="evento_id" required>

            <label>Coreografia ID:</label>
            <input type="number" name="coreografia_id" required>

            <label>Nome:</label>
            <input type="text" name="nome" placeholder="Nome da conquista" required>

            <label>Descrição:</label>
            <textarea name="descricao" placeholder="Descreva a conquista"></textarea>

            <label>Foto:</label>
            <input type="file" name="foto" accept="image/*">

            <button type="submit">Cadastrar Conquista</button>

        </form>

    </main>

</body>
</html>
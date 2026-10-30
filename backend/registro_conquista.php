<?php
require_once __DIR__ . "/conexao.php";

if ($_SERVER['REQUEST_METHOD'] !== "POST"){
    header("location: /projetodanca/pages/cadastro_conquista.html");
    exit;
}


$evento_id = trim($_POST['evento_id']);
$coreografia_id = trim($_POST['coreografia_id']);
$nome = trim($_POST['nome']);
$descricao = trim($_POST['descricao']);

$foto = $_FILES['foto'];
$nome_foto = null;
$caminho_foto = null;


// validar se a foto foi enviada
if (!$foto || $foto['error'] === UPLOAD_ERR_NO_FILE){
    header("location: /projetodanca/pages/cadastro_conquista.html");
    exit;
}
if ($foto['error'] !== UPLOAD_ERR_OK){
    header("location: /projetodanca/pages/cadastro_conquista.html");
    exit;
}

// validar tamanho da foto
if ($foto['size'] > 1024 * 1024 * 5){
    header("location: /projetodanca/pages/cadastro_conquista.html");
    exit;
}

$tipos = [
    'image/jpeg' => 'jpg',
    'image/png' => 'png',
    'image/gif' => 'gif',
    'image/webp' => 'webp'
];
$mime = (new finfo(FILEINFO_MIME_TYPE))->file($foto['tmp_name']);
if ( !isset($tipos[$mime]) ){
    header("location: /projetodanca/pages/cadastro_conquista.html");
    exit;
}

// gerar nome aleatório
$nome_foto = bin2hex(random_bytes(16)) . "." . $tipos[$mime];

// preparar pasta de upload
$pasta = __DIR__ . "/../assets/conquistas"; 
if ( !is_dir($pasta) && !mkdir($pasta, 0755, true) && !is_dir($pasta)){
    header("location: /projetodanca/pages/cadastro_conquista.html");
    exit;
}

$nome_completo = $pasta . "/" . $nome_foto;

if (!move_uploaded_file($foto['tmp_name'], $nome_completo)){
    header("location: /projetodanca/pages/cadastro_conquista.html");
    exit;
}

try{
    $sql = "INSERT INTO conquistas(evento_id, coreografia_id, nome, descricao, foto) VALUES (?, ?, ?, ?, ?)";
    $stmt = $con->prepare($sql);
    $stmt->bind_param("iisss", $evento_id, $coreografia_id, $nome, $descricao, $nome_foto);
    $stmt->execute();
    $stmt->close();
    $con->close();
    echo "Cadastro realizado com sucesso";

}catch(Throwable $e){
    if ($nome_completo && is_file($nome_completo) ){
        unlink($nome_completo);
    }
    header("location: /projetodanca/pages/cadastro_conquista.html");
    exit;
}






?>
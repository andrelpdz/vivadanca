<?php

$caminhoInicial = __DIR__ . "/../assets";

function salvarFoto($pasta, $foto){
    global $caminhoInicial;

    // validar se a foto foi enviada
    if (!$foto || $foto['error'] === UPLOAD_ERR_NO_FILE){
        throw new Exception("Foto nao encontada!");
    }
    if ($foto['error'] !== UPLOAD_ERR_OK){
        throw new Exception("Erro ao enviar a foto!");
    }
    // validar tamanho da foto
    if ($foto['size'] > 1024 * 1024 * 5){
        throw new Exception("A foto execede o limite de 5MB.");
    }

    $tipos = [
        'image/jpeg' => 'jpg',
        'image/png' => 'png',
        'image/gif' => 'gif',
        'image/webp' => 'webp'
    ];
    $mime = (new finfo(FILEINFO_MIME_TYPE))->file($foto['tmp_name']);
    if ( !isset($tipos[$mime]) ){
        throw new Exception("Formato da imagem invalido.");
    }

    // gerar nome aleatório
    $nome_foto = bin2hex(random_bytes(16)) . "." . $tipos[$mime];

    // preparar pasta de upload
    $pasta = "$caminhoInicial/$pasta";
    if ( !is_dir($pasta) && !mkdir($pasta, 0755, true) && !is_dir($pasta)){
        throw new Exception("Erro ao criar a pasta.");
    }

    $nome_completo = "$pasta/$nome_foto";

    if (!move_uploaded_file($foto['tmp_name'], $nome_completo)){
        throw new Exception("Erro ao salvar a foto");
    }
    return $nome_foto;

}


function excluirFoto($pasta, $nome_foto){
    global $caminhoInicial;
    $nome_foto = basename($nome_foto);

    $nome_completo = "$caminhoInicial/$pasta/$nome_foto";
    if ( !is_file($nome_completo) || is_link($nome_completo) ){
        return ;
    }
    return unlink($nome_completo);
}

?>
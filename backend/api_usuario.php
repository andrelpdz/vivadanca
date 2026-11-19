
<?php
require_once __DIR__ . "/usuario.php";

header("Content-Type: application/json; charset=utf-8");

$metodo = $_SERVER['REQUEST_METHOD'];
$status = true;
$resp = [];

function cadastrar() {
    $nome = trim($_POST['nome'] ?? '');
    $email = trim($_POST['email'] ?? '');
    $senha = $_POST['senha'] ?? '';
    $confirmarSenha = $_POST['confirmarSenha'] ?? '';
    $tipo_usuario = trim($_POST['tipo_usuario'] ?? 'editor');

    $permissoes_arr = $_POST['permissoes'] ?? [];
    $permissoes = is_array($permissoes_arr)
        ? implode(", ", $permissoes_arr)
        : $permissoes_arr;

    if ($nome === '' || $email === '') {
        throw new Exception("Preencha nome e e-mail.");
    }

    if (strlen($senha) < 8) {
        throw new Exception("A senha deve ter pelo menos 8 caracteres.");
    }

    if ($senha !== $confirmarSenha) {
        throw new Exception("As senhas não coincidem.");
    }

    $resposta = cadastrarUsuario(
        $nome,
        $email,
        $senha,
        $tipo_usuario,
        $permissoes
    );

    if (!$resposta) {
        throw new Exception("Erro ao cadastrar. Verifique se o e-mail já existe.");
    }

    return "Usuário cadastrado com sucesso.";
}

function atualizar() {
    $id = trim($_POST['idUsuario'] ?? '');
    $nome = trim($_POST['nome'] ?? '');
    $email = trim($_POST['email'] ?? '');
    $senha = $_POST['senha'] ?? '';
    $tipo_usuario = trim($_POST['tipo_usuario'] ?? 'editor');

    $permissoes_arr = $_POST['permissoes'] ?? [];
    $permissoes = is_array($permissoes_arr)
        ? implode(", ", $permissoes_arr)
        : $permissoes_arr;

    if ($id === '') {
        throw new Exception("ID do usuário não informado.");
    }

    if ($nome === '' || $email === '') {
        throw new Exception("Nome e e-mail são obrigatórios.");
    }

    if ($senha !== '' && strlen($senha) < 8) {
        throw new Exception("A nova senha deve ter pelo menos 8 caracteres.");
    }

    $resposta = atualizarUsuario(
        $id,
        $nome,
        $email,
        $senha,
        $tipo_usuario,
        $permissoes
    );

    if (!$resposta) {
        throw new Exception("Erro ao atualizar o usuário.");
    }

    return "Usuário atualizado com sucesso.";
}

function deletar() {
    $id = $_GET['id'] ?? '';

    if ($id === '') {
        throw new Exception("ID do usuário não informado.");
    }

    $resposta = excluirUsuario($id);

    if (!$resposta) {
        throw new Exception("Erro ao excluir usuário.");
    }

    return "Usuário excluído com sucesso.";
}

try {
    if ($metodo === "GET") {
        $resp = [
            "usuarios" => listarUsuarios()
        ];
    }
    elseif ($metodo === "POST") {
        $idUsuario = trim($_POST['idUsuario'] ?? '');

        if ($idUsuario !== '') {
            $mensagem = atualizar();
        } else {
            $mensagem = cadastrar();
        }

        $resp = [
            "mensagem" => $mensagem
        ];
    }
    elseif ($metodo === "DELETE") {
        $mensagem = deletar();

        $resp = [
            "mensagem" => $mensagem
        ];
    }
    else {
        throw new Exception("Método inválido.");
    }

} catch (Throwable $e) {
    http_response_code(400);
    $status = false;

    $resp = [
        "erro" => $e->getMessage()
    ];
}

echo json_encode(
    ["sucesso" => $status] + $resp,
    JSON_UNESCAPED_UNICODE
);
?>

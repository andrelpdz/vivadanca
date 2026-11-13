
<?php

header("Content-Type: application/json; charset=UTF-8");

require_once "conexao.php";

$metodo = $_SERVER["REQUEST_METHOD"];

$todasPermissoes = [
    "Linha do tempo",
    "Integrantes",
    "Coreografias",
    "Conquistas",
    "Galerias"
];

try {

    // ==============================
    // BUSCAR USUÁRIOS
    // ==============================

    if ($metodo === "GET") {

        $sql = "SELECT id, nome, email, criado, tipo_usuario, permissoes
                FROM usuario
                ORDER BY id DESC";

        $resultado = $con->query($sql);

        if (!$resultado) {
            throw new Exception("Erro ao consultar usuários.");
        }

        $usuarios = [];

        while ($usuario = $resultado->fetch_assoc()) {

            $usuario["permissoes"] =
                json_decode($usuario["permissoes"] ?? "[]", true) ?? [];

            $usuarios[] = $usuario;
        }

        echo json_encode([
            "sucesso" => true,
            "usuarios" => $usuarios
        ]);

        exit;
    }


    // ==============================
    // CADASTRAR USUÁRIO
    // ==============================

    if ($metodo === "POST") {

        $dados = json_decode(file_get_contents("php://input"), true);

        if (!is_array($dados)) {
            throw new Exception("Dados inválidos.");
        }

        $nome = trim($dados["nome"] ?? "");
        $email = strtolower(trim($dados["email"] ?? ""));
        $senha = $dados["senha"] ?? "";
        $confirmacao = $dados["confirmacao"] ?? "";
        $tipo = $dados["tipo"] ?? "";
        $permissoes = $dados["permissoes"] ?? [];

        if ($nome === "" || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
            throw new Exception("Preencha nome e e-mail corretamente.");
        }

        if (strlen($senha) < 8) {
            throw new Exception("A senha deve ter pelo menos 8 caracteres.");
        }

        if ($senha !== $confirmacao) {
            throw new Exception("As senhas não são iguais.");
        }

        if (!in_array($tipo, ["admin", "editor"], true)) {
            throw new Exception("Tipo de usuário inválido.");
        }

        if ($tipo === "admin") {

            $permissoes = $todasPermissoes;

        } else {

            $permissoes = array_values(array_intersect(
                $todasPermissoes,
                is_array($permissoes) ? $permissoes : []
            ));

        }

        // Verificar e-mail existente
        $verificar = $con->prepare(
            "SELECT id FROM usuario WHERE email = ?"
        );

        $verificar->bind_param("s", $email);
        $verificar->execute();

        $resultado = $verificar->get_result();

        if ($resultado->num_rows > 0) {
            throw new Exception("Este e-mail já está cadastrado.");
        }

        // Proteger senha
        $senhaHash = password_hash($senha, PASSWORD_DEFAULT);

        $permissoesJson = json_encode($permissoes);

        $sql = "INSERT INTO usuario
                (nome, email, senha, tipo_usuario, permissoes, criado)
                VALUES (?, ?, ?, ?, ?, NOW())";

        $inserir = $con->prepare($sql);

        $inserir->bind_param(
            "sssss",
            $nome,
            $email,
            $senhaHash,
            $tipo,
            $permissoesJson
        );

        if (!$inserir->execute()) {
            throw new Exception("Não foi possível cadastrar o usuário.");
        }

        echo json_encode([
            "sucesso" => true,
            "mensagem" => "Usuário cadastrado com sucesso."
        ]);

        exit;
    }


    // ==============================
    // ATUALIZAR USUÁRIO
    // ==============================

    if ($metodo === "PUT") {

        $dados = json_decode(file_get_contents("php://input"), true);

        if (!is_array($dados)) {
            throw new Exception("Dados inválidos.");
        }

        $id = filter_var(
            $dados["id"] ?? null,
            FILTER_VALIDATE_INT
        );

        $tipo = $dados["tipo"] ?? "";
        $permissoes = $dados["permissoes"] ?? [];

        if (!$id || $id <= 0) {
            throw new Exception("Código de usuário inválido.");
        }

        if (!in_array($tipo, ["admin", "editor"], true)) {
            throw new Exception("Tipo de usuário inválido.");
        }

        // Verificar se o usuário existe
        $verificar = $con->prepare(
            "SELECT id FROM usuario WHERE id = ?"
        );

        $verificar->bind_param("i", $id);
        $verificar->execute();

        $resultado = $verificar->get_result();

        if ($resultado->num_rows === 0) {
            throw new Exception("Usuário não encontrado.");
        }

        // Administrador recebe todas as permissões
        if ($tipo === "admin") {

            $permissoes = $todasPermissoes;

        } else {

            // Editor recebe somente permissões válidas
            $permissoes = array_values(array_intersect(
                $todasPermissoes,
                is_array($permissoes) ? $permissoes : []
            ));

        }

        $permissoesJson = json_encode($permissoes);

        $sql = "UPDATE usuario
                SET tipo_usuario = ?, permissoes = ?
                WHERE id = ?";

        $atualizar = $con->prepare($sql);

        $atualizar->bind_param(
            "ssi",
            $tipo,
            $permissoesJson,
            $id
        );

        if (!$atualizar->execute()) {
            throw new Exception("Erro ao atualizar usuário.");
        }

        echo json_encode([
            "sucesso" => true,
            "mensagem" => "Usuário atualizado com sucesso."
        ]);

        exit;
    }


    // ==============================
    // EXCLUIR USUÁRIO
    // ==============================

    if ($metodo === "DELETE") {

        $dados = json_decode(file_get_contents("php://input"), true);

        if (!is_array($dados)) {
            throw new Exception("Dados inválidos.");
        }

        $id = filter_var(
            $dados["id"] ?? null,
            FILTER_VALIDATE_INT
        );

        if (!$id || $id <= 0) {
            throw new Exception("Código de usuário inválido.");
        }

        $sql = "DELETE FROM usuario WHERE id = ?";

        $excluir = $con->prepare($sql);

        $excluir->bind_param("i", $id);

        if (!$excluir->execute()) {
            throw new Exception("Não foi possível excluir o usuário.");
        }

        if ($excluir->affected_rows === 0) {
            throw new Exception("Usuário não encontrado.");
        }

        echo json_encode([
            "sucesso" => true,
            "mensagem" => "Usuário excluído com sucesso."
        ]);

        exit;
    }


    // ==============================
    // MÉTODO NÃO PERMITIDO
    // ==============================

    http_response_code(405);

    echo json_encode([
        "sucesso" => false,
        "mensagem" => "Método não permitido."
    ]);

} catch (Throwable $erro) {

    http_response_code(400);

    echo json_encode([
        "sucesso" => false,
        "mensagem" => $erro->getMessage()
    ]);

}

?>


<?php
require_once __DIR__ . "/conexao.php";

/* =========================================
   CADASTRAR USUÁRIO
========================================= */

function cadastrarUsuario($nome, $email, $senha, $tipo_usuario, $permissoes) {
    global $con;

    try {
        $senha_cripto = password_hash($senha, PASSWORD_DEFAULT);

        $sql = "INSERT INTO usuario (nome, email, senha, tipo_usuario, permissoes)
                VALUES (?, ?, ?, ?, ?)";

        $stmt = $con->prepare($sql);
        $stmt->bind_param(
            "sssss",
            $nome,
            $email,
            $senha_cripto,
            $tipo_usuario,
            $permissoes
        );

        $resultado = $stmt->execute();
        $stmt->close();

        return $resultado;

    } catch (Throwable $e) {
        error_log("Erro ao cadastrar usuário: " . $e->getMessage());
        return false;
    }
}

/* =========================================
   LISTAR USUÁRIOS
========================================= */

function listarUsuarios() {
    global $con;

    $sql = "SELECT id, nome, email, tipo_usuario, permissoes, criado
            FROM usuario";

    $resultado = $con->query($sql);

    return $resultado->fetch_all(MYSQLI_ASSOC);
}

/* =========================================
   OBTER USUÁRIO POR ID
========================================= */

function obterUsuario($id) {
    global $con;

    $sql = "SELECT id, nome, email, tipo_usuario, permissoes
            FROM usuario
            WHERE id = ?";

    $stmt = $con->prepare($sql);
    $stmt->bind_param("i", $id);
    $stmt->execute();

    $usuario = $stmt->get_result()->fetch_assoc();

    $stmt->close();

    return $usuario ?: null;
}

/* =========================================
   ATUALIZAR USUÁRIO
========================================= */

function atualizarUsuario($id, $nome, $email, $senha, $tipo_usuario, $permissoes) {
    global $con;

    try {

        // Se digitou uma nova senha, atualiza junto
        if ($senha !== "") {

            $senha_cripto = password_hash($senha, PASSWORD_DEFAULT);

            $sql = "UPDATE usuario
                    SET nome = ?,
                        email = ?,
                        senha = ?,
                        tipo_usuario = ?,
                        permissoes = ?
                    WHERE id = ?";

            $stmt = $con->prepare($sql);

            $stmt->bind_param(
                "sssssi",
                $nome,
                $email,
                $senha_cripto,
                $tipo_usuario,
                $permissoes,
                $id
            );

        } else {

            // Mantém a senha atual
            $sql = "UPDATE usuario
                    SET nome = ?,
                        email = ?,
                        tipo_usuario = ?,
                        permissoes = ?
                    WHERE id = ?";

            $stmt = $con->prepare($sql);

            $stmt->bind_param(
                "ssssi",
                $nome,
                $email,
                $tipo_usuario,
                $permissoes,
                $id
            );
        }

        $resultado = $stmt->execute();

        $stmt->close();

        return $resultado;

    } catch (Throwable $e) {
        error_log("Erro ao atualizar usuário: " . $e->getMessage());
        return false;
    }
}

/* =========================================
   EXCLUIR USUÁRIO
========================================= */

function excluirUsuario($id) {
    global $con;

    try {
        $sql = "DELETE FROM usuario WHERE id = ?";

        $stmt = $con->prepare($sql);
        $stmt->bind_param("i", $id);

        $resultado = $stmt->execute();

        $stmt->close();

        return $resultado;

    } catch (Throwable $e) {
        error_log("Erro ao excluir usuário: " . $e->getMessage());
        return false;
    }
}
?>

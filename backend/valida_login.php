
<?php

session_start();

require_once __DIR__ . "/conexao.php";

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = trim($_POST['email'] ?? '');
    $senha = trim($_POST['senha'] ?? '');

    if (empty($email) || empty($senha)) {
        echo "Campos obrigatórios";
        exit;
    }

    $sql = "SELECT * FROM usuario WHERE email = ?";
    $stmt = $con->prepare($sql);
    $stmt->bind_param("s",$email);

    $stmt->execute();

    $resultado = $stmt->get_result();

    if ($resultado->num_rows == 1) {

        $usuario = $resultado->fetch_assoc();

        if (password_verify($senha, $usuario['senha'])) {

            $_SESSION['email'] = $usuario['email'];
            $_SESSION['nome'] = $usuario['nome'];

            header("Location: /vivadanca/admin.php");
            exit;

        } else {

            echo "Senha incorreta!";

        }

    } else {

        echo "Usuário não encontrado!";

    }

    $stmt->close();
    $con->close();
}

if(isset($_SESSION['email'])){
    if($_SESSION['email'] != ""){
        echo "logado";
    }
}
?>
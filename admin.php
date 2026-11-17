<?php
session_start();

if(isset($_SESSION['email'])){
    if($_SESSION['email'] != ""){
        header("location:/vivadanca/admin/integrante.html");
    }
}


?>
<!DOCTYPE html>
<html lang="pt-br">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login | Viva Dança</title>
    <link rel="stylesheet" href="assets/css/fernanda.css">
</head>

<body class="admin-login-page">
    <main class="admin-main admin-login-card">
        
        <!-- CABEÇALHO DO LOGIN -->
        <header class="admin-login-header">
            <div>
                <span>ÁREA RESTRITA</span>
                <h1 class="admin-login-title">Viva<em>Dança</em></h1>
                <p>Entre com suas credenciais para gerenciar o sistema.</p>
            </div>
        </header>

        <!-- FORMULÁRIO DE LOGIN -->
        <section class="integrantes-painel admin-login-panel">
            <h2>Fazer Login</h2>
            <p>Informe seu e-mail e senha cadastrados.</p>

            <form method="post" class="form-integrantes" id="auth" action="backend/valida_login.php">
                <label for="loginEmail">E-mail</label>
                <input 
                    id="loginEmail" 
                    name="email" 
                    type="email" 
                    placeholder="seuemail@exemplo.com.br" 
                    autocomplete="username" 
                    required
                >

                <label for="loginPassword">Senha</label>
                <input 
                    id="loginPassword" 
                    name="senha" 
                    type="password" 
                    placeholder="Digite sua senha" 
                    autocomplete="current-password" 
                    required
                >

                <button class="integrantes-btn admin-login-submit" type="submit">Entrar</button>
            </form>

            <div class="admin-login-back">
                <a class="admin-login-back-link" href="../">&larr; Voltar para a página inicial</a>
            </div>
        </section>
    </main>

    <footer class="admin-login-footer">
        <p>&copy; 2026 Viva Dança</p>
    </footer>
</body> 
</html>

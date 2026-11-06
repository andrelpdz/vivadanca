<!DOCTYPE html>
<html lang="pt-br">
 
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="../assets/css/admin.css">
    <title>Login | Viva Dança</title>
</head>
 
<body>
    <?php include header.php; ?>
 
    <main class="login-main">
 
        <div class="login-container">
 
            <!-- LADO ESQUERDO -->
            <section class="login-info">
 
                <div class="logo-area">
                    <img src="../assets/img/logo.png" alt="Logo Viva Dança" class="login-img">
                </div>
 
                <div class="info">
 
                    <span class="tag-bem-vindo">
                        BEM-VINDO DE VOLTA
                    </span>
 
                    <h1>
                        Tudo começa
                        <span>aqui.</span>
                    </h1>
 
                    <p>
                        Entre na sua conta para acessar
                        todos os recursos da plataforma.
                    </p>
 
                </div>
 
                <div class="info-footer">
                    <span>●</span>
                    Acesso rápido e seguro
                </div>
 
            </section>
 
            <!-- LADO DIREITO -->
            <section class="cadastro">
 
                <div class="painel-cadastro">
 
                    <div class="texto-login">
 
                        <h2>Entrar</h2>
 
                        <p>Acesse sua conta</p>
 
                    </div>
 
                    <form class="form-login" id="auth"
                        action="backend/valida_login.php" method="post">
 
                        <!-- EMAIL -->
                        <div class="input-grupo">
 
                            <label for="loginEmail">E-mail</label>
 
                            <div class="input-box">
 
                                <span class="input-icon">👤</span>
 
                                <input
                                    id="loginEmail"
                                    name="email"
                                    type="email"
                                    placeholder="seuemail@exemplo.com"
                                    autocomplete="email"
                                    required
                                >
 
                            </div>
 
                        </div>
 
                        <!-- SENHA -->
                        <div class="input-group">
 
                            <div class="senha-label">
 
                                <label for="senha">Senha</label>
 
                                <a href="#">Esqueceu?</a>
 
                            </div>
 
                            <div class="input-box">
 
                                <span class="input-icon">🗝️</span>
 
                                <input
                                    id="senha"
                                    name="senha"
                                    type="password"
                                    placeholder="Digite sua senha"
                                    autocomplete="current-password"
                                    required
                                >
 
                            </div>
 
                        </div>
 
                       
                        <div class="lembrar">
 
                            <label>
 
                                <input type="checkbox" name="remember">
 
                                <span>Lembrar de mim</span>
 
                            </label>
 
                        </div>
 
                        <!-- BOTÃO -->
                        <button type="submit" class="btn-submit">
 
                            Entrar
 
                            <span class="arrow">→</span>
 
                        </button>
 
                       
                        <div class="divisor">
                            <span>ou</span>
                        </div>
 
                        <!-- CADASTRO -->
                        <div class="registro">
 
                            <p>Ainda não possui uma conta?</p>
 
                            <a href="#">Criar uma conta</a>
 
                        </div>
 
                    </form>
 
                </div>
 
                <div class="segurança">
 
                    <span>🔒</span>
 
                    Seus dados estão protegidos e sua conexão é segura.
 
                </div>
 
            </section>
 
        </div>
 
    </main>
 
    <!-- RODAPÉ -->
    <footer>
 
        <p>&copy; 2026 Viva Dança</p>
 
        <div>
 
            <a href="#">Privacidade</a>
 
            <a href="#">Termos</a>
 
            <a href="#">Ajuda</a>
 
        </div>
 
    </footer>
 
</body>
</html>
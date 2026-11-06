<?php

include "../backend/conexao.php";

global $con;

$sql = "SELECT * FROM usuario";

$resultado = $con->query($sql);

$dados = $resultado->fetch_assoc(); 

    echo $dados['id'];
    echo $dados['nome'];
    echo $dados['email'];
    echo $dados['criado'];
    echo "<hr>";


?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="../assets/css/cadastro.css">
    <title>Document</title>
</head>

<body>
    <?php include "header.php"; ?>
    <main class="main-cadastro">

        <div class="div-cadastro">

            <section class="lado-esquerdo">

                <div class="logo-cadastro">
                    <img src="../assets/img/logo.png" alt="">
                </div>

                <div class="informacoes-cadastro">
                    <span class="muito-bem-vindo">
                        SEJA MUITO BEM-VINDO
                    </span>

                    <h1>
                        Tudo começa <span> aqui </span>
                    </h1>

                    <p>
                        Cadastre-se aqui para acessar
                        todos os recursos da plataforma.
                    </p>
                </div>

                <div class="informacoes-footer">
                    <span>●</span>
                    <p>Acesso rápido e seguro.</p>
                </div>

            </section>

            <section class="lado-direito">

                <div class="painel-cadastro-cadastro">

                    <div class="texto-cadastro">
                        <h2>
                            Entrar
                        </h2>

                        <p>
                            Acesse sua conta
                        </p>
                    </div>

                    <form class="form-cadastro" id="auth"
                        action="backend/valida_login.php" method="post">

                        <div class="input-grupo">

                            <label for="cadastroNome">Nome Completo:</label>

                            <div class="input-box">
                                 <span class="input-icon">👤</span>
 
                                <input
                                    id="cadastroNome"
                                    name="nome"
                                    type="name"
                                    placeholder="Seu nome"
                                    autocomplete="name"
                                    required
                                >
                            </div>
                        </div>

                        <div class="input-grupo">

                            <label for="cadastroTelefone">Telefone:</label>

                            <div class="input-box">
                                 <span class="input-icon">👤</span>
 
                                <input
                                    id="telefone"
                                    name="telefone"
                                    type="tel"
                                    placeholder="(00) 00000-0000"
                                    autocomplete="cc-number"
                                    required
                                >
                            </div>
                        </div>

                        <div class="input-grupo">

                            <label for="cadastroData">Data de nascimento:</label>

                            <div class="input-box">
                                 <span class="input-icon">👤</span>
 
                                <input
                                    id="data"
                                    name="data"
                                    type="date"
                                    placeholder="00/00/0000"
                                    autocomplete=""
                                    required
                                >
                            </div>
                        </div>
 
                        <!-- EMAIL -->
                        <div class="input-grupo">
 
                            <label for="cadastroEmail">E-mail:</label>
 
                            <div class="input-box">
 
                                <span class="input-icon">👤</span>
 
                                <input
                                    id="cadastroEmail"
                                    name="email"
                                    type="email"
                                    placeholder="seuemail@exemplo.com"
                                    autocomplete="email"
                                    required
                                >
 
                            </div>
 
                        </div>
 
                        <!-- SENHA -->
                        <div class="input-grupo">
 
                            <div class="senha-div">
 
                                <label for="cadastroSenha">Senha</label>
 
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

                        <div class="input-grupo">
 
                            <div class="senha-div">
 
                                <label for="cadastroSenha">Confirme sua senha</label>
 
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
 
                            Cadastre-se
 
                            <span class="arrow">→</span>
 
                        </button>
 
                       
                        <div class="divisor">
                            <span>ou</span>
                        </div>
 
                        <!-- CADASTRO -->
                        <div class="registro">
 
                            <p>Já tem uma conta?</p>
 
                            <a href="login.html">Entrar</a>
 
                        </div>
 
                    </form>

                    <div class="segurança">
 
                    <span>🔒</span>
 
                    Seus dados estão protegidos e sua conexão é segura.
 
                    </div>

                </div>

            </section>

        </div>

    </main>

<footer>
 
        <p>&copy; 2026 Viva Dança</p>
 
        <div>
 
            <a href="#">Privacidade</a>
 
            <a href="#">Termos</a>
 
            <a href="#">Ajuda</a>
 
        </div>
 
</footer>

</body>

<script>
  const inputTelefone = document.getElementById('telefone');

  inputTelefone.addEventListener('input', function (e) {
    let valor = e.target.value.replace(/\D/g, ''); // Remove tudo que não for dígito

    if (valor.length > 11) {
      valor = valor.slice(0, 11); // Limita a 11 dígitos
    }

    // Aplica a formatação dinamicamente
    if (valor.length > 10) {
      // Celular com 9º dígito: (11) 91234-5678
      valor = valor.replace(/^(\d{2})(\d{5})(\d{4}).*/, '($1) $2-$3');
    } else if (valor.length > 6) {
      // Fixo ou celular em digitação: (11) 1234-5678
      valor = valor.replace(/^(\d{2})(\d{4})(\d{0,4}).*/, '($1) $2-$3');
    } else if (valor.length > 2) {
      // DDD digitado: (11) 1234
      valor = valor.replace(/^(\d{2})(\d{0,5})/, '($1) $2');
    } else if (valor.length > 0) {
      // Apenas DDD inicial: (11
      valor = valor.replace(/^(\d*)/, '($1');
    }

    e.target.value = valor;
  });
</script>

</html>
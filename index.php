<?php
$pagina = isset($_GET['pagina']) ? $_GET['pagina'] : "home";
$titulo = isset($_GET['titulo']) ? $_GET['titulo'] : "Sorocaba 60+";

$caminho = __DIR__ . "/pages/" . $pagina . ".html";
$raiz = str_contains($_SERVER['HTTP_HOST'], 'localhost') ? "/projetodanca" : "" ;

$v = md5(date('Y-m-d H:m:s'));
?>
<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <?php if ($pagina === "trajetoria"): ?><link rel="stylesheet" href="assets/css/linha_tempo.css?v=<?=$v;?>"><?php endif; ?>
    <link rel="stylesheet" href="assets/css/style.css?v=<?=$v;?>">

    <title>Viva Dança - <?=$titulo?></title>
    <script src="https://unpkg.com/lucide@latest"></script>
</head>
<body class="<?= $pagina === 'home' ? 'pagina-home' : ($pagina === 'sobre' ? 'pagina-sobre' : ($pagina === 'integrantes' ? 'pagina-integrantes' : ($pagina === 'integrante' ? 'pagina-integrante' : ($pagina === 'galeria' ? 'pagina-galeria' : '')))) ?>">
    <header class="container-header">
        <img src="assets/img/logo.png" class="logo">
        <div>
            <img src="assets/img/ico_menu.png" id="icoMenu">
            <nav>
                <ul>
                    <li><a href="<?=$raiz;?>/?pagina=sobre">Sobre</a></li>
                    <li><a href="<?=$raiz;?>/?pagina=trajetoria">Trajetória</a></li>
                    <li><a href="<?=$raiz;?>/?pagina=integrantes">Integrantes</a></li>
                    <li><a href="<?=$raiz;?>/?pagina=conquistas">Premiações</a></li>
                    <li><a href="<?=$raiz;?>/?pagina=contato">Fale Conosco</a></li>
                </ul>                
            </nav>
        </div>
    </header>

    <?php require_once $caminho; ?>

    <footer class="container-footer">
        <div class="footer-topo">
            <img src="assets/img/logo.png" class="footer-logo">

            <!-- Uma coluna para cada grupo de links.
                 O título é o link da página; os itens de baixo ainda apontam para a mesma página. -->
            <div class="footer-menu">
                <div class="footer-coluna">
                    <a href="<?=$raiz;?>/">Home</a>
                    <a href="<?=$raiz;?>/?pagina=eventos">Eventos</a>
                    <a href="<?=$raiz;?>/?pagina=contato">Fale Conosco</a>
                </div>
                <div class="footer-coluna">
                    <a href="<?=$raiz;?>/?pagina=trajetoria">Trajetória</a>
                    <a href="<?=$raiz;?>/?pagina=integrantes">Integrantes</a>
                    <a href="<?=$raiz;?>/?pagina=conquistas">Premiações</a>
                </div>
            </div>
        </div>

        <!-- Ícones das redes (letras por enquanto; depois troque por imagens) -->
        <div class="footer-social">
            <a href="#">IG</a>
            <a href="#">WA</a>
            <a href="#">YT</a>
            <a href="#">FB</a>
        </div>

        <p class="footer-copy">©</p>
    </footer>

    <script src="assets/js/script.js"></script>
</body>
</html>

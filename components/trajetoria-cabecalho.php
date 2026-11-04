<?php
$itensTrajetoria = [
    'trajetoria' => 'LINHA DO TEMPO',
    'integrantes' => 'INTEGRANTES',
    'coreografias' => 'COREOGRAFIAS',
    'conquistas' => 'CONQUISTAS',
    'galeria' => 'GALERIA',
];
?>
<section class="trajetoria-capa" aria-labelledby="trajetoria-capa-titulo">
    <div class="trajetoria-capa__conteudo">
        <h1 id="trajetoria-capa-titulo">TRAJETÓRIA</h1>
        <p>Pessoas, movimentos e histórias<br>que permanecem em cena.</p>
    </div>
</section>
<nav class="trajetoria-submenu" aria-label="Navegação da trajetória">
    <ul>
        <?php foreach ($itensTrajetoria as $paginaTrajetoria => $rotuloTrajetoria): ?>
            <li><a href="?pagina=<?= htmlspecialchars($paginaTrajetoria, ENT_QUOTES, 'UTF-8') ?>"<?= $pagina === $paginaTrajetoria ? ' aria-current="page"' : '' ?>><?= htmlspecialchars($rotuloTrajetoria, ENT_QUOTES, 'UTF-8') ?></a></li>
        <?php endforeach; ?>
    </ul>
</nav>

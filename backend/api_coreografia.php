<?php
require_once __DIR__ . '/coreografia.php';
require_once __DIR__ . '/foto.php';

try {
    $metodo = $_SERVER['REQUEST_METHOD'];
    if ($metodo === 'GET') {
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode(['sucesso' => true, 'coreografias' => listarCoreografias()]);
        exit;
    }
    if ($metodo === 'POST') {
        $titulo = trim($_POST['titulo'] ?? '');
        $descricao = trim($_POST['descricao'] ?? '');
        $data = trim($_POST['data_criacao'] ?? '');
        $modalidade = trim($_POST['modalidade'] ?? '');
        if ($titulo === '' || $data === '' || $modalidade === '') throw new Exception('Preencha título, data e modalidade.');
        $id = filter_var($_POST['id'] ?? '', FILTER_VALIDATE_INT);
        $atualizar = ($_POST['btnEnviar'] ?? '') === 'Atualizar';
        $atual = $atualizar && $id ? obterCoreografia($id) : null;
        if ($atualizar && !$atual) throw new Exception('Coreografia não encontrada.');
        $foto = $atual['foto'] ?? null;
        $novaFoto = null;
        if (isset($_FILES['foto']) && $_FILES['foto']['error'] !== UPLOAD_ERR_NO_FILE) {
            $novaFoto = salvarFoto('coreografias', $_FILES['foto']);
            $foto = $novaFoto;
        }
        try {
            $ok = $atualizar ? atualizarCoreografia($id, $titulo, $descricao, $data, $modalidade, $foto)
                : cadastrarCoreografia($titulo, $descricao, $data, $modalidade, $foto);
            if (!$ok) throw new Exception('Não foi possível salvar a coreografia.');
        } catch (Throwable $e) {
            if ($novaFoto) excluirFoto('coreografias', $novaFoto);
            throw $e;
        }
        header('Location: ../admin/coreografia.html');
        exit;
    }
    if ($metodo === 'DELETE') {
        $id = filter_input(INPUT_GET, 'id', FILTER_VALIDATE_INT);
        if (!$id || !excluirCoreografia($id)) throw new Exception('Não foi possível excluir a coreografia.');
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode(['sucesso' => true]);
        exit;
    }
    http_response_code(405);
    throw new Exception('Método não permitido.');
} catch (Throwable $e) {
    if (http_response_code() < 400) http_response_code(400);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode(['sucesso' => false, 'erro' => $e->getMessage()]);
}

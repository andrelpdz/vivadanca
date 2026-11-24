-- Viva Dança Sorocaba 60+ | Importar no banco pi_danca pelo phpMyAdmin.
-- Requer as tabelas eventos, coreografias e conquistas do projeto.
-- Mantém os vínculos e fotos preenchidas nos registros existentes.
-- IDs 55, 59, 60, 62, 67, 73, 74 e 75: associações prováveis do inventário.
-- IDs 76 e 77: resultados confirmados nas fontes, em eventos já cadastrados.
-- Sem foto comprovada ou associação específica: 40–54, 56–58, 61, 63–66, 68–72.
-- TR-031/032: mesma peça, com divergência de nome e local do evento.
-- TR-047/048: dois primeiros lugares, sem indicação de qual foto corresponde a cada coreografia.
-- Eventos adicionais (EV-094/095/097/098) ficaram fora desta importação dos eventos já cadastrados.
SET NAMES utf8mb4;
START TRANSACTION;

-- Mês e ano na fonte: dia 01.
UPDATE eventos SET data_termino = IF(DATE(data_termino) = DATE(data_inicio), CONCAT('2015-10-01 ', TIME(data_termino)), data_termino), data_inicio = CONCAT('2015-10-01 ', TIME(data_inicio)) WHERE id = 5 AND nome = 'Participação no evento Ritmos – Jd. Simmus.' AND DATE_FORMAT(data_inicio, '%Y-%m') = LEFT('2015-10-01', 7) AND DAY(data_inicio) <> 1;
UPDATE eventos SET data_termino = IF(DATE(data_termino) = DATE(data_inicio), CONCAT('2016-04-01 ', TIME(data_termino)), data_termino), data_inicio = CONCAT('2016-04-01 ', TIME(data_inicio)) WHERE id = 6 AND nome = 'Jogos Regionais do Idoso (JORI) – etapa de Avaré' AND DATE_FORMAT(data_inicio, '%Y-%m') = LEFT('2016-04-01', 7) AND DAY(data_inicio) <> 1;
UPDATE eventos SET data_termino = IF(DATE(data_termino) = DATE(data_inicio), CONCAT('2016-06-01 ', TIME(data_termino)), data_termino), data_inicio = CONCAT('2016-06-01 ', TIME(data_inicio)) WHERE id = 7 AND nome = 'JAI – Barretos.' AND DATE_FORMAT(data_inicio, '%Y-%m') = LEFT('2016-06-01', 7) AND DAY(data_inicio) <> 1;
UPDATE eventos SET data_termino = IF(DATE(data_termino) = DATE(data_inicio), CONCAT('2016-07-01 ', TIME(data_termino)), data_termino), data_inicio = CONCAT('2016-07-01 ', TIME(data_inicio)) WHERE id = 8 AND nome = 'Companhia da Dança – Joinville.' AND DATE_FORMAT(data_inicio, '%Y-%m') = LEFT('2016-07-01', 7) AND DAY(data_inicio) <> 1;
UPDATE eventos SET data_termino = IF(DATE(data_termino) = DATE(data_inicio), CONCAT('2017-07-01 ', TIME(data_termino)), data_termino), data_inicio = CONCAT('2017-07-01 ', TIME(data_inicio)) WHERE id = 11 AND nome = 'Escola COC – Santa Rosália - Cartas (convidados).' AND DATE_FORMAT(data_inicio, '%Y-%m') = LEFT('2017-07-01', 7) AND DAY(data_inicio) <> 1;
UPDATE eventos SET data_termino = IF(DATE(data_termino) = DATE(data_inicio), CONCAT('2017-11-01 ', TIME(data_termino)), data_termino), data_inicio = CONCAT('2017-11-01 ', TIME(data_inicio)) WHERE id = 18 AND nome = 'Festival de Dança de Piratuba/SC.' AND DATE_FORMAT(data_inicio, '%Y-%m') = LEFT('2017-11-01', 7) AND DAY(data_inicio) <> 1;
UPDATE eventos SET data_termino = IF(DATE(data_termino) = DATE(data_inicio), CONCAT('2018-10-01 ', TIME(data_termino)), data_termino), data_inicio = CONCAT('2018-10-01 ', TIME(data_inicio)) WHERE id = 23 AND nome = 'Apresentação no Colégio OSE durante o McDia Feliz' AND DATE_FORMAT(data_inicio, '%Y-%m') = LEFT('2018-10-01', 7) AND DAY(data_inicio) <> 1;
UPDATE eventos SET data_termino = IF(DATE(data_termino) = DATE(data_inicio), CONCAT('2022-07-01 ', TIME(data_termino)), data_termino), data_inicio = CONCAT('2022-07-01 ', TIME(data_inicio)) WHERE id = 46 AND nome = 'Festival de Dança de Joinville' AND DATE_FORMAT(data_inicio, '%Y-%m') = LEFT('2022-07-01', 7) AND DAY(data_inicio) <> 1;
UPDATE eventos SET data_termino = IF(DATE(data_termino) = DATE(data_inicio), CONCAT('2025-02-01 ', TIME(data_termino)), data_termino), data_inicio = CONCAT('2025-02-01 ', TIME(data_inicio)) WHERE id = 77 AND nome = 'Passo de Arte – Indaiatuba.' AND DATE_FORMAT(data_inicio, '%Y-%m') = LEFT('2025-02-01', 7) AND DAY(data_inicio) <> 1;
UPDATE eventos SET data_termino = IF(DATE(data_termino) = DATE(data_inicio), CONCAT('2025-07-01 ', TIME(data_termino)), data_termino), data_inicio = CONCAT('2025-07-01 ', TIME(data_inicio)) WHERE id = 83 AND nome = 'Joinville.' AND DATE_FORMAT(data_inicio, '%Y-%m') = LEFT('2025-07-01', 7) AND DAY(data_inicio) <> 1;
UPDATE eventos SET data_termino = IF(DATE(data_termino) = DATE(data_inicio), CONCAT('2025-08-01 ', TIME(data_termino)), data_termino), data_inicio = CONCAT('2025-08-01 ', TIME(data_inicio)) WHERE id = 84 AND nome = 'Festa Japonesa – apresentação em Sorocaba' AND DATE_FORMAT(data_inicio, '%Y-%m') = LEFT('2025-08-01', 7) AND DAY(data_inicio) <> 1;

INSERT INTO conquistas (id, evento_id, coreografia_id, nome, descricao, foto) VALUES
(11, 50, 28, '1º lugar', '', 'conquista_tr_004.jpg'),
(12, 27, 29, '1º lugar', 'Coreografia a confirmar com o grupo', 'conquista_tr_015.jpg'),
(13, 20, 29, '1º lugar', 'Coreografia a confirmar com o grupo', 'conquista_tr_016.jpg'),
(14, 77, 29, '2º lugar', 'Coreografia a confirmar com o grupo', 'conquista_tr_020.jpg'),
(15, 87, 29, '3º lugar — 60 Mais', '60 Mais. Coreografia a confirmar com o grupo', 'conquista_tr_021.jpg'),
(16, 77, 29, '1º lugar', 'Coreografia a confirmar com o grupo', 'conquista_tr_022.jpg'),
(17, 77, 29, '1º lugar — Melhor Grupo', 'Melhor Grupo. Coreografia a confirmar com o grupo', 'conquista_tr_024.jpg'),
(18, 87, 29, '2º lugar — 60 Mais', '60 Mais. Coreografia a confirmar com o grupo', 'conquista_tr_026.jpg'),
(19, 29, 29, '2º lugar — Danças populares – adulto – conjunto', 'Danças populares – adulto – conjunto. Coreografia a confirmar com o grupo', 'conquista_tr_033.jpg'),
(20, 29, 29, 'Inspiração — Prêmio especial', 'Prêmio especial. Coreografia a confirmar com o grupo', 'conquista_tr_035.jpg'),
(21, 29, 29, '3º lugar — Estilo livre – adulto – conjunto', 'Estilo livre – adulto – conjunto. Coreografia a confirmar com o grupo', 'conquista_tr_036.jpg'),
(22, 18, 29, '2º lugar — Dança popular folclore', 'Dança popular folclore. Coreografia a confirmar com o grupo', 'conquista_tr_037.jpg'),
(23, 18, 29, '2º lugar — Dança coreográfica', 'Dança coreográfica. Coreografia a confirmar com o grupo', 'conquista_tr_038.jpg'),
(24, 18, 29, 'Participação', 'Coreografia a confirmar com o grupo', 'conquista_tr_039.jpg'),
(25, 18, 29, 'Revelação — Coreógrafo', 'Coreógrafo. Coreografia a confirmar com o grupo', 'conquista_tr_040.jpg'),
(26, 25, 29, 'Participação', 'Coreografia a confirmar com o grupo', 'conquista_tr_042.jpg'),
(27, 59, 30, '1º lugar — Coreografia Ritmo Caliente', 'Coreografia Ritmo Caliente', 'conquista_tr_043.jpg'),
(28, 59, 29, 'Destaque Maior Nota — Conjunto', 'Conjunto. Coreografia a confirmar com o grupo', 'conquista_tr_044.jpg'),
(29, 82, 29, 'Indicação para apresentações em Orlando — Seleção internacional', 'Certificado de seleção e indicação à Talent Tour para apresentações em Orlando; não comprova apresentação realizada.', 'conquista_tr_050.jpg'),
(30, 86, 29, 'Indicação ao Prêmio Destaque FNDC 2025 — Melhor Grupo', 'Indicação ao Prêmio Destaque FNDC 2025 na categoria Melhor Grupo; não é registro de vitória no prêmio.', 'conquista_tr_051.jpg'),
(31, 10, 27, '1º lugar — Lancem as Cartas', 'Lancem as Cartas', 'conquista_tr_053.jpg'),
(32, 90, 29, '1º lugar', 'Coreografia a confirmar com o grupo', 'conquista_tr_055.jpg'),
(33, 24, 29, '2º lugar — Danças coreográficas – livre', 'Danças coreográficas – livre. Coreografia a confirmar com o grupo', 'conquista_tr_056.jpg'),
(34, 42, 29, '3º lugar', 'Coreografia a confirmar com o grupo', 'conquista_tr_059.jpg'),
(35, 42, 29, '1º lugar', 'Coreografia a confirmar com o grupo', 'conquista_tr_060.jpg'),
(36, 36, 29, '2º lugar', 'Coreografia a confirmar com o grupo', 'conquista_tr_061.jpg'),
(37, 9, 29, 'Participação — Participação', 'Participação. Coreografia a confirmar com o grupo', 'conquista_tr_063.jpg'),
(38, 24, 29, '1º lugar — Danças folclóricas', 'Danças folclóricas. Coreografia a confirmar com o grupo', 'conquista_tr_067.jpg'),
(39, 82, 29, '2º lugar', 'Coreografia a confirmar com o grupo', 'conquista_tr_068.jpg'),
(40, 6, 31, 'Medalha de Ouro – Coreografia \"Lista Vip\"', 'Premiação registrada no caderno de Marili. ', ''),
(41, 7, 29, 'Medalha de Bronze', 'Premiação registrada no caderno de Marili. Coreografia a confirmar com o grupo.', ''),
(42, 8, 32, '1º Lugar – Dança de Salão (Anos 60)', 'Premiação registrada no caderno de Marili. ', ''),
(43, 8, 31, '1º Lugar – Dança Criativa (Lista Vip)', 'Premiação registrada no caderno de Marili. ', ''),
(44, 8, 33, '2º Lugar – Dança Folclórica (Afrikan)', 'Premiação registrada no caderno de Marili. ', ''),
(45, 8, 29, 'Prêmio de Melhor Bailarino', 'Premiação registrada no caderno de Marili. Coreografia a confirmar com o grupo.', ''),
(46, 8, 29, 'Prêmio de Melhor Grupo', 'Premiação registrada no caderno de Marili. Coreografia a confirmar com o grupo.', ''),
(47, 8, 29, 'Prêmio Revelação Coreógrafo', 'Premiação registrada no caderno de Marili. Coreografia a confirmar com o grupo.', ''),
(48, 14, 29, '1º Lugar. Prêmio São Paulo - Cartas', 'Premiação registrada no caderno de Marili. Coreografia a confirmar com o grupo.', ''),
(49, 22, 31, '1º Lugar – Lista Vip', 'Premiação registrada no caderno de Marili. ', ''),
(50, 22, 29, 'Premiação: Carta de crédito para 2019', 'Premiação registrada no caderno de Marili. Coreografia a confirmar com o grupo.', ''),
(51, 28, 28, '1º Lugar – Bollywood Dance', 'Premiação registrada no caderno de Marili. ', ''),
(52, 33, 28, '1º Lugar – Bollywood Dance', 'Premiação registrada no caderno de Marili. ', ''),
(53, 33, 29, 'Medalha para 2020', 'Premiação registrada no caderno de Marili. Coreografia a confirmar com o grupo.', ''),
(54, 35, 29, '1º Lugar', 'Premiação registrada no caderno de Marili. Coreografia a confirmar com o grupo.', ''),
(55, 37, 29, 'Medalha de Ouro', 'Premiação registrada no caderno de Marili. Coreografia a confirmar com o grupo.', 'conquista_tr_001.jpg'),
(56, 39, 29, 'Medalha de Ouro', 'Premiação registrada no caderno de Marili. Coreografia a confirmar com o grupo.', ''),
(57, 43, 28, '1º Lugar – Bollywood', 'Premiação registrada no caderno de Marili. ', ''),
(58, 45, 29, '2º Lugar', 'Premiação registrada no caderno de Marili. Coreografia a confirmar com o grupo.', ''),
(59, 48, 29, '1º lugar', 'Premiação registrada no caderno de Marili. Coreografia a confirmar com o grupo.', 'conquista_tr_002.jpg'),
(60, 48, 29, 'Melhor Figurino Original', 'Premiação registrada no caderno de Marili. Coreografia a confirmar com o grupo.', 'conquista_tr_064.jpg'),
(61, 52, 29, '1º Lugar', 'Premiação registrada no caderno de Marili. Coreografia a confirmar com o grupo.', ''),
(62, 52, 29, 'Troféu Destaque', 'Premiação registrada no caderno de Marili. Coreografia a confirmar com o grupo.', 'conquista_tr_014.jpg'),
(63, 62, 29, '1º Lugar – Salsa', 'Premiação registrada no caderno de Marili. Coreografia a confirmar com o grupo.', ''),
(64, 62, 29, '1º Lugar – Irlandesa', 'Premiação registrada no caderno de Marili. Coreografia a confirmar com o grupo.', ''),
(65, 64, 29, '1º Lugar – Salsa', 'Premiação registrada no caderno de Marili. Coreografia a confirmar com o grupo.', ''),
(66, 64, 29, '1º Lugar – Irlandesa', 'Premiação registrada no caderno de Marili. Coreografia a confirmar com o grupo.', ''),
(67, 66, 29, '3º Lugar', 'Premiação registrada no caderno de Marili. Coreografia a confirmar com o grupo.', 'conquista_tr_034.jpg'),
(68, 66, 29, 'Prêmio Destaque (R$ 2.000,00)', 'Premiação registrada no caderno de Marili. Coreografia a confirmar com o grupo.', ''),
(69, 69, 29, '2º Lugar – Tap Dance, Swing e Glamour', 'Premiação registrada no caderno de Marili. Coreografia a confirmar com o grupo.', ''),
(70, 69, 27, '3º Lugar – Lancem as Cartas', 'Premiação registrada no caderno de Marili. ', ''),
(71, 79, 25, '1º Lugar – Tap Dance e Glamour', 'Premiação registrada no caderno de Marili. ', ''),
(72, 79, 28, '1º Lugar – Bollywood Dance', 'Premiação registrada no caderno de Marili. ', ''),
(73, 79, 29, 'Destaque Sapateado', 'Premiação registrada no caderno de Marili. Coreografia a confirmar com o grupo.', 'conquista_tr_049.jpg'),
(74, 86, 29, '1º lugar', 'FNDC 2025. Colocação registrada nas fontes; coreografia e foto correspondente a confirmar.', 'conquista_tr_019.jpg'),
(75, 86, 29, '2º lugar', 'FNDC 2025. Colocação registrada nas fontes; coreografia e foto correspondente a confirmar.', 'conquista_tr_009.jpg'),
(76, 47, 28, '3º lugar — Bollywood Dance', 'Estadual em Pindamonhangaba. Dança popular folclórica, conjunto 60+.', 'conquista_tr_027.jpg'),
(77, 59, 29, '1º lugar — Salsa Dance', 'Coreografia Salsa Dance.', 'conquista_tr_046.jpg')
ON DUPLICATE KEY UPDATE foto = IF(
    conquistas.evento_id = VALUES(evento_id)
    AND conquistas.coreografia_id = VALUES(coreografia_id)
    AND conquistas.nome = VALUES(nome)
    AND (conquistas.foto IS NULL OR TRIM(conquistas.foto) = '')
    AND VALUES(foto) <> '',
    VALUES(foto),
    conquistas.foto
);
COMMIT;

-- Conferência dos registros ainda sem foto.
SELECT c.id, c.nome AS conquista, e.nome AS evento
FROM conquistas c JOIN eventos e ON e.id = c.evento_id
WHERE c.foto IS NULL OR TRIM(c.foto) = ''
ORDER BY c.id;

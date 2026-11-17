-- Executar uma vez em outros ambientes, se a coluna ainda nao existir.
ALTER TABLE coreografias ADD COLUMN foto VARCHAR(255) NULL DEFAULT NULL;

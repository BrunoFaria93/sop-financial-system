-- Execute este script para configurar o banco
-- Comando: psql -U postgres -h localhost -f scripts/00-setup-database.sql

-- 1. Criar o banco de dados
CREATE DATABASE sop_financial_system;

-- 2. Conectar ao banco (no psql use: \c sop_financial_system)

-- 3. Verificar se funcionou
SELECT 'PostgreSQL 17 está funcionando!' as status, version();

-- 4. Mostrar bancos existentes
SELECT datname FROM pg_database WHERE datistemplate = false;

-- Script para testar a conexão com PostgreSQL
-- Execute este comando no terminal após instalar PostgreSQL:
-- psql -U postgres -h localhost

-- 1. Criar o banco de dados
CREATE DATABASE sop_financial_system;

-- 2. Conectar ao banco criado
\c sop_financial_system;

-- 3. Testar se está funcionando
SELECT 'PostgreSQL está funcionando!' as status;

-- 4. Ver a versão
SELECT version();

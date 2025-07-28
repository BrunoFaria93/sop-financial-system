-- =============================================
-- SISTEMA DE CONTROLE FINANCEIRO SOP
-- Scripts de Criação do Banco de Dados
-- =============================================

-- 1. Criação do Banco de Dados
CREATE DATABASE sop_financial_system;

-- Conectar ao banco criado
\c sop_financial_system;

-- 2. Criação das Tabelas

-- Tabela de Despesas
CREATE TABLE despesas (
    id BIGSERIAL PRIMARY KEY,
    numero_protocolo VARCHAR(20) UNIQUE NOT NULL,
    tipo_despesa VARCHAR(50) NOT NULL CHECK (tipo_despesa IN ('Obra de Edificação', 'Obra de Rodovias', 'Outros')),
    data_protocolo TIMESTAMP NOT NULL,
    data_vencimento DATE NOT NULL,
    credor VARCHAR(255) NOT NULL,
    descricao TEXT NOT NULL,
    valor DECIMAL(15,2) NOT NULL CHECK (valor > 0),
    status VARCHAR(30) DEFAULT 'Aguardando Empenho' CHECK (status IN ('Aguardando Empenho', 'Parcialmente Empenhada', 'Aguardando Pagamento', 'Parcialmente Paga', 'Paga')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Empenhos
CREATE TABLE empenhos (
    id BIGSERIAL PRIMARY KEY,
    numero_empenho VARCHAR(12) UNIQUE NOT NULL,
    data_empenho DATE NOT NULL,
    valor DECIMAL(15,2) NOT NULL CHECK (valor > 0),
    observacao TEXT,
    despesa_id BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (despesa_id) REFERENCES despesas(id) ON DELETE RESTRICT
);

-- Tabela de Pagamentos
CREATE TABLE pagamentos (
    id BIGSERIAL PRIMARY KEY,
    numero_pagamento VARCHAR(12) UNIQUE NOT NULL,
    data_pagamento DATE NOT NULL,
    valor DECIMAL(15,2) NOT NULL CHECK (valor > 0),
    observacao TEXT,
    empenho_id BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (empenho_id) REFERENCES empenhos(id) ON DELETE RESTRICT
);

-- 3. Criação de Índices para Performance
CREATE INDEX idx_despesas_numero_protocolo ON despesas(numero_protocolo);
CREATE INDEX idx_despesas_status ON despesas(status);
CREATE INDEX idx_despesas_data_vencimento ON despesas(data_vencimento);

CREATE INDEX idx_empenhos_numero ON empenhos(numero_empenho);
CREATE INDEX idx_empenhos_despesa_id ON empenhos(despesa_id);
CREATE INDEX idx_empenhos_data ON empenhos(data_empenho);

CREATE INDEX idx_pagamentos_numero ON pagamentos(numero_pagamento);
CREATE INDEX idx_pagamentos_empenho_id ON pagamentos(empenho_id);
CREATE INDEX idx_pagamentos_data ON pagamentos(data_pagamento);

-- 4. Triggers para atualização automática de timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_despesas_updated_at BEFORE UPDATE ON despesas 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_empenhos_updated_at BEFORE UPDATE ON empenhos 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_pagamentos_updated_at BEFORE UPDATE ON pagamentos 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 5. Dados de Exemplo para Testes
INSERT INTO despesas (numero_protocolo, tipo_despesa, data_protocolo, data_vencimento, credor, descricao, valor) VALUES
('43022.123456/2025-01', 'Obra de Edificação', '2025-01-15 10:30:00', '2025-06-15', 'Construtora ABC Ltda', 'Construção de escola municipal', 500000.00),
('43023.789012/2025-02', 'Obra de Rodovias', '2025-01-20 14:15:00', '2025-08-20', 'Pavimentadora XYZ S.A.', 'Pavimentação da Rua Principal', 300000.00),
('43024.345678/2025-03', 'Outros', '2025-01-25 09:45:00', '2025-05-25', 'Fornecedor Materiais Ltda', 'Aquisição de equipamentos', 150000.00);

INSERT INTO empenhos (numero_empenho, data_empenho, valor, observacao, despesa_id) VALUES
('2025NE0001', '2025-01-16', 200000.00, 'Primeira parcela da obra', 1),
('2025NE0002', '2025-01-21', 100000.00, 'Pavimentação - primeira etapa', 2),
('2025NE0003', '2025-01-26', 150000.00, 'Equipamentos completos', 3);

INSERT INTO pagamentos (numero_pagamento, data_pagamento, valor, observacao, empenho_id) VALUES
('2025NP0001', '2025-01-17', 100000.00, 'Pagamento inicial da obra', 1),
('2025NP0002', '2025-01-22', 50000.00, 'Parcial da pavimentação', 2);

-- 6. Views Úteis

-- View para relatório completo de despesas
CREATE VIEW vw_despesas_completas AS
SELECT 
    d.id,
    d.numero_protocolo,
    d.tipo_despesa,
    d.data_protocolo,
    d.data_vencimento,
    d.credor,
    d.descricao,
    d.valor as valor_despesa,
    d.status,
    COALESCE(SUM(e.valor), 0) as total_empenhado,
    COALESCE(SUM(p.valor), 0) as total_pago,
    (d.valor - COALESCE(SUM(e.valor), 0)) as saldo_empenhar,
    (COALESCE(SUM(e.valor), 0) - COALESCE(SUM(p.valor), 0)) as saldo_pagar
FROM despesas d
LEFT JOIN empenhos e ON d.id = e.despesa_id
LEFT JOIN pagamentos p ON e.id = p.empenho_id
GROUP BY d.id, d.numero_protocolo, d.tipo_despesa, d.data_protocolo, 
         d.data_vencimento, d.credor, d.descricao, d.valor, d.status;

-- View para controle de empenhos
CREATE VIEW vw_empenhos_detalhados AS
SELECT 
    e.id,
    e.numero_empenho,
    e.data_empenho,
    e.valor as valor_empenho,
    e.observacao,
    d.numero_protocolo,
    d.credor,
    COALESCE(SUM(p.valor), 0) as total_pago,
    (e.valor - COALESCE(SUM(p.valor), 0)) as saldo_pagar
FROM empenhos e
INNER JOIN despesas d ON e.despesa_id = d.id
LEFT JOIN pagamentos p ON e.id = p.empenho_id
GROUP BY e.id, e.numero_empenho, e.data_empenho, e.valor, e.observacao,
         d.numero_protocolo, d.credor;

-- 7. Consultas de Validação

-- Verificar integridade dos dados
SELECT 'Despesas com empenhos acima do valor' as verificacao, COUNT(*) as problemas
FROM (
    SELECT d.id 
    FROM despesas d
    LEFT JOIN empenhos e ON d.id = e.despesa_id
    GROUP BY d.id, d.valor
    HAVING COALESCE(SUM(e.valor), 0) > d.valor
) as problemas

UNION ALL

SELECT 'Empenhos com pagamentos acima do valor' as verificacao, COUNT(*) as problemas
FROM (
    SELECT e.id
    FROM empenhos e
    LEFT JOIN pagamentos p ON e.id = p.empenho_id
    GROUP BY e.id, e.valor
    HAVING COALESCE(SUM(p.valor), 0) > e.valor
) as problemas;

-- =============================================
-- FIM DOS SCRIPTS
-- =============================================
# Sistema de Controle Financeiro SOP - Backend

## Descrição

O Sistema de Controle Financeiro SOP é uma aplicação backend desenvolvida com Spring Boot e PostgreSQL para gerenciar as entidades de negócio Despesa, Empenho e Pagamento. Ele permite o cadastro, visualização, edição e exclusão dessas entidades, respeitando as regras de negócio específicas definidas para o controle financeiro da instituição.

## Pré-requisitos

- **Java 17** ou superior
- **PostgreSQL** (versão 12 ou superior)
- **Visual Studio Code** com extensões para Java (ex.: Spring Boot Extension Pack)
- Sistema operacional com terminal (Linux, Windows ou macOS)

## Configuração

### 1. Clone o Repositório

```bash
git clone <URL_DO_SEU_REPOSITORIO>
cd backend

2. Configure as Variáveis de Ambiente
Crie um arquivo .env na raiz do projeto com base no exemplo .env.example:
DB_URL=jdbc:postgresql://localhost:5432/sop_financial_system
DB_USERNAME=postgres
DB_PASSWORD=seu_senha
SERVER_PORT=8080
CORS_ALLOWED_ORIGINS=http://localhost:3000

3. Configure o Banco de Dados
Crie o banco de dados executando o script:
psql -U postgres < database/scripts.sql

4. Execute a Aplicação
Abra o projeto no VSCode.
Certifique-se de que a extensão Spring Boot está instalada.
Clique no botão "Run" (▶️) no VSCode, configurado no arquivo principal FinancialSystemApplication.java.
A API estará disponível em http://localhost:8080.

Endpoints da API
Despesas:
GET /api/despesas - Listar todas as despesas
GET /api/despesas/{id} - Buscar despesa por ID
POST /api/despesas - Cadastrar despesa
PUT /api/despesas/{id} - Editar despesa
DELETE /api/despesas/{id} - Excluir despesa
Empenhos:
GET /api/empenhos - Listar todos os empenhos
GET /api/empenhos/{id} - Buscar empenho por ID
POST /api/empenhos - Cadastrar empenho
PUT /api/empenhos/{id} - Editar empenho
DELETE /api/empenhos/{id} - Excluir empenho
Pagamentos:
GET /api/pagamentos - Listar todos os pagamentos
GET /api/pagamentos/{id} - Buscar pagamento por ID
POST /api/pagamentos - Cadastrar pagamento
PUT /api/pagamentos/{id} - Editar pagamento
DELETE /api/pagamentos/{id} - Excluir pagamento
```

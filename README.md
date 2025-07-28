# Sistema de Controle Financeiro SOP

Sistema completo para gerenciamento de despesas, empenhos e pagamentos do Sistema de Orçamento Público (SOP).

## 🚀 Funcionalidades

### Entidades Principais

- **Despesas**: Cadastro e gerenciamento de despesas com protocolo único
- **Empenhos**: Vinculação de empenhos às despesas com validação de valores
- **Pagamentos**: Registro de pagamentos vinculados aos empenhos

### Recursos Implementados

- ✅ CRUD completo para todas as entidades
- ✅ Validação de regras de negócio
- ✅ Cálculo automático de status das despesas
- ✅ Interface responsiva e intuitiva
- ✅ Gerenciamento de estado com Redux
- ✅ Formulários com validação
- ✅ Dashboard com visão geral

## 🛠️ Tecnologias Utilizadas

### Obrigatórias

- **Next.js 14** - Framework React
- **Redux Toolkit** - Gerenciamento de estado
- **Axios** - Requisições HTTP (preparado para integração)
- **TypeScript** - Tipagem estática

### Opcionais Implementadas

- **Tailwind CSS** - Estilização
- **Radix UI** - Componentes acessíveis
- **Lucide React** - Ícones
- **Interface Responsiva** - Mobile-first

## 📋 Regras de Negócio Implementadas

### Despesas

- Número de protocolo único no formato: `#####.######/####-##`
- Tipos: Obra de Edificação, Obra de Rodovias, Outros
- Status calculado automaticamente baseado em empenhos e pagamentos

### Empenhos

- Número único no formato: `anoAtualNE####`
- Soma dos valores não pode ultrapassar o valor da despesa
- Obrigatoriamente vinculado a uma despesa

### Pagamentos

- Número único no formato: `anoAtualNP####`
- Soma dos valores não pode ultrapassar o valor do empenho
- Obrigatoriamente vinculado a um empenho

### Validações

- Não é possível excluir empenho com pagamentos associados
- Não é possível excluir despesa com empenhos associados
- Validação de valores em tempo real

## 🚀 Como Executar

### Pré-requisitos

- Node.js 18+
- npm ou yarn
- Java 17+ (para backend)
- Maven ou Gradle (para backend)
- Banco de dados configurado (ex: PostgreSQL)

### Frontend

```bash
# Clone o repositório
git clone <url-do-repositorio>

# Entre no diretório
cd sop-financial-system

# Instale as dependências
npm install

# Execute em modo de desenvolvimento
npm run dev
```

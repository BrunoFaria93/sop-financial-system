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

### Instalação
\`\`\`bash
# Clone o repositório
git clone <url-do-repositorio>

# Entre no diretório
cd sop-financial-system

# Instale as dependências
npm install

# Execute em modo de desenvolvimento
npm run dev
\`\`\`

### Scripts Disponíveis
\`\`\`bash
npm run dev      # Executa em modo desenvolvimento
npm run build    # Gera build de produção
npm run start    # Executa build de produção
npm run lint     # Executa linting
\`\`\`

## 📱 Interface

### Dashboard
- Visão geral com totais de despesas, empenhos e pagamentos
- Lista de despesas com status calculado automaticamente
- Navegação por abas para cada entidade

### Formulários
- Formulários modais para cadastro e edição
- Validação em tempo real
- Campos com formatação automática
- Seleção de entidades relacionadas

### Responsividade
- Design mobile-first
- Adaptação automática para diferentes tamanhos de tela
- Interface otimizada para tablets e desktops

## 🔧 Estrutura do Projeto

\`\`\`
src/
├── app/                    # App Router do Next.js
├── components/
│   ├── ui/                # Componentes base (shadcn/ui)
│   ├── forms/             # Formulários das entidades
│   └── dashboard.tsx      # Dashboard principal
├── store/
│   ├── slices/           # Redux slices
│   └── store.ts          # Configuração do store
└── utils/
    ├── business-rules.ts  # Regras de negócio
    └── generators.ts      # Geradores de números
\`\`\`

## 🎯 Próximos Passos

### Funcionalidades Futuras
- [ ] Autenticação JWT
- [ ] API REST completa
- [ ] PWA (Progressive Web App)
- [ ] Relatórios em PDF
- [ ] Filtros avançados
- [ ] Histórico de alterações
- [ ] Notificações

### Melhorias Técnicas
- [ ] Testes unitários
- [ ] Testes de integração
- [ ] Deploy automatizado
- [ ] Monitoramento
- [ ] Cache otimizado

## 📄 Licença

Este projeto foi desenvolvido como parte de um sistema de controle financeiro para órgãos públicos.

## 🤝 Contribuição

Para contribuir com o projeto:
1. Faça um fork
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

---

**Desenvolvido com ❤️ usando Next.js, Redux e TypeScript**

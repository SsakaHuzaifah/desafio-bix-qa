# BIX Mini E-commerce - Desafio Técnico QA

Um mini e-commerce com funcionalidades de autenticação, gestão de estoque e sistema de cupons de desconto.

## 🚀 Funcionalidades Implementadas

### ✅ Autenticação de Usuários

- Sistema de login/logout
- Sessões persistentes com localStorage
- Proteção de rotas para checkout

### ✅ Gestão de Estoque

- Controle de quantidade disponível por produto
- Validação de estoque em tempo real
- Atualização automática após compras
- Interface adaptativa (botões desabilitados quando sem estoque)

### ✅ Sistema de Cupons de Desconto

- Cupons de desconto percentual e valor fixo
- Validação de cupons ativos/expirados
- Aplicação automática no checkout
- Cálculo de subtotal, desconto e total final

### ✅ Carrinho de Compras

- Adição múltipla de produtos
- Validação de quantidade vs estoque
- Cálculo automático de totais
- Limpeza automática após checkout

## 🛠️ Tecnologias

- **Backend**: Node.js + Express
- **Frontend**: HTML5 + CSS3 + JavaScript Vanilla
- **Containerização**: Docker + Docker Compose

## 📋 Pré-requisitos

- Docker e Docker Compose instalados

## 🚀 Como Executar

### Docker

```bash
# Clone o repositório
git clone <repository-url>
cd qa-test

# Execute com Docker
docker compose up --build

# Acesse a aplicação
open http://localhost:3001
```

## 👤 Credenciais de Teste

### Usuários Disponíveis

- **Admin**: `admin@test.com` / `admin123`
- **Usuário**: `user@test.com` / `user123`

### Cupons de Desconto

- `WELCOME10` - 10% de desconto
- `SAVE20` - 20% de desconto
- `FIXED50` - R$ 50,00 de desconto fixo
- `EXPIRED` - Cupom expirado (para testes)

## 📡 API Endpoints

### Autenticação

- `POST /api/login` - Login de usuário
- `POST /api/logout` - Logout de usuário
- `GET /api/me` - Informações do usuário logado

### Produtos

- `GET /api/products` - Lista de produtos com estoque

### Cupons

- `POST /api/validate-coupon` - Validar cupom de desconto

### Checkout

- `POST /api/checkout` - Finalizar compra com validação de estoque e cupons

### Health Check

- `GET /api/health` - Status da aplicação

## 🏗️ Arquitetura

```
qa-test/
├── backend/
│   ├── data/           # Dados JSON (produtos, usuários, cupons)
│   ├── public/         # Frontend estático
│   └── server.js       # Servidor Express
├── docker-compose.yml  # Configuração Docker
└── Dockerfile         # Imagem Docker
```

## 📝 Próximos Passos

### Testes

- Criar testes automatizados para qualidade da aplicação.

## 📄 Licença

Este projeto é parte do processo seletivo da BIX.

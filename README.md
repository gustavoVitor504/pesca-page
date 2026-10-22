# Pesca Page — Front-end

Front-end em Angular de um e-commerce de equipamentos de pesca, com catálogo, carrinho, checkout com Mercado Pago (Pix, cartão e boleto), histórico de pedidos e painel administrativo.

> **Projeto de portfólio.** A loja é uma demonstração: nenhum produto é vendido e os pagamentos rodam no ambiente de testes do Mercado Pago.

**[Ver site no ar](https://pesca-page-46l3.vercel.app)** · **[API (Spring Boot)](https://github.com/gustavoVitor504/pesca-backend)**

## Funcionalidades

- Catálogo de produtos com busca, filtro por categoria e ordenação
- Página de detalhe do produto com galeria de imagens
- Cadastro com verificação de e-mail e login com JWT
- Carrinho de compras
- Checkout com Pix (QR Code e copia e cola), cartão de crédito e boleto via Mercado Pago
- Histórico de pedidos do cliente
- Painel administrativo com dashboard, cadastro e edição de produtos e atualização do status dos pedidos

## Tecnologias

- Angular 17 (standalone components) e TypeScript
- Angular Material
- Angular SSR
- SDK JavaScript do Mercado Pago
- Deploy na Vercel

## Destaques técnicos

- **Interceptor HTTP** que anexa o token JWT a todas as requisições autenticadas
- **Guards de rota**: `AuthGuard` para páginas de cliente e `AdminGuard`, que lê o papel (`ROLE_ADMIN`) do token antes de liberar o painel administrativo
- **Lazy loading** do painel administrativo, que só é baixado por quem acessa `/admin`
- Camada de **services** separando a comunicação com a API (produtos, carrinho, pedidos, pagamentos, autenticação)
- Configuração por **environments** (local e produção)

## Estrutura

```
src/app/
├── components/   # grid de produtos, barra de filtros
├── layout/       # header, logo, sub-header
├── pages/        # produtos, detalhe, carrinho, checkout, pedidos, admin, verificação de e-mail
├── services/     # auth, cart, filter, order, payment, product
├── guards/       # AuthGuard, AdminGuard
├── interceptors/ # authInterceptor (JWT)
└── models/
```

## Como rodar localmente

Pré-requisitos: Node.js 18+ e a [API](https://github.com/gustavoVitor504/pesca-backend) rodando em `http://localhost:8080`.

```bash
git clone https://github.com/gustavoVitor504/pesca-page.git
cd pesca-page
npm install
npm start
```

Acesse `http://localhost:4200`. A URL da API e a chave pública do Mercado Pago ficam em `src/environments/`.

## Testando uma compra

Os pagamentos usam o ambiente de testes do Mercado Pago. Para simular uma compra com cartão, use um dos [cartões de teste do Mercado Pago](https://www.mercadopago.com.br/developers/pt/docs/checkout-api/integration-test/test-cards). Nenhuma cobrança real é feita.

## Autor

**Gustavo Vitor Ferreira Nunes** — [LinkedIn](https://www.linkedin.com/in/gustavovitorferreira/) · [GitHub](https://github.com/gustavoVitor504)

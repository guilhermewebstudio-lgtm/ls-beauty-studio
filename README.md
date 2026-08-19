# LS Beauty Studio

Site para o LS Beauty Studio (salão de beleza em Benfica, Lisboa): apresentação, lista de serviços, marcações online, contactos e um bot de suporte ao cliente.

## Stack

- Node.js + Express
- EJS (templates do servidor)
- Postgres (Neon) via `pg`
- CSS e JS vanilla (sem build step)

## Correr localmente

1. Copia `.env.example` para `.env` e preenche `DATABASE_URL` com a connection string do Neon.
2. Instala e arranca:

```bash
npm install
npm start
```

Abre em `http://localhost:3000`. As tabelas e os serviços iniciais são criados automaticamente no arranque (`db.init()`).

## Estrutura

```
server.js           → arranque do servidor
routes/main.js       → páginas (início, serviços, marcar, contactos)
routes/chatbot.js     → API do bot de suporte (regras simples, fácil de expandir)
models/db.js          → ligação ao Postgres (Neon) + criação de tabelas + seed de serviços
views/                → templates EJS
public/css/style.css  → todo o design
public/js/            → animação de entrada + widget do chatbot
```

## Próximos passos

1. **Deploy** (ex: Render): definir a variável de ambiente `DATABASE_URL` nas definições do serviço, com a connection string do Neon.
2. Depois disso, basta dizeres o que precisas de mudar (preços, textos, novos serviços, horários) que eu altero e faço o commit/push diretamente.

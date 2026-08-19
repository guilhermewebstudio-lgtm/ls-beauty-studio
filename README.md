# LS Beauty Studio

Site para o LS Beauty Studio (salão de beleza em Benfica, Lisboa): apresentação, lista de serviços, marcações online, contactos e um bot de suporte ao cliente.

## Stack

- Node.js + Express
- EJS (templates do servidor)
- SQLite (`better-sqlite3`) — fácil de trocar por Postgres/Neon mais tarde
- CSS e JS vanilla (sem build step)

## Correr localmente

```bash
npm install
npm start
```

Abre em `http://localhost:3000`.

## Estrutura

```
server.js           → arranque do servidor
routes/main.js       → páginas (início, serviços, marcar, contactos)
routes/chatbot.js     → API do bot de suporte (regras simples, fácil de expandir)
models/db.js          → ligação à base de dados + criação de tabelas + seed de serviços
views/                → templates EJS
public/css/style.css  → todo o design
public/js/            → animação de entrada + widget do chatbot
data/                 → ficheiro SQLite (não vai para o Git)
```

## Próximos passos

1. **GitHub**: publicar este repositório.
2. **Neon (Postgres)**: quando quiseres, trocamos `models/db.js` para usar `pg` em vez de `better-sqlite3`, apontando para a `DATABASE_URL` do Neon (ver `.env.example`). O resto do código não muda.
3. Depois disso, basta dizeres o que precisas de mudar (preços, textos, novos serviços, horários) que eu altero e faço o commit/push diretamente.

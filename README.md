# CASSIEF 🤖

![Status](https://img.shields.io/badge/status-ativo-brightgreen)
![Node.js](https://img.shields.io/badge/Node.js-v18-blue)
![Telegram Bot](https://img.shields.io/badge/Telegram-Bot-blueviolet)

**Bot de Telegram para gestão de grupos e suporte**  
Criado e mantido por **Inocêncio José**.

---

## 🌐 Descrição
CASSIEF é um **bot completo para Telegram**, focado em **moderação, suporte e engajamento de membros**.  
Ele automatiza tarefas administrativas, mantém o grupo seguro e oferece interação avançada com os usuários.  
Desenvolvido para a comunidade **VPN AJ Freenet**, mas adaptável a outros grupos.

---

## ⚙️ Funcionalidades

### Moderação
- Filtragem de palavras proibidas e links.
- Detecção de spam e rajadas de mensagens.
- Advertências e banimentos automáticos.
- Suspensão temporária de usuários infratores.

### Interação com Usuários
- Boas-vindas automáticas a novos membros.
- Sistema de pontos e indicações (`/pontos`, `/indicar`).
- Criação de enquetes e envio de feedback.

### Suporte
- Sistema de tickets (`/suporte` e `/fecharticket`) para resolução de problemas.
- Denúncias direcionadas a administradores (`/denunciar`).

### Automação
- Mensagens agendadas via `cron`, como avisos diários.
- Reset diário de estatísticas e contadores de mensagens.

### Estatísticas
- Contagem de membros ativos.
- Total de mensagens diárias.
- Rastreamento de usuários ativos.

---

## 🛠 Tecnologias
- **Node.js** – Ambiente de execução.
- **node-telegram-bot-api** – Integração com Telegram.
- **express** – Servidor para webhooks.
- **body-parser** – Processamento de requisições JSON.
- **dotenv** – Variáveis de ambiente.
- **node-cron** – Agendamento de tarefas.
- **fs** – Persistência de dados local.

---

## 🚀 Instalação

1. Clone o repositório:
   ```bash
   git clone https://github.com/Inocencio-jose/cassief.git
   ```

2. Acesse a pasta do projeto:
   ```bash
   cd cassief
   ```

3. Instale as dependências:
   ```bash
   npm install
   ```

4. Crie um arquivo `.env` com a variável:
   ```env
   BOT_TOKEN=SEU_TOKEN_DO_TELEGRAM
   ```

5. Execute o bot localmente (para testes, use polling):
   ```bash
   npm start
   ```
   **Nota**: Para testes locais, mude temporariamente `polling: false` para `polling: true` em `src/index.js`. Para produção, use webhooks com Render.

---

## 📋 Comandos Principais

| Comando                  | Descrição                                  |
|--------------------------|--------------------------------------------|
| `/start`                 | Apresentação do bot                        |
| `/ajuda`                 | Lista de comandos disponíveis              |
| `/regras`                | Exibe regras do grupo                      |
| `/planos`                | Informações sobre planos da VPN AJ Freenet |
| `/status`                | Mostra status dos servidores               |
| `/faq`                   | Perguntas frequentes                       |
| `/feedback <mensagem>`   | Envia feedback aos administradores         |
| `/postar <mensagem>`     | Postagem administrativa (admins)           |
| `/advertir <userId>`     | Dar advertência (admins)                   |
| `/suporte <descrição>`   | Abrir ticket de suporte                    |
| `/contatos`              | Links de contato                           |
| `/fecharticket <userId>` | Fechar ticket (admins)                     |
| `/enquete <pergunta>`    | Criar enquete (admins)                     |
| `/pontos`                | Verificar pontos acumulados                |
| `/indicar <userId>`      | Indicar amigo e ganhar pontos              |
| `/denunciar <descrição>` | Denunciar comportamento inadequado         |

---

## 🗂 Estrutura do Projeto

```
cassief/
├── .env                  # Variáveis de ambiente (ex: BOT_TOKEN)
├── .gitignore            # Arquivos a ignorar no Git
├── package.json          # Dependências e scripts
├── package-lock.json     # Lock das dependências
├── README.md             # Documentação do projeto
├── src/                  # Código fonte principal
│   ├── index.js          # Entrypoint principal
│   ├── config/           # Configurações e constantes
│   │   └── config.js     # Constantes (IDs, limites, palavras proibidas)
│   ├── handlers/         # Handlers para comandos e eventos
│   │   ├── commands.js   # Handlers para comandos
│   │   ├── events.js     # Handlers para eventos (ex: new_chat_members)
│   │   └── cron.js       # Tarefas agendadas com node-cron
│   └── utils/            # Funções utilitárias
│       └── persistence.js # Funções para salvar/carregar dados
├── data/                 # Dados persistentes
│   └── dados.json        # JSON para advertências, pontos, tickets
└── assets/               # Arquivos estáticos
    └── generated-icon.png # Ícone do projeto
```

---

## 🌍 Deploy no Render

1. Crie um **Web Service** no Render e vincule ao repositório GitHub.
2. Configure a variável de ambiente no Render:
   ```env
   BOT_TOKEN=SEU_TOKEN_DO_TELEGRAM
   ```
3. Defina os comandos de build e start:
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
4. Verifique o webhook:
   ```bash
   curl https://api.telegram.org/bot<SEU_TOKEN>/getWebhookInfo
   ```
   O webhook deve apontar para `https://cassief.onrender.com/webhook`.
5. Para evitar que o servidor "durma" no plano gratuito:
   - Configure um monitor no UptimeRobot para pingar `https://cassief.onrender.com/` a cada 5 minutos.

---

## 🤝 Contribuição

1. Fork o repositório.
2. Crie uma branch para sua feature: `git checkout -b minha-feature`.
3. Faça commit das mudanças: `git commit -m 'Adiciona minha feature'`.
4. Envie para o repositório: `git push origin minha-feature`.
5. Abra um Pull Request.

Para grandes mudanças, abra uma issue antes para discussão.

---

## 📜 Licença

Projeto criado por **Inocêncio José** – Licença MIT.

---

## 🔗 Links Úteis

- [Telegram](https://telegram.org/)
- [Node.js](https://nodejs.org/)
- [node-telegram-bot-api](https://github.com/yagop/node-telegram-bot-api)
- [Render](https://render.com/)
---



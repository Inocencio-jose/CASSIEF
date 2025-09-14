Perfeito! Aqui vai uma versão mais **profissional e visualmente atraente** do README do **CASSIEF**, com **badges, links e destaque para o autor**, pronta para colocar no GitHub:

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
O bot foi desenvolvido para a comunidade **VPN AJ Freenet**, mas é adaptável a outros grupos.

---

## ⚙️ Funcionalidades

### Moderação
- Filtragem de palavras proibidas e links.
- Detecção de spam e rajadas de mensagens.
- Advertências e banimentos automáticos.
- Suspensão temporária de usuários infratores.

### Interação com usuários
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
- **dotenv** – Variáveis de ambiente.
- **node-cron** – Agendamento de tarefas.
- **fs** – Persistência de dados local.

---

## 🚀 Instalação

1. Clone o repositório:
```bash
git clone https://github.com/Inocencio-jose/CASSIEF.git
````

2. Acesse a pasta do projeto:

```bash
cd CASSIEF
```

3. Instale as dependências:

```bash
npm install
```

4. Crie um arquivo `.env` com a variável:

```env
BOT_TOKEN=SEU_TOKEN_DO_TELEGRAM
```

5. Execute o bot:

```bash
node bot.js
```

---

## 📋 Comandos Principais

| Comando                  | Descrição                                  |
| ------------------------ | ------------------------------------------ |
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
| `/fecharticket <userId>` | Fechar ticket (admins)                     |
| `/enquete <pergunta>`    | Criar enquete (admins)                     |
| `/pontos`                | Verificar pontos acumulados                |
| `/indicar <userId>`      | Indicar amigo e ganhar pontos              |
| `/denunciar <descrição>` | Denunciar comportamento inadequado         |

---

## 🗂 Estrutura do projeto

```
CASSIEF/
├─ node_modules/           # Dependências Node.js
├─ dados.json              # Dados persistentes (advertências, tickets, pontos)
├─ .env                    # Token do bot
├─ bot.js                  # Código principal do bot
├─ package.json            # Configuração do projeto
└─ package-lock.json       # Lock das dependências
```

---

## 🤝 Contribuição

Pull requests são bem-vindos!
Para grandes mudanças, abra uma issue antes para discussão.

---

## 📜 Licença

Projeto criado por **Inocêncio José** – Todos os direitos reservados.

---

## 🔗 Links úteis

* [Telegram](https://telegram.org/)
* [Node.js](https://nodejs.org/)
* [node-telegram-bot-api](https://github.com/yagop/node-telegram-bot-api)

```

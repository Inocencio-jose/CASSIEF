require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const token = process.env.BOT_TOKEN;
const { webhookUrl } = require('./config/config');
const { carregarDados } = require('./utils/persistence');
const setupCommands = require('./handlers/commands');
const setupEvents = require('./handlers/events');
const setupCron = require('./handlers/cron');

// Inicialize o bot SEM polling
const bot = new TelegramBot(token, { polling: false });
console.log('Servidor do bot está rodando!');

// Configura middleware para processar JSON
app.use(bodyParser.json());

// Endpoint para receber atualizações do Telegram via webhook
app.post('/webhook', (req, res) => {
  bot.processUpdate(req.body); // Processa a atualização recebida
  res.sendStatus(200); // Responde OK para o Telegram
});

// Configura o webhook na inicialização
bot.setWebHook(webhookUrl)
  .then(() => {
    console.log(`Webhook configurado com sucesso em: ${webhookUrl}`);
  })
  .catch((err) => {
    console.error('Erro ao configurar webhook:', err);
  });

// Carrega dados persistentes e define globais (para compartilhamento entre módulos)
const { advertencias, pontos, tickets } = carregarDados();
global.advertencias = advertencias;
global.pontos = pontos;
global.tickets = tickets;
global.mensagensRecentes = {};
global.usuariosSuspensos = {};
global.mensagensPorUsuario = {};
global.totalMessagesToday = 0;

// Configura handlers
setupCommands(bot);
setupEvents(bot);
setupCron(bot);

// Endpoint "fake" para health check
app.get('/', (req, res) => res.send('Bot CASSIEF rodando!'));

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
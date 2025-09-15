const cron = require('node-cron');
const { salvarDados } = require('../utils/persistence');
const { grupoDestino } = require('../config/config');

module.exports = (bot) => {
  // Salva dados a cada 5 minutos
  cron.schedule('*/5 * * * *', () => {
    salvarDados(global.advertencias, global.pontos, global.tickets);
  });

  // Reset diário para estatísticas e rate limiting
  cron.schedule('0 0 * * *', () => {
    global.mensagensRecentes = {};
    global.mensagensPorUsuario = {};
    global.totalMessagesToday = 0;
  });

  // Agendamento de postagens automáticas
  cron.schedule('0 9 * * *', () => {
    bot.sendMessage(grupoDestino, "🌞 Bom dia! Não se esqueça de verificar as novidades da VPN AJ Freenet!");
  });
};
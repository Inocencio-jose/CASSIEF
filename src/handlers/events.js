module.exports = (bot) => {
  // Boas-vindas para novos membros
  bot.on('new_chat_members', (msg) => {
    const chatId = msg.chat.id;
    const nome = msg.new_chat_member.first_name || 'usuário';

    bot.sendMessage(chatId, `🎉 Bem-vindo(a), ${nome}! 🎉\n\n` +
      `Por favor, leia as regras do grupo. Qualquer violação pode resultar em banimento!\n` +
      `/regras para saber mais.`
    );
  });

  // Filtragem de mensagens (links, rate limiting, palavras proibidas)
  bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    const textoMensagem = (msg.text || '').toLowerCase();
    const userId = msg.from.id;
    const tempoAtual = Date.now();
    const { donos, limiteTempo, limiteMensagens, tempoSuspensao, palavrasProibidas } = require('../config/config');

    // Incrementa contador de mensagens diárias
    global.totalMessagesToday++;

    // Verifica se o usuário está suspenso
    if (global.usuariosSuspensos[userId]) {
      if (global.usuariosSuspensos[userId] < tempoAtual) {
        delete global.usuariosSuspensos[userId];
        bot.sendMessage(chatId, `✅ Sua suspensão foi removida. Você agora pode enviar mensagens novamente.`);
        return;
      }

      bot.deleteMessage(chatId, msg.message_id);

      if (global.mensagensRecentes[userId] && tempoAtual - global.mensagensRecentes[userId] < limiteTempo) {
        bot.banChatMember(chatId, userId, { until_date: Math.floor(tempoAtual / 1000) + (tempoSuspensao / 1000) });
        bot.sendMessage(chatId, `⚠️ Você foi banido por 3 minutos devido ao envio excessivo de mensagens enquanto estava suspenso.`);
      }
      global.mensagensRecentes[userId] = tempoAtual;
      return;
    }

    // Verifica links
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    if (textoMensagem.match(urlRegex) && !donos.includes(userId)) {
      bot.deleteMessage(chatId, msg.message_id);
      bot.sendMessage(chatId, `⚠️ Links não são permitidos neste grupo, exceto por administradores.`);
      return;
    }

    // Verifica rate limiting
    if (!global.mensagensRecentes[userId] || tempoAtual - global.mensagensRecentes[userId] > limiteTempo) {
      global.mensagensPorUsuario[userId] = 1;
    } else {
      global.mensagensPorUsuario[userId] += 1;
    }

    global.mensagensRecentes[userId] = tempoAtual;

    if (global.mensagensPorUsuario[userId] >= limiteMensagens) {
      global.usuariosSuspensos[userId] = tempoAtual + 5 * 60 * 1000;
      bot.sendMessage(chatId, `⚠️ Você foi suspenso de enviar mensagens por 5 minutos devido ao envio excessivo de mensagens em rajada.`);
      bot.deleteMessage(chatId, msg.message_id);
      return;
    }

    // Verifica palavras proibidas
    for (let palavra of palavrasProibidas) {
      if (textoMensagem.includes(palavra)) {
        bot.deleteMessage(chatId, msg.message_id);
        bot.sendMessage(chatId, `⚠️ O termo "${palavra}" não é permitido neste grupo! Por ser um termo de caráter pejorativo`);
        return;
      }
    }
  });
};
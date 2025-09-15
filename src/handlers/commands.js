module.exports = (bot) => {
  // /start
  bot.onText(/\/start/, (msg) => {
    const nome = msg.from.first_name || 'usuário';
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, `👋 Olá, ${nome}!\n\n` +
      `Sou a CASSIEF, a assistente oficial da VPN AJ Freenet.\nEstou aqui para ajudar com informações, suporte e manter nosso grupo seguro.` +
      `/ajuda para mais informações` +
      `Acesse o Grupo em t.me/orionvpnchat`
    );
  });

  // /contatos
  bot.onText(/\/contatos/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId,
      `📞 *Contatos da AJ Freenet*\n\n` +
      `Entre em contato conosco para suporte ou dúvidas:\n\n` +
      `📧 *E-mail*: orion.technologies635@gmail.com\n` +
      `📱 *Telegram Oficial*: https://t.me/orionvpnoficial\n` +
      `🌐 *Site*: https://inocenciojose.netlify.app\n` +
      `📱 *WhatsApp*: +244 972 264 209\n\n` +
      `🔗 *LinkedIn*: https://www.linkedin.com/in/inocêncio-josé-233778346/\n` +
      `📘 *Facebook Orion*: https://www.facebook.com/profile.php?id=61575436262847\n` +
      `🐙 *GitHub*: https://github.com/Inocencio-jose\n\n` +
      `🕒 *Horário de Atendimento*: Segunda a Sexta, das 9h às 18h (WAT)\n\n` +
      `Para suporte imediato, use o comando /suporte <descrição do problema>.`,
      { parse_mode: "Markdown" }
    );
  });

  // /ajuda
  bot.onText(/\/ajuda/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId,
      `🛠 Comandos disponíveis:\n\n` +
      `/start – Saudação e introdução\n` +
      `/ajuda – Lista de comandos\n` +
      `/regras – Veja as regras do grupo\n` +
      `/planos – Conheça os planos da AJ Freenet\n` +
      `/denunciar – Denunciar comportamento anormal\n` +
      `/postar – Enviar uma mensagem no grupo (somente administradores)\n` +
      `/advertir – Dar advertência a um usuário (somente administradores)\n` +
      `/suporte – Abrir um ticket de suporte\n` +
      `/contatos – Contacte-nos \n` +
      `/fecharticket – Fechar um ticket (somente administradores)\n` +
      `/status – Verificar status dos servidores\n` +
      `/pontos – Verificar seus pontos\n` +
      `/indicar – Indicar um amigo e ganhar pontos\n` +
      `/faq – Perguntas frequentes\n` +
      `/stats – Estatísticas do grupo\n` +
      `/feedback – Enviar feedback\n` +
      `/enquete – Criar uma enquete (somente administradores)`
    );
  });

  // /regras
  bot.onText(/\/regras/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId,
      `📜 Regras do grupo:\n\n` +
      `1. Respeite todos os membros\n` +
      `2. Sem spam ou propaganda\n` +
      `3. Proibido conteúdo ofensivo\n` +
      `4. Suporte apenas relacionado à VPN\n\n` +
      `✅ O descumprimento pode resultar em banimento`
    );
  });

  // /planos
  bot.onText(/\/planos/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId,
      `💼 Planos da AJ Freenet:\n\n` +
      `🔹 Plano Gratuito – Ilimitado mas lento\n` +
      `🔹 Plano Básico – 300kwz/3 Dias\n` +
      `🔹 Plano Premium – 600kwz/7 Dias\n` +
      `🔹 Plano Ultra – R/1 Mês\n\n` +
      `Todos com suporte dedicado e conexão segura!`
    );
  });

  // /postar
  bot.onText(/\/postar$/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, "⚠️ Uso: /postar <mensagem> - Envie uma mensagem administrativa para o grupo.");
  });

  bot.onText(/\/postar (.+)/, (msg, match) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    const textoPostagem = match[1];
    const { donos, grupoDestino } = require('../config/config');

    if (!donos.includes(userId)) {
      bot.sendMessage(chatId, "❌ Você não tem permissão para usar este comando.");
      return;
    }

    bot.sendMessage(grupoDestino, `📢 *Postagem Administrativa:*\n\n${textoPostagem}`, { parse_mode: "Markdown" });
    bot.sendMessage(chatId, "✅ Post enviado com sucesso no grupo.");
  });

  // /denunciar
  bot.onText(/\/denunciar$/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, "⚠️ Uso: /denunciar <descrição> - Forneça uma descrição detalhada do problema.");
  });

  bot.onText(/\/denunciar (.+)/, (msg, match) => {
    const chatId = msg.chat.id;
    const nomeUsuario = msg.from.first_name;
    const denuncia = match[1];
    const { admins } = require('../config/config');

    admins.forEach((adminId) => {
      bot.sendMessage(adminId, `🛑 Denúncia recebida! \n\n` +
        `Denúncia efetuada por ${nomeUsuario} \n` +
        `Alegação: "${denuncia}"\n\n` +
        `Ação necessária.`
      );
    });

    bot.sendMessage(chatId, `🛑 Denúncia registrada! \n\n` +
      `O administrador será informado sobre tal comportamento.\n` +
      `Denúncia: "${denuncia}"\n\n` +
      `Obrigado por ajudar a manter o grupo seguro.`
    );
  });

  // /advertir
  bot.onText(/\/advertir$/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, "⚠️ Uso: /advertir <userId> - userId deve ser um número.");
  });

  bot.onText(/\/advertir (.+)/, (msg, match) => {
    const chatId = msg.chat.id;
    const adminId = msg.from.id;
    const userIdStr = match[1];
    const userId = parseInt(userIdStr);
    const { donos } = require('../config/config');

    if (!donos.includes(adminId)) {
      bot.sendMessage(chatId, "❌ Apenas administradores podem usar este comando.");
      return;
    }

    if (isNaN(userId)) {
      bot.sendMessage(chatId, "⚠️ userId inválido. Deve ser um número.");
      return;
    }

    const advertencias = global.advertencias; // Acesso global (definido em app.js)
    advertencias[userId] = (advertencias[userId] || 0) + 1;
    const maxAdvertencias = 3;

    bot.sendMessage(chatId, `⚠️ Usuário <${userId}> recebeu uma advertência (${advertencias[userId]}/${maxAdvertencias}).`);

    if (advertencias[userId] >= maxAdvertencias) {
      bot.banChatMember(chatId, userId, { until_date: Math.floor(Date.now() / 1000) + 24 * 60 * 60 });
      bot.sendMessage(chatId, `🚫 Usuário <${userId}> foi banido por atingir o limite de advertências.`);
      delete advertencias[userId];
    }
  });

  // /suporte
  bot.onText(/\/suporte$/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, "⚠️ Uso: /suporte <descrição do problema> - Descreva o problema para abrir um ticket.");
  });

  bot.onText(/\/suporte (.+)/, (msg, match) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    const nome = msg.from.first_name;
    const problema = match[1];
    const { donos } = require('../config/config');

    global.tickets[userId] = { problema, status: 'aberto' };
    bot.sendMessage(chatId, `🎟 Ticket criado com sucesso! Um administrador irá responder em breve.`);

    donos.forEach((adminId) => {
      bot.sendMessage(adminId, `🎟 Novo ticket de suporte:\nUsuário: ${nome} (${userId})\nProblema: ${problema}`);
    });
  });

  // /fecharticket
  bot.onText(/\/fecharticket$/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, "⚠️ Uso: /fecharticket <userId> - userId deve ser um número.");
  });

  bot.onText(/\/fecharticket (.+)/, (msg, match) => {
    const chatId = msg.chat.id;
    const adminId = msg.from.id;
    const userIdStr = match[1];
    const userId = parseInt(userIdStr);
    const { donos } = require('../config/config');

    if (!donos.includes(adminId)) {
      bot.sendMessage(chatId, "❌ Apenas administradores podem usar este comando.");
      return;
    }

    if (isNaN(userId)) {
      bot.sendMessage(chatId, "⚠️ userId inválido. Deve ser um número.");
      return;
    }

    if (global.tickets[userId]) {
      global.tickets[userId].status = 'fechado';
      bot.sendMessage(userId, "✅ Seu ticket foi fechado por um administrador.");
      bot.sendMessage(chatId, `✅ Ticket do usuário <${userId}> foi fechado.`);
      delete global.tickets[userId];
    } else {
      bot.sendMessage(chatId, "❌ Nenhum ticket encontrado para este usuário.");
    }
  });

  // /status
  bot.onText(/\/status/, (msg) => {
    const chatId = msg.chat.id;
    const status = {
      servidorBR: "🟢 Online (Latência: 50ms)",
      servidorUS: "🟡 Manutenção programada",
      servidorEU: "🟢 Online (Latência: 80ms)"
    };

    bot.sendMessage(chatId,
      `🌐 Status dos servidores AJ Freenet:\n\n` +
      `🇧🇷 Brasil: ${status.servidorBR}\n` +
      `🇺🇸 EUA: ${status.servidorUS}\n` +
      `🇪🇺 Europa: ${status.servidorEU}`
    );
  });

  // /pontos
  bot.onText(/\/pontos/, (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    const nome = msg.from.first_name;

    global.pontos[userId] = global.pontos[userId] || 0;
    bot.sendMessage(chatId, `🏆 ${nome}, você tem ${global.pontos[userId]} pontos!`);
  });

  // /indicar
  bot.onText(/\/indicar$/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, "⚠️ Uso: /indicar <userId> - userId deve ser um número.");
  });

  bot.onText(/\/indicar (.+)/, (msg, match) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    const indicadoIdStr = match[1];
    const indicadoId = parseInt(indicadoIdStr);

    if (isNaN(indicadoId)) {
      bot.sendMessage(chatId, "⚠️ userId inválido. Deve ser um número.");
      return;
    }

    if (userId === indicadoId) {
      bot.sendMessage(chatId, "❌ Você não pode indicar a si mesmo!");
      return;
    }

    global.pontos[userId] = (global.pontos[userId] || 0) + 10;
    bot.sendMessage(chatId, `🎉 Parabéns! Você ganhou 10 pontos por indicar um amigo! Total: ${global.pontos[userId]} pontos.`);
  });

  // /faq
  bot.onText(/\/faq/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId,
      `❓ *Perguntas Frequentes (FAQ):*\n\n` +
      `1. *Como configurar a VPN?*\n` +
      `   Baixe o app da AJ Freenet e siga as instruções no menu de configuração.\n\n` +
      `2. *Por que minha conexão está lenta?*\n` +
      `   Verifique o status dos servidores com /status ou tente outro servidor.\n\n` +
      `3. *Como comprar um plano?*\n` +
      `   Use /planos para ver os planos e entre em contato com um administrador.\n\n` +
      `Mais dúvidas? Use /suporte.`,
      { parse_mode: "Markdown" }
    );
  });

  // /stats
  bot.onText(/\/stats/, async (msg) => {
    const chatId = msg.chat.id;
    try {
      const memberCount = await bot.getChatMemberCount(chatId);
      bot.sendMessage(chatId, `📊 Estatísticas do grupo:\n\n` +
        `👥 Membros: ${memberCount}\n` +
        `📢 Mensagens hoje: ${global.totalMessagesToday}\n` +
        `👤 Usuários ativos hoje: ${Object.keys(global.mensagensRecentes).length}`);
    } catch (error) {
      bot.sendMessage(chatId, "❌ Erro ao obter estatísticas do grupo.");
    }
  });

  // /feedback
  bot.onText(/\/feedback$/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, "⚠️ Uso: /feedback <mensagem> - Envie seu feedback.");
  });

  bot.onText(/\/feedback (.+)/, (msg, match) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    const nome = msg.from.first_name;
    const feedback = match[1];
    const { donos } = require('../config/config');

    bot.sendMessage(chatId, `📝 Obrigado pelo seu feedback, ${nome}! Ele foi enviado aos administradores.`);

    donos.forEach((adminId) => {
      bot.sendMessage(adminId, `📝 Novo feedback de ${nome} (${userId}):\n\n${feedback}`);
    });
  });

  // /enquete
  bot.onText(/\/enquete$/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, "⚠️ Uso: /enquete <pergunta> - Crie uma enquete com a pergunta especificada.");
  });

  bot.onText(/\/enquete (.+)/, (msg, match) => {
    const chatId = msg.chat.id;
    const adminId = msg.from.id;
    const pergunta = match[1];
    const { donos } = require('../config/config');

    if (!donos.includes(adminId)) {
      bot.sendMessage(chatId, "❌ Apenas administradores podem criar enquetes.");
      return;
    }

    bot.sendPoll(chatId, pergunta, ['Sim', 'Não', 'Talvez'], { is_anonymous: false });
  });
};
require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const cron = require('node-cron');
const fs = require('fs');
const token = process.env.BOT_TOKEN;

const bot = new TelegramBot(token, { polling: true });

// ID do chat do grupo
const grupoDestino = -1002561684897;

const donos = [6812846443];
const admins = [6812846443];

// Dados persistentes
let advertencias = {};
let pontos = {};
let tickets = {};
let mensagensRecentes = {};
let usuariosSuspensos = {};
let mensagensPorUsuario = {};
let totalMessagesToday = 0;

// Limite de tempo para detectar rajada de mensagens (em ms)
const limiteTempo = 5000; // 5 segundos
const limiteMensagens = 5; // 5 mensagens
const tempoSuspensao = 3 * 60 * 1000; // 3 minutos para banimento

// Funções de backup
function salvarDados() {
  const dados = { advertencias, pontos, tickets };
  fs.writeFileSync('dados.json', JSON.stringify(dados));
}

function carregarDados() {
  if (fs.existsSync('dados.json')) {
    const dados = JSON.parse(fs.readFileSync('dados.json'));
    advertencias = dados.advertencias || {};
    pontos = dados.pontos || {};
    tickets = dados.tickets || {};
  }
}

// Carrega dados ao iniciar o bot
carregarDados();

// Salva dados a cada 5 minutos
cron.schedule('*/5 * * * *', () => {
  salvarDados();
});

// Reset diário para estatísticas e rate limiting
cron.schedule('0 0 * * *', () => {
  mensagensRecentes = {};
  mensagensPorUsuario = {};
  totalMessagesToday = 0;
});

// Boas-vindas para novos membros
bot.on('new_chat_members', (msg) => {
  const chatId = msg.chat.id;
  const nome = msg.new_chat_member.first_name || 'usuário';

  bot.sendMessage(chatId, `🎉 Bem-vindo(a), ${nome}! 🎉\n\n` +
    `Por favor, leia as regras do grupo. Qualquer violação pode resultar em banimento!\n` +
    `/regras para saber mais.`
  );
});

// Comandos de interação
bot.onText(/\/start/, (msg) => {
  const nome = msg.from.first_name || 'usuário';
  const chatId = msg.chat.id;

  bot.sendMessage(chatId, `👋 Olá, ${nome}!\n\nSou o CASSIEF, o assistente oficial da VPN AJ Freenet.\nEstou aqui para ajudar com informações, suporte e manter nosso grupo seguro.`);
});

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

// Comando para enviar postagens no grupo
bot.onText(/\/postar$/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, "⚠️ Uso: /postar <mensagem> - Envie uma mensagem administrativa para o grupo.");
});

bot.onText(/\/postar (.+)/, (msg, match) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const textoPostagem = match[1];

  if (!donos.includes(userId)) {
    bot.sendMessage(chatId, "❌ Você não tem permissão para usar este comando.");
    return;
  }

  bot.sendMessage(grupoDestino, `📢 *Postagem Administrativa:*\n\n${textoPostagem}`, {
    parse_mode: "Markdown"
  });

  bot.sendMessage(chatId, "✅ Post enviado com sucesso no grupo.");
});

// Agendamento de postagens automáticas
cron.schedule('0 9 * * *', () => {
  bot.sendMessage(grupoDestino, "🌞 Bom dia! Não se esqueça de verificar as novidades da VPN AJ Freenet!");
});

// Denúncias
bot.onText(/\/denunciar$/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, "⚠️ Uso: /denunciar <descrição> - Forneça uma descrição detalhada do problema.");
});

bot.onText(/\/denunciar (.+)/, (msg, match) => {
  const chatId = msg.chat.id;
  const nomeUsuario = msg.from.first_name;
  const denuncia = match[1];

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

// Sistema de advertências
bot.onText(/\/advertir$/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, "⚠️ Uso: /advertir <userId> - userId deve ser um número.");
});

bot.onText(/\/advertir (.+)/, (msg, match) => {
  const chatId = msg.chat.id;
  const adminId = msg.from.id;
  const userIdStr = match[1];
  const userId = parseInt(userIdStr);

  if (!donos.includes(adminId)) {
    bot.sendMessage(chatId, "❌ Apenas administradores podem usar este comando.");
    return;
  }

  if (isNaN(userId)) {
    bot.sendMessage(chatId, "⚠️ userId inválido. Deve ser um número.");
    return;
  }

  advertencias[userId] = (advertencias[userId] || 0) + 1;
  const maxAdvertencias = 3;

  bot.sendMessage(chatId, `⚠️ Usuário <${userId}> recebeu uma advertência (${advertencias[userId]}/${maxAdvertencias}).`);

  if (advertencias[userId] >= maxAdvertencias) {
    bot.banChatMember(chatId, userId, { until_date: Math.floor(Date.now() / 1000) + 24 * 60 * 60 });
    bot.sendMessage(chatId, `🚫 Usuário <${userId}> foi banido por atingir o limite de advertências.`);
    delete advertencias[userId];
  }
});

// Sistema de suporte com tickets
bot.onText(/\/suporte$/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, "⚠️ Uso: /suporte <descrição do problema> - Descreva o problema para abrir um ticket.");
});

bot.onText(/\/suporte (.+)/, (msg, match) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const nome = msg.from.first_name;
  const problema = match[1];

  tickets[userId] = { problema, status: 'aberto' };
  bot.sendMessage(chatId, `🎟 Ticket criado com sucesso! Um administrador irá responder em breve.`);

  donos.forEach((adminId) => {
    bot.sendMessage(adminId, `🎟 Novo ticket de suporte:\nUsuário: ${nome} (${userId})\nProblema: ${problema}`);
  });
});

bot.onText(/\/fecharticket$/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, "⚠️ Uso: /fecharticket <userId> - userId deve ser um número.");
});

bot.onText(/\/fecharticket (.+)/, (msg, match) => {
  const chatId = msg.chat.id;
  const adminId = msg.from.id;
  const userIdStr = match[1];
  const userId = parseInt(userIdStr);

  if (!donos.includes(adminId)) {
    bot.sendMessage(chatId, "❌ Apenas administradores podem usar este comando.");
    return;
  }

  if (isNaN(userId)) {
    bot.sendMessage(chatId, "⚠️ userId inválido. Deve ser um número.");
    return;
  }

  if (tickets[userId]) {
    tickets[userId].status = 'fechado';
    bot.sendMessage(userId, "✅ Seu ticket foi fechado por um administrador.");
    bot.sendMessage(chatId, `✅ Ticket do usuário <${userId}> foi fechado.`);
    delete tickets[userId];
  } else {
    bot.sendMessage(chatId, "❌ Nenhum ticket encontrado para este usuário.");
  }
});

// Status da VPN
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

// Sistema de pontos
bot.onText(/\/pontos/, (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const nome = msg.from.first_name;

  pontos[userId] = pontos[userId] || 0;
  bot.sendMessage(chatId, `🏆 ${nome}, você tem ${pontos[userId]} pontos!`);
});

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

  pontos[userId] = (pontos[userId] || 0) + 10;
  bot.sendMessage(chatId, `🎉 Parabéns! Você ganhou 10 pontos por indicar um amigo! Total: ${pontos[userId]} pontos.`);
});

// FAQ
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

// Estatísticas do grupo
bot.onText(/\/stats/, async (msg) => {
  const chatId = msg.chat.id;

  try {
    const memberCount = await bot.getChatMemberCount(chatId);
    bot.sendMessage(chatId, `📊 Estatísticas do grupo:\n\n` +
      `👥 Membros: ${memberCount}\n` +
      `📢 Mensagens hoje: ${totalMessagesToday}\n` +
      `👤 Usuários ativos hoje: ${Object.keys(mensagensRecentes).length}`);
  } catch (error) {
    bot.sendMessage(chatId, "❌ Erro ao obter estatísticas do grupo.");
  }
});

// Feedback
bot.onText(/\/feedback$/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, "⚠️ Uso: /feedback <mensagem> - Envie seu feedback.");
});

bot.onText(/\/feedback (.+)/, (msg, match) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const nome = msg.from.first_name;
  const feedback = match[1];

  bot.sendMessage(chatId, `📝 Obrigado pelo seu feedback, ${nome}! Ele foi enviado aos administradores.`);

  donos.forEach((adminId) => {
    bot.sendMessage(adminId, `📝 Novo feedback de ${nome} (${userId}):\n\n${feedback}`);
  });
});

// Enquete
bot.onText(/\/enquete$/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, "⚠️ Uso: /enquete <pergunta> - Crie uma enquete com a pergunta especificada.");
});

bot.onText(/\/enquete (.+)/, (msg, match) => {
  const chatId = msg.chat.id;
  const adminId = msg.from.id;
  const pergunta = match[1];

  if (!donos.includes(adminId)) {
    bot.sendMessage(chatId, "❌ Apenas administradores podem criar enquetes.");
    return;
  }

  bot.sendPoll(chatId, pergunta, ['Sim', 'Não', 'Talvez'], { is_anonymous: false });
});

// Filtragem de palavras proibidas e links
const palavrasProibidas = ["porra", "merda", "caralho", "fuck", "shit", "dawmn", "pussy", "fuck'n", "porras", "merdas", "caralhos", "fucks", "fucked", "bullshit", "crap", "craps", "puta", "vadia", "vadias", "putas", "bitch", "bitches", "luisa", "putinhas", "luisas", "putinha", "cona", "conas", "piroca", "piroquinhas", "pirocas", "fodão", "putsas", "foda", "putsa", "fladaputa", "fladaputas", "fodona", "fladaputsa", "fladaputsas", "fladasputa", "fladasputas", "fladasputa", "pila", "baga", "pilas", "bagas", "roger clyke", "bagulhos", "bagulho", "arthur morgan", "red dead redemption", "rdr2", "penga ngunza", "pungo", "rdr", "teu cu", "putzas", "putza", "cú", "vai toma no cu", "roger", "red dead 2", "bagometro", "bagómetro", "red dead", "crlhs", "crlh", "fdpts", "fdpt", "cndvms", "cndtm", "chuparel", "bagarel", "latencia", "prfm", "cardalho", "largura de banda"];

bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  const textoMensagem = (msg.text || '').toLowerCase();
  const userId = msg.from.id;
  const tempoAtual = Date.now();

  // Incrementa contador de mensagens diárias
  totalMessagesToday++;

  // Verifica se o usuário está suspenso
  if (usuariosSuspensos[userId]) {
    if (usuariosSuspensos[userId] < tempoAtual) {
      delete usuariosSuspensos[userId];
      bot.sendMessage(chatId, `✅ Sua suspensão foi removida. Você agora pode enviar mensagens novamente.`);
      return;
    }

    bot.deleteMessage(chatId, msg.message_id);

    if (mensagensRecentes[userId] && tempoAtual - mensagensRecentes[userId] < limiteTempo) {
      bot.banChatMember(chatId, userId, { until_date: Math.floor(tempoAtual / 1000) + (tempoSuspensao / 1000) });
      bot.sendMessage(chatId, `⚠️ Você foi banido por 3 minutos devido ao envio excessivo de mensagens enquanto estava suspenso.`);
    }
    mensagensRecentes[userId] = tempoAtual; // Atualiza mesmo suspenso para rastrear bursts
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
  if (!mensagensRecentes[userId] || tempoAtual - mensagensRecentes[userId] > limiteTempo) {
    mensagensPorUsuario[userId] = 1;
  } else {
    mensagensPorUsuario[userId] += 1;
  }

  mensagensRecentes[userId] = tempoAtual;

  if (mensagensPorUsuario[userId] >= limiteMensagens) {
    usuariosSuspensos[userId] = tempoAtual + 5 * 60 * 1000;
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
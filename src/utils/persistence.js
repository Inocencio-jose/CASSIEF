const fs = require('fs');
const path = require('path');

const dataFile = path.join(__dirname, '../../data/dados.json');

function salvarDados(advertencias, pontos, tickets) {
  const dados = { advertencias, pontos, tickets };
  fs.writeFileSync(dataFile, JSON.stringify(dados));
}

function carregarDados() {
  if (fs.existsSync(dataFile)) {
    const dados = JSON.parse(fs.readFileSync(dataFile));
    return {
      advertencias: dados.advertencias || {},
      pontos: dados.pontos || {},
      tickets: dados.tickets || {}
    };
  }
  return { advertencias: {}, pontos: {}, tickets: {} };
}

module.exports = { salvarDados, carregarDados };
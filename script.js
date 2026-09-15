const API_URL = 'https://open.er-api.com/v6/latest/USD';
let cotacoes = null;

function formatarMoeda(valor, codigo = 'BRL') {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: codigo,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(valor);
}

function atualizarDataHora() {
  const agora = new Date();
  document.getElementById('display').textContent = agora.toLocaleString('pt-BR', {
    dateStyle: 'full',
    timeStyle: 'medium'
  });
}

function mostrarTaxas() {
  const lista = document.getElementById('taxas');
  const chaves = ['BRL', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'CHF'];

  lista.innerHTML = chaves
    .filter((codigo) => cotacoes && cotacoes[codigo])
    .map((codigo) => `<li>1 USD = ${formatarMoeda(cotacoes[codigo], codigo)} ${codigo}</li>`)
    .join('');
}

function pesquisarCotacao() {
  const valorInput = Number(document.getElementById('valor').value || 0);
  const moedaSelecionada = document.getElementById('moeda').value;

  if (!cotacoes || !cotacoes[moedaSelecionada]) {
    document.getElementById('status').textContent = 'Cotação indisponível no momento.';
    return;
  }

  const valorConvertido = valorInput * cotacoes[moedaSelecionada];
  const taxa = cotacoes[moedaSelecionada];

  document.getElementById('resultado').textContent = formatarMoeda(valorConvertido, moedaSelecionada);
  document.getElementById('taxa').textContent = `1 USD = ${formatarMoeda(taxa, moedaSelecionada)} ${moedaSelecionada}`;
  document.getElementById('status').textContent = 'Valor atualizado com a cotação do dia';
}

async function carregarCotacoes() {
  const status = document.getElementById('status');

  try {
    status.textContent = 'Buscando cotações...';

    const resposta = await fetch(API_URL);
    if (!resposta.ok) {
      throw new Error('Erro ao buscar cotações');
    }

    const dados = await resposta.json();
    cotacoes = dados.rates;

    const dataAtualizacao = new Date(dados.time_last_update_utc || Date.now());
    document.getElementById('ultima-atualizacao').textContent = dataAtualizacao.toLocaleString('pt-BR', {
      dateStyle: 'short',
      timeStyle: 'medium'
    });

    mostrarTaxas();
    pesquisarCotacao();
  } catch (erro) {
    status.textContent = 'Não foi possível atualizar o valor do dia. Tente novamente.';
    console.error(erro);
  }
}

const botao = document.getElementById('buscar');
if (botao) {
  botao.addEventListener('click', pesquisarCotacao);
}

const campoValor = document.getElementById('valor');
if (campoValor) {
  campoValor.addEventListener('input', pesquisarCotacao);
}

const campoMoeda = document.getElementById('moeda');
if (campoMoeda) {
  campoMoeda.addEventListener('change', pesquisarCotacao);
}

atualizarDataHora();
setInterval(atualizarDataHora, 1000);
carregarCotacoes();

/* =========================================================
   VENDING MACHINE — AFD (Trabalho 01)
   Implementação por IF / SWITCH

   Moedas aceitas: 5, 10 e 25 centavos
   Preço do produto: 30 centavos

   Estados: quanto de dinheiro já foi inserido.
   Q = { 0, 5, 10, 15, 20, 25, 30, "30+" }
   - Estado inicial: 0
   - Estado final (aceitação / libera produto): 30
   - "30+" é um estado de "poço" (trap): valor excedeu o preço,
     a máquina trava (nesta modelagem simples, sem troco).
   ========================================================= */

const MOEDAS = [5, 10, 25];
const ESTADO_INICIAL = 0;
const ESTADO_FINAL = 30;
const ESTADO_TRAVADO = "30+";
const PRECO = 30;

class VendingMachine {
  constructor() {
    this.estado = ESTADO_INICIAL;
  }

  inserirMoeda(moeda) {
    if (this.estado === ESTADO_FINAL || this.estado === ESTADO_TRAVADO) {
      return this.estado;
    }

    switch (moeda) {
      case 5:
      case 10:
      case 25: {
        const novoValor = this.estado + moeda;
        if (novoValor === PRECO) this.estado = ESTADO_FINAL;
        else if (novoValor > PRECO) this.estado = ESTADO_TRAVADO;
        else this.estado = novoValor;
        break;
      }
      default:
        throw new Error(`Moeda inválida: ${moeda}`);
    }

    return this.estado;
  }

  get final() {
    return this.estado === ESTADO_FINAL;
  }

  get travado() {
    return this.estado === ESTADO_TRAVADO;
  }

  reiniciar() {
    this.estado = ESTADO_INICIAL;
  }
}

function simularPorSwitch(moedas) {
  let estado = ESTADO_INICIAL;
  const trace = [{ estado, moeda: null }];

  for (const moeda of moedas) {
    if (estado === ESTADO_FINAL || estado === ESTADO_TRAVADO) {
      trace.push({ estado, moeda });
      continue;
    }

    let proximo;
    switch (moeda) {
      case 5:
      case 10:
      case 25: {
        const novoValor = estado + moeda;
        if (novoValor === PRECO) proximo = ESTADO_FINAL;
        else if (novoValor > PRECO) proximo = ESTADO_TRAVADO;
        else proximo = novoValor;
        break;
      }
      default:
        return { estadoFinal: estado, trace, erro: `Moeda inválida: ${moeda}` };
    }

    estado = proximo;
    trace.push({ estado, moeda });
  }

  return { estadoFinal: estado, trace, aceito: estado === ESTADO_FINAL, travado: estado === ESTADO_TRAVADO };
}

function gerarTabelaParaExibicao() {
  const estados = [0, 5, 10, 15, 20, 25, ESTADO_FINAL, ESTADO_TRAVADO];
  const tabela = {};
  for (const estado of estados) {
    tabela[estado] = {};
    for (const moeda of MOEDAS) {
      const maquina = new VendingMachine();
      maquina.estado = estado;
      tabela[estado][moeda] = maquina.inserirMoeda(moeda);
    }
  }
  return tabela;
}

window.VENDING_AFD = {
  VendingMachine,
  simularPorSwitch,
  TABELA_TRANSICOES: gerarTabelaParaExibicao(),
  MOEDAS,
  ESTADO_INICIAL,
  ESTADO_FINAL,
  ESTADO_TRAVADO,
  PRECO,
};

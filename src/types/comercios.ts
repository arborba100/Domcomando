export interface ComercioData {
  nivelNegocio: number;
  nivelTaxa: number;
  ultimaDataUso: string | null;
  emAndamento: boolean;
  horarioFim: number | null;
  valorAtual: number;
  taxaAplicada: number;
}

export interface Comercios {
  pizzaria: ComercioData;
  admBens: ComercioData;
  lavanderia: ComercioData;
  academia: ComercioData;
  templo: ComercioData;
}

export const COMERCIOS_CONFIG = {
  pizzaria: {
    nome: 'Pizzaria da Mama',
    valorLavagem: 350,
    taxaBase: 80,
    tempoBase: 15 * 60 * 1000, // 15 minutos em ms
  },
  admBens: {
    nome: 'ADM. de Bens',
    valorLavagem: 500,
    taxaBase: 72,
    tempoBase: 30 * 60 * 1000, // 30 minutos em ms
  },
  lavanderia: {
    nome: 'Lavanderia Povão',
    valorLavagem: 650,
    taxaBase: 67,
    tempoBase: 60 * 60 * 1000, // 60 minutos em ms
  },
  academia: {
    nome: 'Academia Músculos',
    valorLavagem: 800,
    taxaBase: 55,
    tempoBase: 120 * 60 * 1000, // 120 minutos em ms
  },
  templo: {
    nome: 'Templo Ungí-vos',
    valorLavagem: 950,
    taxaBase: 50,
    tempoBase: 240 * 60 * 1000, // 240 minutos em ms
  },
};

export type ComercioKey = keyof typeof COMERCIOS_CONFIG;

export const COMERCIOS_KEYS: ComercioKey[] = ['pizzaria', 'admBens', 'lavanderia', 'academia', 'templo'];

export const getInitialComercioData = (): Comercios => ({
  pizzaria: {
    nivelNegocio: 0,
    nivelTaxa: 0,
    ultimaDataUso: null,
    emAndamento: false,
    horarioFim: null,
    valorAtual: 0,
    taxaAplicada: 0,
  },
  admBens: {
    nivelNegocio: 0,
    nivelTaxa: 0,
    ultimaDataUso: null,
    emAndamento: false,
    horarioFim: null,
    valorAtual: 0,
    taxaAplicada: 0,
  },
  lavanderia: {
    nivelNegocio: 0,
    nivelTaxa: 0,
    ultimaDataUso: null,
    emAndamento: false,
    horarioFim: null,
    valorAtual: 0,
    taxaAplicada: 0,
  },
  academia: {
    nivelNegocio: 0,
    nivelTaxa: 0,
    ultimaDataUso: null,
    emAndamento: false,
    horarioFim: null,
    valorAtual: 0,
    taxaAplicada: 0,
  },
  templo: {
    nivelNegocio: 0,
    nivelTaxa: 0,
    ultimaDataUso: null,
    emAndamento: false,
    horarioFim: null,
    valorAtual: 0,
    taxaAplicada: 0,
  },
});

// Fórmulas de cálculo
export const calcularCustoUpgradeNegocio = (nivelNegocio: number): number => {
  return Math.floor(500 * Math.pow(1.45, nivelNegocio));
};

export const calcularCustoUpgradeTaxa = (nivelTaxa: number): number => {
  return Math.floor(800 * Math.pow(1.6, nivelTaxa));
};

export const calcularDescontoTaxa = (nivelTaxa: number): number => {
  return nivelTaxa * 1.5;
};

export const calcularTaxaAplicada = (comercioKey: ComercioKey, nivelTaxa: number): number => {
  const taxaBase = COMERCIOS_CONFIG[comercioKey].taxaBase;
  const desconto = calcularDescontoTaxa(nivelTaxa);
  return Math.max(0, taxaBase - desconto);
};

export const calcularValorLavagem = (comercioKey: ComercioKey, nivelNegocio: number): number => {
  const valorBase = COMERCIOS_CONFIG[comercioKey].valorLavagem;
  return Math.floor(valorBase * (1 + nivelNegocio * 0.1));
};

export const calcularTempoLavagem = (comercioKey: ComercioKey, nivelNegocio: number): number => {
  const tempoBase = COMERCIOS_CONFIG[comercioKey].tempoBase;
  const reducao = Math.max(0.5, 1 - nivelNegocio * 0.02);
  return Math.floor(tempoBase * reducao);
};

/**
 * Fluxo do Complexo - Evento Social Diário
 * 
 * Sistema de evento automático que ocorre diariamente às 22:00 Brasília
 * Todos os jogadores do complexo participam automaticamente
 * Inclui ranking de popularidade e sistema de recompensas
 */

import { Players } from '@/entities';

/**
 * Dados de um jogador participando do Fluxo
 */
export interface FluxoPlayer {
  playerId: string;
  playerName: string;
  level: number;
  popularity: number;
  energyEarned: number;
  spinsEarned: number;
  interactionsReceived: number;
  emojisReceived: Map<string, number>; // emoji -> count
  presentsReceived: Map<string, number>; // present -> count
}

/**
 * Interação registrada no evento
 */
export interface FluxoInteraction {
  fromPlayerId: string;
  toPlayerId: string;
  type: 'emoji' | 'present' | 'like';
  value: string; // emoji unicode ou present id
  timestamp: Date;
  popularityGain: number;
}

/**
 * Recompensa final do evento
 */
export interface FluxoReward {
  playerId: string;
  rank: number;
  energyReward: number;
  spinsReward: number;
  popularityFinal: number;
}

/**
 * Estado do evento Fluxo do Complexo
 */
export interface FluxoEventState {
  active: boolean;
  startTime: string; // "22:00" em formato HH:mm
  duration: number; // em minutos
  players: Map<string, FluxoPlayer>;
  visualSpawned: boolean;
  interactions: FluxoInteraction[];
  eventStartDate: Date | null;
  eventEndDate: Date | null;
  rewards: FluxoReward[];
}

/**
 * Estado global do evento
 */
let fluxoEventState: FluxoEventState = {
  active: false,
  startTime: '22:00',
  duration: 60,
  players: new Map(),
  visualSpawned: false,
  interactions: [],
  eventStartDate: null,
  eventEndDate: null,
  rewards: [],
};

/**
 * Configuração de recompensas por ranking
 */
const FLUXO_REWARDS_CONFIG = {
  1: { energy: 50, spinsMultiplier: 10 },
  2: { energy: 40, spinsMultiplier: 8 },
  3: { energy: 30, spinsMultiplier: 6 },
  default: { energy: 20, spinsMultiplier: 4 }, // Top 4-10
  participant: { energy: 10, spinsMultiplier: 2 }, // Todos participantes
};

/**
 * Valores de popularidade por tipo de interação
 */
const INTERACTION_POPULARITY = {
  emoji: 1,
  present: 5,
  like: 2,
};

/**
 * Obter estado atual do evento
 */
export function getFluxoEventState(): FluxoEventState {
  return fluxoEventState;
}

/**
 * Verificar se o evento deve estar ativo agora
 */
export function shouldFluxoBeActive(): boolean {
  const now = new Date();
  const brasiliaTz = new Date(now.toLocaleString('en-US', { timeZone: 'America/Sao_Paulo' }));
  
  const hours = String(brasiliaTz.getHours()).padStart(2, '0');
  const minutes = String(brasiliaTz.getMinutes()).padStart(2, '0');
  const currentTime = `${hours}:${minutes}`;
  
  // Evento ativo entre 22:00 e 23:00
  return currentTime >= fluxoEventState.startTime && currentTime < '23:00';
}

/**
 * Iniciar o evento Fluxo do Complexo
 * Chamado automaticamente às 22:00 Brasília
 */
export async function startFluxoEvent(allPlayers: Players[]): Promise<void> {
  if (fluxoEventState.active) {
    console.warn('Fluxo já está ativo');
    return;
  }

  fluxoEventState.active = true;
  fluxoEventState.eventStartDate = new Date();
  fluxoEventState.eventEndDate = new Date(Date.now() + fluxoEventState.duration * 60 * 1000);
  fluxoEventState.players.clear();
  fluxoEventState.interactions = [];
  fluxoEventState.rewards = [];

  // Adicionar todos os jogadores automaticamente
  for (const player of allPlayers) {
    addPlayerToFluxo(player);
  }

  console.log(`🎉 Fluxo do Complexo iniciado! ${fluxoEventState.players.size} jogadores participando.`);

  // Spawn dos efeitos visuais
  spawnVisuals();

  // Agendar término do evento
  scheduleFluxoEnd();
}

/**
 * Terminar o evento Fluxo do Complexo
 * Calcula ranking, distribui recompensas e limpa dados
 */
export async function endFluxoEvent(): Promise<FluxoReward[]> {
  if (!fluxoEventState.active) {
    console.warn('Fluxo não está ativo');
    return [];
  }

  fluxoEventState.active = false;
  
  // Calcular ranking
  const ranking = calculateFluxoRanking();
  
  // Distribuir recompensas
  const rewards = distributeRewards(ranking);
  fluxoEventState.rewards = rewards;

  // Remover efeitos visuais
  despawnVisuals();

  console.log(`🏁 Fluxo do Complexo encerrado! Ranking calculado para ${ranking.length} jogadores.`);

  return rewards;
}

/**
 * Adicionar jogador ao evento
 */
export function addPlayerToFluxo(player: Players): void {
  if (!fluxoEventState.players.has(player._id)) {
    const fluxoPlayer: FluxoPlayer = {
      playerId: player._id,
      playerName: player.playerName || 'Jogador',
      level: player.level || 1,
      popularity: 0,
      energyEarned: 0,
      spinsEarned: 0,
      interactionsReceived: 0,
      emojisReceived: new Map(),
      presentsReceived: new Map(),
    };
    fluxoEventState.players.set(player._id, fluxoPlayer);
  }
}

/**
 * Remover jogador do evento
 */
export function removePlayerFromFluxo(playerId: string): void {
  fluxoEventState.players.delete(playerId);
}

/**
 * Registrar interação entre jogadores
 * Aumenta popularidade do jogador que recebe
 */
export function registerInteraction(
  fromPlayerId: string,
  toPlayerId: string,
  type: 'emoji' | 'present' | 'like',
  value: string
): void {
  if (!fluxoEventState.active) {
    console.warn('Fluxo não está ativo');
    return;
  }

  const toPlayer = fluxoEventState.players.get(toPlayerId);
  if (!toPlayer) {
    console.warn(`Jogador ${toPlayerId} não encontrado no evento`);
    return;
  }

  const popularityGain = INTERACTION_POPULARITY[type] || 1;
  
  // Registrar interação
  const interaction: FluxoInteraction = {
    fromPlayerId,
    toPlayerId,
    type,
    value,
    timestamp: new Date(),
    popularityGain,
  };
  fluxoEventState.interactions.push(interaction);

  // Aumentar popularidade
  toPlayer.popularity += popularityGain;
  toPlayer.interactionsReceived += 1;

  // Registrar emoji ou presente
  if (type === 'emoji') {
    const count = toPlayer.emojisReceived.get(value) || 0;
    toPlayer.emojisReceived.set(value, count + 1);
  } else if (type === 'present') {
    const count = toPlayer.presentsReceived.get(value) || 0;
    toPlayer.presentsReceived.set(value, count + 1);
  }

  console.log(`📊 Interação registrada: ${fromPlayerId} → ${toPlayerId} (${type}: ${value})`);
}

/**
 * Calcular ranking de jogadores por popularidade
 */
export function calculateFluxoRanking(): FluxoPlayer[] {
  const players = Array.from(fluxoEventState.players.values());
  
  // Ordenar por popularidade (decrescente)
  return players.sort((a, b) => b.popularity - a.popularity);
}

/**
 * Distribuir recompensas baseado no ranking
 */
export function distributeRewards(ranking: FluxoPlayer[]): FluxoReward[] {
  const rewards: FluxoReward[] = [];

  ranking.forEach((player, index) => {
    const rank = index + 1;
    let energyReward = FLUXO_REWARDS_CONFIG.participant.energy;
    let spinsMultiplier = FLUXO_REWARDS_CONFIG.participant.spinsMultiplier;

    // Determinar recompensa por ranking
    if (rank === 1) {
      energyReward = FLUXO_REWARDS_CONFIG[1].energy;
      spinsMultiplier = FLUXO_REWARDS_CONFIG[1].spinsMultiplier;
    } else if (rank === 2) {
      energyReward = FLUXO_REWARDS_CONFIG[2].energy;
      spinsMultiplier = FLUXO_REWARDS_CONFIG[2].spinsMultiplier;
    } else if (rank === 3) {
      energyReward = FLUXO_REWARDS_CONFIG[3].energy;
      spinsMultiplier = FLUXO_REWARDS_CONFIG[3].spinsMultiplier;
    } else if (rank <= 10) {
      energyReward = FLUXO_REWARDS_CONFIG.default.energy;
      spinsMultiplier = FLUXO_REWARDS_CONFIG.default.spinsMultiplier;
    }

    // Multiplicar giros pelo nível do jogador
    const spinsReward = spinsMultiplier * player.level;

    // Atualizar dados do jogador
    player.energyEarned = energyReward;
    player.spinsEarned = spinsReward;

    const reward: FluxoReward = {
      playerId: player.playerId,
      rank,
      energyReward,
      spinsReward,
      popularityFinal: player.popularity,
    };

    rewards.push(reward);
  });

  return rewards;
}

/**
 * Spawn dos efeitos visuais do evento no mapa
 * - Paredão de som
 * - Luzes coloridas
 * - Multidão de NPCs
 * - Espaço de interação
 */
export function spawnVisuals(): void {
  if (fluxoEventState.visualSpawned) {
    console.warn('Visuais já foram spawned');
    return;
  }

  fluxoEventState.visualSpawned = true;

  console.log('🎵 Paredão de som spawned no mapa');
  console.log('💡 Luzes coloridas ativadas');
  console.log('👥 Multidão de NPCs gerada');
  console.log('🎪 Espaço de interação criado');

  // TODO: Implementar spawn real dos visuais no Three.js/Canvas
  // - Criar geometria do paredão
  // - Adicionar luzes dinâmicas
  // - Gerar NPCs com animações
  // - Criar zona de interação
}

/**
 * Remover efeitos visuais do evento
 */
export function despawnVisuals(): void {
  if (!fluxoEventState.visualSpawned) {
    console.warn('Visuais não estão spawned');
    return;
  }

  fluxoEventState.visualSpawned = false;

  console.log('🎵 Paredão de som removido');
  console.log('💡 Luzes desativadas');
  console.log('👥 Multidão de NPCs removida');
  console.log('🎪 Espaço de interação fechado');

  // TODO: Implementar remoção real dos visuais
}

/**
 * Obter dados de um jogador no evento
 */
export function getFluxoPlayerData(playerId: string): FluxoPlayer | undefined {
  return fluxoEventState.players.get(playerId);
}

/**
 * Obter todas as interações do evento
 */
export function getFluxoInteractions(): FluxoInteraction[] {
  return [...fluxoEventState.interactions];
}

/**
 * Obter recompensas finais
 */
export function getFluxoRewards(): FluxoReward[] {
  return [...fluxoEventState.rewards];
}

/**
 * Obter tempo restante do evento em minutos
 */
export function getFluxoTimeRemaining(): number {
  if (!fluxoEventState.active || !fluxoEventState.eventEndDate) {
    return 0;
  }

  const now = new Date();
  const remaining = Math.max(0, fluxoEventState.eventEndDate.getTime() - now.getTime());
  return Math.ceil(remaining / 1000 / 60); // Converter para minutos
}

/**
 * Agendar término automático do evento
 */
function scheduleFluxoEnd(): void {
  if (!fluxoEventState.eventEndDate) return;

  const now = new Date();
  const delay = fluxoEventState.eventEndDate.getTime() - now.getTime();

  setTimeout(() => {
    endFluxoEvent();
  }, Math.max(0, delay));

  console.log(`⏰ Término do Fluxo agendado para ${fluxoEventState.eventEndDate.toLocaleTimeString('pt-BR')}`);
}

/**
 * Resetar estado do evento (para testes)
 */
export function resetFluxoEvent(): void {
  fluxoEventState = {
    active: false,
    startTime: '22:00',
    duration: 60,
    players: new Map(),
    visualSpawned: false,
    interactions: [],
    eventStartDate: null,
    eventEndDate: null,
    rewards: [],
  };
  console.log('🔄 Estado do Fluxo resetado');
}

/**
 * Obter resumo do evento para debug
 */
export function getFluxoSummary(): object {
  return {
    active: fluxoEventState.active,
    startTime: fluxoEventState.startTime,
    duration: fluxoEventState.duration,
    playerCount: fluxoEventState.players.size,
    visualSpawned: fluxoEventState.visualSpawned,
    interactionCount: fluxoEventState.interactions.length,
    eventStartDate: fluxoEventState.eventStartDate,
    eventEndDate: fluxoEventState.eventEndDate,
    timeRemaining: getFluxoTimeRemaining(),
    rewardCount: fluxoEventState.rewards.length,
  };
}

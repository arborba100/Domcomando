import { create } from 'zustand';

export interface SkillNode {
  id: string;
  name: string;
  level: number;
  maxLevel: number;
  isLocked: boolean;
  isAvailable: boolean;
  icon: string;
  description: string;
  cost: number;
  parentId?: string;
}

export interface SkillTree {
  id: string;
  name: string;
  attribute: 'inteligencia' | 'agilidade' | 'ataque' | 'defesa' | 'respeito' | 'vigor';
  nodes: SkillNode[];
  totalPoints: number;
}

interface SkillTreeState {
  skillTrees: SkillTree[];
  playerPoints: number;
  initializeSkillTrees: () => void;
  upgradeSkill: (treeId: string, nodeId: string) => boolean;
  getSkillTree: (treeId: string) => SkillTree | undefined;
  addPlayerPoints: (amount: number) => void;
}

const initialSkillTrees: SkillTree[] = [
  {
    id: 'inteligencia',
    name: 'Inteligência',
    attribute: 'inteligencia',
    totalPoints: 0,
    nodes: [
      {
        id: 'int-1',
        name: 'Análise de Risco',
        level: 0,
        maxLevel: 10,
        isLocked: false,
        isAvailable: true,
        icon: '🧠',
        description: 'Melhora a capacidade de análise de operações',
        cost: 1,
      },
      {
        id: 'int-2',
        name: 'Negociação',
        level: 0,
        maxLevel: 10,
        isLocked: true,
        isAvailable: false,
        icon: '🤝',
        description: 'Aumenta efetividade em negociações',
        cost: 2,
        parentId: 'int-1',
      },
      {
        id: 'int-3',
        name: 'Estratégia Avançada',
        level: 0,
        maxLevel: 10,
        isLocked: true,
        isAvailable: false,
        icon: '♟️',
        description: 'Planejamento tático superior',
        cost: 3,
        parentId: 'int-2',
      },
      {
        id: 'int-4',
        name: 'Lavagem de Dinheiro',
        level: 0,
        maxLevel: 10,
        isLocked: true,
        isAvailable: false,
        icon: '💰',
        description: 'Técnicas de ocultação financeira',
        cost: 2,
        parentId: 'int-1',
      },
    ],
  },
  {
    id: 'agilidade',
    name: 'Agilidade',
    attribute: 'agilidade',
    totalPoints: 0,
    nodes: [
      {
        id: 'agi-1',
        name: 'Reflexos Rápidos',
        level: 0,
        maxLevel: 10,
        isLocked: false,
        isAvailable: true,
        icon: '⚡',
        description: 'Aumenta velocidade de reação',
        cost: 1,
      },
      {
        id: 'agi-2',
        name: 'Fuga Tática',
        level: 0,
        maxLevel: 10,
        isLocked: true,
        isAvailable: false,
        icon: '🏃',
        description: 'Melhora capacidade de evasão',
        cost: 2,
        parentId: 'agi-1',
      },
      {
        id: 'agi-3',
        name: 'Movimento Silencioso',
        level: 0,
        maxLevel: 10,
        isLocked: true,
        isAvailable: false,
        icon: '🤫',
        description: 'Reduz detecção em operações',
        cost: 2,
        parentId: 'agi-1',
      },
      {
        id: 'agi-4',
        name: 'Maestria de Combate',
        level: 0,
        maxLevel: 10,
        isLocked: true,
        isAvailable: false,
        icon: '🥋',
        description: 'Domínio completo de técnicas de combate',
        cost: 3,
        parentId: 'agi-2',
      },
    ],
  },
  {
    id: 'ataque',
    name: 'Ataque',
    attribute: 'ataque',
    totalPoints: 0,
    nodes: [
      {
        id: 'atk-1',
        name: 'Golpe Básico',
        level: 0,
        maxLevel: 10,
        isLocked: false,
        isAvailable: true,
        icon: '👊',
        description: 'Aumenta dano físico básico',
        cost: 1,
      },
      {
        id: 'atk-2',
        name: 'Golpe Crítico',
        level: 0,
        maxLevel: 10,
        isLocked: true,
        isAvailable: false,
        icon: '💥',
        description: 'Chance de dano crítico',
        cost: 2,
        parentId: 'atk-1',
      },
      {
        id: 'atk-3',
        name: 'Fúria Descontrolada',
        level: 0,
        maxLevel: 10,
        isLocked: true,
        isAvailable: false,
        icon: '🔥',
        description: 'Dano massivo com risco',
        cost: 3,
        parentId: 'atk-2',
      },
      {
        id: 'atk-4',
        name: 'Armas Especializadas',
        level: 0,
        maxLevel: 10,
        isLocked: true,
        isAvailable: false,
        icon: '🔫',
        description: 'Proficiência com armas avançadas',
        cost: 2,
        parentId: 'atk-1',
      },
    ],
  },
  {
    id: 'defesa',
    name: 'Defesa',
    attribute: 'defesa',
    totalPoints: 0,
    nodes: [
      {
        id: 'def-1',
        name: 'Armadura Básica',
        level: 0,
        maxLevel: 10,
        isLocked: false,
        isAvailable: true,
        icon: '🛡️',
        description: 'Reduz dano recebido',
        cost: 1,
      },
      {
        id: 'def-2',
        name: 'Bloqueio Perfeito',
        level: 0,
        maxLevel: 10,
        isLocked: true,
        isAvailable: false,
        icon: '🚫',
        description: 'Chance de bloquear ataques',
        cost: 2,
        parentId: 'def-1',
      },
      {
        id: 'def-3',
        name: 'Regeneração',
        level: 0,
        maxLevel: 10,
        isLocked: true,
        isAvailable: false,
        icon: '💚',
        description: 'Recuperação de vida passiva',
        cost: 3,
        parentId: 'def-2',
      },
      {
        id: 'def-4',
        name: 'Escudo de Aliados',
        level: 0,
        maxLevel: 10,
        isLocked: true,
        isAvailable: false,
        icon: '👥',
        description: 'Proteção para o grupo',
        cost: 2,
        parentId: 'def-1',
      },
    ],
  },
  {
    id: 'respeito',
    name: 'Respeito',
    attribute: 'respeito',
    totalPoints: 0,
    nodes: [
      {
        id: 'res-1',
        name: 'Presença Intimidadora',
        level: 0,
        maxLevel: 10,
        isLocked: false,
        isAvailable: true,
        icon: '👑',
        description: 'Aumenta influência nas ruas',
        cost: 1,
      },
      {
        id: 'res-2',
        name: 'Liderança',
        level: 0,
        maxLevel: 10,
        isLocked: true,
        isAvailable: false,
        icon: '🎖️',
        description: 'Melhora comando de tropas',
        cost: 2,
        parentId: 'res-1',
      },
      {
        id: 'res-3',
        name: 'Reputação Lendária',
        level: 0,
        maxLevel: 10,
        isLocked: true,
        isAvailable: false,
        icon: '⭐',
        description: 'Alcança status de lenda',
        cost: 3,
        parentId: 'res-2',
      },
      {
        id: 'res-4',
        name: 'Conexões Políticas',
        level: 0,
        maxLevel: 10,
        isLocked: true,
        isAvailable: false,
        icon: '🏛️',
        description: 'Influência em altos escalões',
        cost: 2,
        parentId: 'res-1',
      },
    ],
  },
  {
    id: 'vigor',
    name: 'Vigor',
    attribute: 'vigor',
    totalPoints: 0,
    nodes: [
      {
        id: 'vig-1',
        name: 'Resistência Física',
        level: 0,
        maxLevel: 10,
        isLocked: false,
        isAvailable: true,
        icon: '💪',
        description: 'Aumenta vida máxima',
        cost: 1,
      },
      {
        id: 'vig-2',
        name: 'Stamina Infinita',
        level: 0,
        maxLevel: 10,
        isLocked: true,
        isAvailable: false,
        icon: '🔋',
        description: 'Reduz consumo de energia',
        cost: 2,
        parentId: 'vig-1',
      },
      {
        id: 'vig-3',
        name: 'Imunidade Tóxica',
        level: 0,
        maxLevel: 10,
        isLocked: true,
        isAvailable: false,
        icon: '☠️',
        description: 'Resistência a venenos',
        cost: 2,
        parentId: 'vig-1',
      },
      {
        id: 'vig-4',
        name: 'Força Sobre-Humana',
        level: 0,
        maxLevel: 10,
        isLocked: true,
        isAvailable: false,
        icon: '🦾',
        description: 'Poder físico extremo',
        cost: 3,
        parentId: 'vig-2',
      },
    ],
  },
];

export const useSkillTreeStore = create<SkillTreeState>((set, get) => ({
  skillTrees: initialSkillTrees,
  playerPoints: 50,

  initializeSkillTrees: () => {
    set({ skillTrees: JSON.parse(JSON.stringify(initialSkillTrees)), playerPoints: 50 });
  },

  upgradeSkill: (treeId: string, nodeId: string) => {
    const state = get();
    const tree = state.skillTrees.find(t => t.id === treeId);
    if (!tree) return false;

    const node = tree.nodes.find(n => n.id === nodeId);
    if (!node || !node.isAvailable || node.level >= node.maxLevel) return false;

    if (state.playerPoints < node.cost) return false;

    set(prevState => ({
      playerPoints: prevState.playerPoints - node.cost,
      skillTrees: prevState.skillTrees.map(t => {
        if (t.id !== treeId) return t;

        return {
          ...t,
          totalPoints: t.totalPoints + 1,
          nodes: t.nodes.map(n => {
            if (n.id !== nodeId) return n;

            const upgraded = { ...n, level: n.level + 1 };

            // Unlock child nodes when parent reaches level 1
            return upgraded;
          }),
        };
      }),
    }));

    // Unlock dependent nodes
    set(prevState => ({
      skillTrees: prevState.skillTrees.map(t => {
        if (t.id !== treeId) return t;

        return {
          ...t,
          nodes: t.nodes.map(n => {
            if (n.parentId === nodeId) {
              const parent = t.nodes.find(p => p.id === nodeId);
              if (parent && parent.level > 0) {
                return { ...n, isLocked: false, isAvailable: true };
              }
            }
            return n;
          }),
        };
      }),
    }));

    return true;
  },

  getSkillTree: (treeId: string) => {
    return get().skillTrees.find(t => t.id === treeId);
  },

  addPlayerPoints: (amount: number) => {
    set(prevState => ({
      playerPoints: prevState.playerPoints + amount,
    }));
  },
}));

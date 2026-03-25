import { create } from 'zustand';

interface PlayerState {
  playerId: string | null;
  playerName: string;
  level: number;
  progress: number;
  isGuest: boolean;
  profilePicture: string | null;
  barracoLevel: number;

  // compatibilidade com páginas antigas
  playerMoney: number;

  setPlayerId: (id: string) => void;
  setPlayerName: (name: string) => void;
  setLevel: (level: number) => void;
  setProgress: (progress: number) => void;
  setIsGuest: (isGuest: boolean) => void;
  setProfilePicture: (url: string | null) => void;
  setBarracoLevel: (level: number) => void;

  // compatibilidade com páginas antigas
  setPlayerMoney: (money: number) => void;
  addPlayerMoney: (amount: number) => void;
  syncMoney: () => void;

  loadPlayerData: (data: Partial<PlayerState>) => void;
  resetPlayer: () => void;
}

export const usePlayerStore = create<PlayerState>((set, get) => ({
  playerId: null,
  playerName: 'COMANDANTE',
  level: 1,
  progress: 0,
  isGuest: false,
  profilePicture: null,
  barracoLevel: 1,

  // compatibilidade
  playerMoney: 0,

  setPlayerId: (id) => set({ playerId: id }),
  setPlayerName: (name) => set({ playerName: name }),
  setLevel: (level) => set({ level: Math.min(100, Math.max(1, level)) }),
  setProgress: (progress) => set({ progress }),
  setIsGuest: (isGuest) => set({ isGuest }),
  setProfilePicture: (url) => set({ profilePicture: url }),
  setBarracoLevel: (level) => set({ barracoLevel: Math.max(1, level) }),

  setPlayerMoney: (money) => set({ playerMoney: Math.max(0, money) }),
  addPlayerMoney: (amount) =>
    set((state) => ({
      playerMoney: Math.max(0, state.playerMoney + amount),
    })),

  syncMoney: () => set((state) => ({ playerMoney: state.playerMoney })),

  loadPlayerData: (data) =>
    set((state) => ({
      ...state,
      ...data,
      level:
        typeof data.level === 'number'
          ? Math.min(100, Math.max(1, data.level))
          : state.level,
      barracoLevel:
        typeof data.barracoLevel === 'number'
          ? Math.max(1, data.barracoLevel)
          : state.barracoLevel,
      playerMoney:
        typeof data.playerMoney === 'number'
          ? Math.max(0, data.playerMoney)
          : state.playerMoney,
    })),

  resetPlayer: () =>
    set({
      playerId: null,
      playerName: 'COMANDANTE',
      level: 1,
      progress: 0,
      isGuest: false,
      profilePicture: null,
      barracoLevel: 1,
      playerMoney: 0,
    }),
}));
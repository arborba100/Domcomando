import { create } from 'zustand';
import { useDirtyMoneyStore } from '@/store/dirtyMoneyStore';

interface PlayerState {
  playerId: string | null;
  playerName: string;
  level: number;
  progress: number;
  isGuest: boolean;
  profilePicture: string | null;
  barracoLevel: number;

  // 🔥 espelho
  playerMoney: number;

  setPlayerId: (id: string) => void;
  setPlayerName: (name: string) => void;
  setLevel: (level: number) => void;
  setProgress: (progress: number) => void;
  setIsGuest: (isGuest: boolean) => void;
  setProfilePicture: (url: string | null) => void;
  setBarracoLevel: (level: number) => void;

  setPlayerMoney: (money: number) => void;
  addPlayerMoney: (amount: number) => void;

  syncMoney: () => void;
}

export const usePlayerStore = create<PlayerState>((set, get) => ({
  playerId: null,
  playerName: 'COMANDANTE',
  level: 10,
  progress: 0,
  isGuest: false,
  profilePicture: null,
  barracoLevel: 1,

  playerMoney: 0,

  setPlayerId: (id) => set({ playerId: id }),
  setPlayerName: (name) => set({ playerName: name }),
  setLevel: (level) => set({ level: Math.min(100, Math.max(1, level)) }),
  setProgress: (progress) => set({ progress }),
  setIsGuest: (isGuest) => set({ isGuest }),
  setProfilePicture: (url) => set({ profilePicture: url }),
  setBarracoLevel: (level) => set({ barracoLevel: Math.max(1, level) }),

  // 🔥 AGORA REDIRECIONA PRO DIRTY MONEY
  setPlayerMoney: (money) => {
    useDirtyMoneyStore.getState().setDirtyMoney(money);
    set({ playerMoney: money });
  },

  addPlayerMoney: (amount) => {
    const dirtyStore = useDirtyMoneyStore.getState();
    const newValue = dirtyStore.dirtyMoney + amount;
    dirtyStore.setDirtyMoney(newValue);
    set({ playerMoney: newValue });
  },

  // 🔥 sincroniza manualmente
  syncMoney: () => {
    const dirty = useDirtyMoneyStore.getState().dirtyMoney;
    set({ playerMoney: dirty });
  },
}));
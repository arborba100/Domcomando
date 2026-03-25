import { create } from 'zustand';

export interface BusinessUpgradeState {
  id: string;
  level: number;
  upgrading: boolean;
  endTime?: number;
}

export interface BusinessInvestmentStore {
  upgrades: Record<string, BusinessUpgradeState>;
  upgradeBusinessSkill: (upgradeId: string, cost: number, duration: number) => boolean;
  finalizeUpgrade: (upgradeId: string) => void;
  canUpgrade: (upgradeId: string, dirtyMoney: number) => boolean;
  getRemainingTime: (upgrade: BusinessUpgradeState) => number;
  getUpgrade: (upgradeId: string) => BusinessUpgradeState | undefined;
}

export const useBusinessInvestmentStore = create<BusinessInvestmentStore>((set, get) => ({
  upgrades: {},

  upgradeBusinessSkill: (upgradeId, cost, duration) => {
    const state = get();
    const upgrade = state.upgrades[upgradeId];

    if (upgrade?.upgrading) {
      return false;
    }

    set((prevState) => ({
      upgrades: {
        ...prevState.upgrades,
        [upgradeId]: {
          ...upgrade,
          id: upgradeId,
          level: (upgrade?.level || 0) + 1,
          upgrading: true,
          endTime: Date.now() + duration * 1000,
        },
      },
    }));

    return true;
  },

  finalizeUpgrade: (upgradeId) => {
    set((prevState) => ({
      upgrades: {
        ...prevState.upgrades,
        [upgradeId]: {
          ...prevState.upgrades[upgradeId],
          upgrading: false,
          endTime: undefined,
        },
      },
    }));
  },

  canUpgrade: (upgradeId, dirtyMoney) => {
    const state = get();
    const upgrade = state.upgrades[upgradeId];
    return !upgrade?.upgrading && dirtyMoney > 0;
  },

  getRemainingTime: (upgrade) => {
    if (!upgrade.upgrading || !upgrade.endTime) return 0;
    return Math.max(0, upgrade.endTime - Date.now());
  },

  getUpgrade: (upgradeId) => {
    return get().upgrades[upgradeId];
  },
}));

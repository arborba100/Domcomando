import { create } from 'zustand';

export interface LaunderingOperation {
  businessId: string;
  businessName: string;
  amount: number;
  rate: number;
  timeRemaining: number;
  completionTime: number;
  cleanedAmount: number;
  status: 'pending' | 'processing' | 'completed';
  startedAt: Date;
  lastOperationDate: string; // YYYY-MM-DD format
}

interface MoneyLaunderingStore {
  operations: LaunderingOperation[];
  addOperation: (operation: LaunderingOperation) => void;
  updateOperation: (businessId: string, updates: Partial<LaunderingOperation>) => void;
  removeOperation: (businessId: string) => void;
  getLastOperationDate: (businessId: string) => string | null;
  canOperateToday: (businessId: string) => boolean;
  getActiveOperation: (businessId: string) => LaunderingOperation | null;
}

export const useMoneyLaunderingStore = create<MoneyLaunderingStore>((set, get) => ({
  operations: [],

  addOperation: (operation) => {
    set((state) => ({
      operations: [...state.operations, operation],
    }));
  },

  updateOperation: (businessId, updates) => {
    set((state) => ({
      operations: state.operations.map((op) =>
        op.businessId === businessId ? { ...op, ...updates } : op
      ),
    }));
  },

  removeOperation: (businessId) => {
    set((state) => ({
      operations: state.operations.filter((op) => op.businessId !== businessId),
    }));
  },

  getLastOperationDate: (businessId) => {
    const state = get();
    const operation = state.operations.find((op) => op.businessId === businessId);
    return operation?.lastOperationDate || null;
  },

  canOperateToday: (businessId) => {
    const state = get();
    const today = new Date().toISOString().split('T')[0];
    const lastDate = state.getLastOperationDate(businessId);
    return lastDate !== today;
  },

  getActiveOperation: (businessId) => {
    const state = get();
    return state.operations.find((op) => op.businessId === businessId && op.status === 'processing') || null;
  },
}));

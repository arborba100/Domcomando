import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type LaunderingOperation = {
  id: string;
  businessType: string;
  amount: number;
  returnAmount: number;
  startTime: number;
  endTime: number;
  risk: 'low' | 'medium' | 'high';
  status: 'running' | 'completed';
};

export type BusinessType = 'lava-rapido' | 'bar' | 'oficina' | 'balada' | 'empresa-fantasma';

export const BUSINESSES = {
  'lava-rapido': {
    name: 'Lava Rápido',
    risk: 'low' as const,
    conversion: 0.8,
    time: 5 * 60 * 1000, // 5 minutes
    description: 'Lavagem rápida e segura',
    minRespect: 0,
  },
  'bar': {
    name: 'Bar / Adega',
    risk: 'low' as const,
    conversion: 1.0,
    time: 10 * 60 * 1000, // 10 minutes
    description: 'Negócio clássico e confiável',
    minRespect: 5,
  },
  'oficina': {
    name: 'Oficina Mecânica',
    risk: 'medium' as const,
    conversion: 1.2,
    time: 20 * 60 * 1000, // 20 minutes
    description: 'Maior risco, maior retorno',
    minRespect: 15,
  },
  'balada': {
    name: 'Balada / Casa Noturna',
    risk: 'medium' as const,
    conversion: 1.5,
    time: 30 * 60 * 1000, // 30 minutes
    description: 'Operação sofisticada',
    minRespect: 30,
  },
  'empresa-fantasma': {
    name: 'Empresa Fantasma',
    risk: 'high' as const,
    conversion: 2.0,
    time: 60 * 60 * 1000, // 1 hour
    description: 'Máximo risco, máximo retorno',
    minRespect: 50,
  },
};

export const RISK_FAILURE_CHANCE = {
  low: 0.05,
  medium: 0.15,
  high: 0.3,
};

interface CommercialCenterState {
  operations: LaunderingOperation[];
  addOperation: (operation: LaunderingOperation) => void;
  removeOperation: (id: string) => void;
  updateOperation: (id: string, updates: Partial<LaunderingOperation>) => void;
  getActiveOperations: () => LaunderingOperation[];
  getCompletedOperations: () => LaunderingOperation[];
  clearOperations: () => void;
}

export const useCommercialCenterStore = create<CommercialCenterState>()(
  persist(
    (set, get) => ({
      operations: [],
      addOperation: (operation) =>
        set((state) => ({
          operations: [...state.operations, operation],
        })),
      removeOperation: (id) =>
        set((state) => ({
          operations: state.operations.filter((op) => op.id !== id),
        })),
      updateOperation: (id, updates) =>
        set((state) => ({
          operations: state.operations.map((op) =>
            op.id === id ? { ...op, ...updates } : op
          ),
        })),
      getActiveOperations: () =>
        get().operations.filter((op) => op.status === 'running'),
      getCompletedOperations: () =>
        get().operations.filter((op) => op.status === 'completed'),
      clearOperations: () => set({ operations: [] }),
    }),
    {
      name: 'commercial-center-store',
    }
  )
);

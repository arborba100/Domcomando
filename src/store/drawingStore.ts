import { create } from 'zustand';

interface DrawingState {
  tool: 'pen' | 'eraser';
  color: string;
  lineWidth: number;
  setTool: (tool: 'pen' | 'eraser') => void;
  setColor: (color: string) => void;
  setLineWidth: (width: number) => void;
  clearCanvas: () => void;
  _clearTrigger: number;
}

export const useDrawingStore = create<DrawingState>((set) => ({
  tool: 'pen',
  color: 'red',
  lineWidth: 5,
  _clearTrigger: 0,
  setTool: (tool) => set({ tool }),
  setColor: (color) => set({ tool: 'pen', color }),
  setLineWidth: (width) => set({ lineWidth: width }),
  clearCanvas: () => set((state) => ({ _clearTrigger: state._clearTrigger + 1 })),
}));

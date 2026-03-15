import { create } from 'zustand';

export type GameScreen = 'menu' | 'map' | 'location' | 'character' | 'inventory' | 'status';

interface GameScreenState {
  currentScreen: GameScreen;
  selectedLocation: string | null;
  selectedCharacter: string | null;
  setScreen: (screen: GameScreen) => void;
  setSelectedLocation: (location: string | null) => void;
  setSelectedCharacter: (character: string | null) => void;
}

export const useGameScreenStore = create<GameScreenState>((set) => ({
  currentScreen: 'menu',
  selectedLocation: null,
  selectedCharacter: null,
  setScreen: (screen) => set({ currentScreen: screen }),
  setSelectedLocation: (location) => set({ selectedLocation: location }),
  setSelectedCharacter: (character) => set({ selectedCharacter: character }),
}));

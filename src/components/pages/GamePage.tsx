import { useGameScreenStore } from '@/store/gameScreenStore';
import GameMenuScreen from '@/components/game/GameMenuScreen';
import GameMapScreen from '@/components/game/GameMapScreen';
import GameLocationScreen from '@/components/game/GameLocationScreen';
import GameCharacterScreen from '@/components/game/GameCharacterScreen';
import GameInventoryScreen from '@/components/game/GameInventoryScreen';
import GameStatusScreen from '@/components/game/GameStatusScreen';

export default function GamePage() {
  const currentScreen = useGameScreenStore((state) => state.currentScreen);

  return (
    <div className="w-screen h-screen bg-black overflow-hidden">
      {currentScreen === 'menu' && <GameMenuScreen />}
      {currentScreen === 'map' && <GameMapScreen />}
      {currentScreen === 'location' && <GameLocationScreen />}
      {currentScreen === 'character' && <GameCharacterScreen />}
      {currentScreen === 'inventory' && <GameInventoryScreen />}
      {currentScreen === 'status' && <GameStatusScreen />}
    </div>
  );
}

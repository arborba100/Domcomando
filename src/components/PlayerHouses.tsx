import { useGameStore } from "@/store/gameStore";

export default function PlayerHouses() {
  const players = useGameStore((s) => s.players);

  return (
    <>
      {Object.values(players).map((player: any) => (
        <div key={player.playerId}>
          Casa nível {player.level}
        </div>
      ))}
    </>
  );
}

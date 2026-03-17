export interface Faction {
  id: string;
  name: string;
  leaderId: string;
  members: string[];
}

export function createFaction(name: string, leaderId: string): Faction {
  return {
    id: crypto.randomUUID(),
    name,
    leaderId,
    members: [leaderId],
  };
}

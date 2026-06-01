export interface Player {
  id: string;
  name: string;
  firstName?: string;
  lastName?: string;
  age?: number;
  birthdate?: string;
  nationality?: string;
  height?: string;
  weight?: string;
  number?: number;
  team?: string;
  league?: string;
  position?: string;
  photo?: string;
  externalId?: number;
  location?: { type: 'Point'; coordinates: number[] };
  created?: string;
}

export async function fetchPlayers(apiBase: string): Promise<Player[]> {
  const res = await fetch(`${apiBase}/players`);
  if (!res.ok) throw new Error(`Error fetching players: ${res.statusText}`);
  return res.json();
}

export async function fetchPlayerById(apiBase: string, id: string): Promise<Player> {
  const res = await fetch(`${apiBase}/players/${id}`);
  if (!res.ok) throw new Error(`Error fetching player ${id}: ${res.statusText}`);
  return res.json();
}

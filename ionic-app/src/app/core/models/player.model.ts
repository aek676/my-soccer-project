export interface PlayerModel {
  id: string | number;
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
  location?: {
    type: string;
    coordinates: number[];
  };
  created?: string;
}

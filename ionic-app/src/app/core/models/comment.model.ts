export interface CommentModel {
  id: string;
  author: string;
  text: string;
  rating: number;
  created: string;
  location: {
    type: string;
    coordinates: number[];
  };
  idPlayer: string;
  idUser?: string;
}

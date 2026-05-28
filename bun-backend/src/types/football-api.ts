export interface ApiSportsPlayer {
	player: {
		id: number;
		name: string;
		firstname: string | null;
		lastname: string | null;
		age: number | null;
		birth: {
			date: string | null;
			place: string | null;
			country: string;
		};
		nationality: string | null;
		height: string | null;
		weight: string | null;
		number: number | null;
		position: string | null;
		photo: string | null;
	};
}

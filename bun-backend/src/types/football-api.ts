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

export interface ApiSportsPlayerEntry {
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
		injured: boolean;
		photo: string | null;
	};
	statistics: Array<{
		team: {
			id: number;
			name: string;
			logo: string;
		};
		league: {
			id: number;
			name: string;
			country: string;
			logo: string;
			flag: string | null;
			season: number;
		};
		games: {
			appearences: number | null;
			lineups: number | null;
			minutes: number | null;
			number: number | null;
			position: string | null;
			rating: string | null;
			captain: boolean;
		};
		goals: {
			total: number | null;
			conceded: number | null;
			assists: number | null;
			saves: number | null;
		};
	}>;
}

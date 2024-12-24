export interface GameResponse {
  games: GameScore[];
}

export type GameScore = {
  [key: string]: number;  // Team name as key, score as value
}; 
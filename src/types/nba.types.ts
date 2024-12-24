export interface GameResponse {
  games: GameScore[];
}

export type GameScore = {
  [key: string]: number;  // Team name as key, score as value
}; 

export interface TeamResponse {
  team: string;
  win_count: number;
  loss_count: number;
  game_count: number;
  division: string;
  abbreviation: string;
}

export type Conference = 'East' | 'West';
export type Division = 'Atlantic' | 'Pacific' | 'Central' | 'Southeast' | 'Northwest' | 'Southwest';

export interface TeamFilters {
  season: number;
  conference?: Conference;
  division?: Division;
  team_name?: string;
} 

export type StatCategory = 'points' | 'rebounds' | 'assists' | 'blocks' | 'steals';
export type StatType = 'average' | 'total';

export interface LeaderFilters {
  season: number;
  category: StatCategory;
  teamName?: string;
  limit?: number;
  type?: StatType;
}

export interface Leader {
  player_name: string;
  team_name: string;
  steal_count?: number;
  point_count?: number;
  total_rebound?: number;
  assist_count?: number;
  block_count?: number;
}

export interface LeadersResponse {
  leaders: Leader[];
} 
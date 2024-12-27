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

export type StatCategory = 
  | 'points' 
  | 'rebounds' 
  | 'assists' 
  | 'blocks' 
  | 'steals'
  | 'field_goal_percentage'
  | 'free_throw_percentage'
  | 'three_point_percentage'
  | 'minutes_played';
export type StatType = 'average' | 'total';

export interface LeaderFilters {
  season: number;
  category: StatCategory;
  teamName?: string;
  limit?: number;
  page?: number;
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
  field_goal_percentage?: number;
  free_throw_percentage?: number;
  three_point_percentage?: number;
  minutes_played?: number;
}

export interface LeadersResponse {
  leaders: Leader[];
  total_count: number;
} 

export interface StatsData {
  player_name: string;
  team_name: string;
  value: number;
} 
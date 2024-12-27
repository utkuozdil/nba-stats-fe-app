import axios from 'axios';
import { GameResponse, TeamResponse, TeamFilters, LeaderFilters, LeadersResponse, StatsData } from '../types/nba.types';
import { API_CONFIG, buildGamesUrl } from '../config/api.config';

const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: false
});

export class NBAService {
  static async getGamesByDate(date: string): Promise<GameResponse> {
    try {
      const { data } = await api.get<GameResponse>(buildGamesUrl(date));
      return data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || error.message);
      }
      throw error;
    }
  }

  static async getTeams(filters: TeamFilters): Promise<TeamResponse[]> {
    try {
      const params = new URLSearchParams();
      params.append('season', filters.season.toString());
      
      if (filters.conference) params.append('conference', filters.conference);
      if (filters.division) params.append('division', filters.division);
      if (filters.team_name) params.append('team_name', filters.team_name);

      const { data } = await api.get<TeamResponse[]>(`/dev/teams?${params.toString()}`);
      return data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || error.message);
      }
      throw error;
    }
  }

  static async getLeaders({ season, category, type }: LeaderFilters): Promise<LeadersResponse> {
    try {
      const params = new URLSearchParams({
        season: season.toString(),
        category
      });

      if (type) {
        params.append('type', type);
      }

      const url = `/dev/leaders?${params.toString()}`;
      const response = await api.get<LeadersResponse>(url);
      
      return response.data;
    } catch (error) {
      console.error('Error fetching leaders:', error);
      throw error;
    }
  }

  static async getAdvancedStats(category: string): Promise<{ leaders: StatsData[] }> {
    try {
      const { data } = await api.get(`/dev/advanced-stats?category=${category}`);
      return data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || error.message);
      }
      throw error;
    }
  }
} 
import axios from 'axios';
import { GameResponse, TeamResponse, TeamFilters, LeaderFilters, LeadersResponse } from '../types/nba.types';
import { API_CONFIG, buildGamesUrl } from '../config/api.config';

const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: false
});

export const NBAService = {
  getGamesByDate: async (date: string): Promise<GameResponse> => {
    try {
      const { data } = await api.get<GameResponse>(buildGamesUrl(date));
      return data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || error.message);
      }
      throw error;
    }
  },
  getTeams: async (filters: TeamFilters): Promise<TeamResponse[]> => {
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
  },
  getLeaders: async (filters: LeaderFilters): Promise<LeadersResponse> => {
    try {
      const params = new URLSearchParams();
      params.append('season', filters.season.toString());
      params.append('category', filters.category);
      
      if (filters.teamName) params.append('teamName', filters.teamName);
      if (filters.limit) params.append('limit', filters.limit.toString());
      if (filters.type) params.append('type', filters.type);

      const { data } = await api.get<LeadersResponse>(`/dev/leaders?${params.toString()}`);
      return data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || error.message);
      }
      throw error;
    }
  }
}; 
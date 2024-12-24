import axios from 'axios';
import { GameResponse } from '../types/nba.types';
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
  }
}; 
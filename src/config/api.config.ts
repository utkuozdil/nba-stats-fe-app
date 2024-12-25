export const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_BASE_URL,
};

export const buildGamesUrl = (date: string): string => {
  return `/dev/games?date=${date}`;
}; 
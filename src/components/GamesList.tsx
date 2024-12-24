import React from 'react';
import { GameResponse } from '../types/nba.types';
import { NBAService } from '../services/api.service';
import { cacheService } from '../utils/cache';
import './GamesList.css';

interface GamesListProps {
  selectedDate: string;
  setGames: (games: GameResponse | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  games: GameResponse | null;
  loading: boolean;
  error: string | null;
}

const GamesList: React.FC<GamesListProps> = ({
  selectedDate,
  setGames,
  setLoading,
  setError,
  games,
  loading,
  error
}) => {
  const fetchGames = async () => {
    try {
      setLoading(true);

      // Check cache first
      const cacheKey = `games-${selectedDate}`;
      const cachedData = cacheService.get<GameResponse>(cacheKey);

      if (cachedData) {
        setGames(cachedData);
        setError(null);
        setLoading(false);
        return;
      }

      // If not in cache, fetch from API
      const data = await NBAService.getGamesByDate(selectedDate);
      
      // Store in cache
      cacheService.set(cacheKey, data);
      
      setGames(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch NBA games');
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchGames();
  }, [selectedDate]);

  return (
    <div className="games-container">
      {loading && <div className="loading">Loading games...</div>}
      {error && <div className="error">{error}</div>}
      
      {!loading && !error && games && (
        <div className="games-list">
          {games.games.length === 0 ? (
            <div className="no-games">No games scheduled for this date</div>
          ) : (
            games.games.map((game, index) => {
              const [team1, team2] = Object.entries(game);
              return (
                <div key={index} className="game-card">
                  <div className="team">
                    <span className="team-name">{team1[0]}</span>
                    <span className="team-score">{team1[1]}</span>
                  </div>
                  <div className="team">
                    <span className="team-name">{team2[0]}</span>
                    <span className="team-score">{team2[1]}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};

export default GamesList; 
import React, { useState, useEffect } from 'react';
import { GameResponse } from '../types/nba.types';
import { NBAService } from '../services/api.service';
import { cacheService } from '../utils/cache';
import './GamesList.css';

const GamesList: React.FC = () => {
  const [games, setGames] = useState<GameResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });

  // Helper function to format date for min/max attributes
  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  // Get current season's date range
  const getCurrentSeasonDates = () => {
    const today = new Date();
    const currentYear = today.getFullYear();
    const seasonStart = new Date(currentYear, 9, 1); // October 1st
    const seasonEnd = new Date(currentYear + 1, 5, 30); // June 30th next year
    
    return {
      min: formatDate(seasonStart),
      max: formatDate(seasonEnd)
    };
  };

  const seasonDates = getCurrentSeasonDates();

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

  useEffect(() => {
    fetchGames();
  }, [selectedDate]);

  return (
    <div className="games-container">
      <div className="date-picker-container">
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          min={seasonDates.min}
          max={seasonDates.max}
          className="date-input"
        />
      </div>

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
                  <div className={`team ${team1[1] > team2[1] ? 'winning-team' : ''}`}>
                    <span className="team-name">{team1[0]}</span>
                    <span className="team-score">{team1[1]}</span>
                  </div>
                  <div className={`team ${team2[1] > team1[1] ? 'winning-team' : ''}`}>
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
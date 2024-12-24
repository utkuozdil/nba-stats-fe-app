import React, { useState, useEffect } from 'react';
import './App.css';
import { NBAService } from './services/api.service';
import { GameResponse } from './types/nba.types';

function App() {
  const [games, setGames] = useState<GameResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];  // Format: YYYY-MM-DD
  });

  useEffect(() => {
    const fetchGames = async () => {
      try {
        setLoading(true);
        console.log('Fetching games for date:', selectedDate);
        const data = await NBAService.getGamesByDate(selectedDate);
        console.log('API Response:', data);
        setGames(data);
        setError(null);
      } catch (err) {
        console.error('API Error:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch NBA games');
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, [selectedDate]);

  const renderGames = () => {
    if (loading) return <div className="loading">Loading NBA games...</div>;
    if (error) return <div className="error">{error}</div>;
    if (!games?.games || games.games.length === 0) {
      return <div className="no-games">No games scheduled for this date</div>;
    }

    return (
      <div className="game-grid">
        {games.games.map((game, index) => {
          const [team1, team2] = Object.entries(game);
          return (
            <div key={index} className="game-card">
              <div className="teams">
                <div className="team home">
                  <h3>{team1[0]}</h3>
                  <div className="score">{team1[1]}</div>
                </div>
                <div className="vs">VS</div>
                <div className="team away">
                  <h3>{team2[0]}</h3>
                  <div className="score">{team2[1]}</div>
                </div>
              </div>
              <div className="status">Final</div>
            </div>
          );
        })}
      </div>
    );
  };

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

  return (
    <div className="App">
      <header className="App-header">
        <h1>NBA Stats</h1>
        <div className="date-picker">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            min={seasonDates.min}
            max={seasonDates.max}
            className="date-input"
          />
        </div>
      </header>
      <main className="container">
        {renderGames()}
      </main>
    </div>
  );
}

export default App; 
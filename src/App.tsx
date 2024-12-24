import React, { useState, useEffect } from 'react';
import './App.css';
import { NBAService } from './services/api.service';
import { GameResponse } from './types/nba.types';
import TeamStandings from './components/TeamStandings';
import GamesList from './components/GamesList';
import Sidebar from './components/Sidebar';
import Leaders from './components/Leaders';

function App() {
  const [games, setGames] = useState<GameResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [showDatePicker, setShowDatePicker] = useState(true);

  const handleNavigation = (section: string, showPicker: boolean) => {
    setShowDatePicker(showPicker);
  };

  useEffect(() => {
    const fetchGames = async () => {
      try {
        setLoading(true);
        const data = await NBAService.getGamesByDate(selectedDate);
        setGames(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch NBA games');
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, [selectedDate]);

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
      <Sidebar onNavigate={handleNavigation} />
      <header className="App-header">
        <h1>NBA Stats</h1>
        <div className={`date-picker ${showDatePicker ? 'visible' : 'hidden'}`}>
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
        <section id="games">
          <GamesList 
            selectedDate={selectedDate}
            setGames={setGames}
            setLoading={setLoading}
            setError={setError}
            games={games}
            loading={loading}
            error={error}
          />
        </section>
        <section id="standings">
          <TeamStandings />
        </section>
        <section id="leaders">
          <Leaders />
        </section>
      </main>
    </div>
  );
}

export default App; 
import React, { useState, useEffect } from 'react';
import { NBAService } from '../services/api.service';
import { TeamResponse, Division, Conference, TeamFilters } from '../types/nba.types';
import './TeamStandings.css';
import { cacheService } from '../utils/cache';

const TeamStandings: React.FC = () => {
  const [teams, setTeams] = useState<TeamResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'conference' | 'division'>('conference');
  const [selectedValue, setSelectedValue] = useState<string>('West');

  // Add default values for each filter type
  const defaultValues = {
    conference: 'West',
    division: 'Pacific'
  };

  // Handle filter type change
  const handleFilterChange = (newFilter: 'conference' | 'division') => {
    setFilter(newFilter);
    // Set the default value for the new filter type
    setSelectedValue(defaultValues[newFilter]);
  };

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        setLoading(true);

        // Check cache first
        const cacheKey = `standings-${filter}-${selectedValue}-2024`;
        const cachedData = cacheService.get<TeamResponse[]>(cacheKey);

        if (cachedData) {
          setTeams(cachedData);
          setError(null);
          setLoading(false);
          return;
        }

        // If not in cache, fetch from API
        const filters: TeamFilters = {
          season: 2024,
          ...(filter === 'conference' ? { conference: selectedValue as Conference } : {}),
          ...(filter === 'division' ? { division: selectedValue as Division } : {})
        };

        const data = await NBAService.getTeams(filters);
        
        // Store in cache
        cacheService.set(cacheKey, data);
        
        setTeams(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch teams');
      } finally {
        setLoading(false);
      }
    };

    fetchTeams();
  }, [filter, selectedValue]);

  return (
    <div className="standings-container">
      <div className="filter-controls">
        <select 
          value={filter}
          onChange={(e) => handleFilterChange(e.target.value as 'conference' | 'division')}
          className="filter-select"
        >
          <option value="conference">Conference</option>
          <option value="division">Division</option>
        </select>
        
        {filter === 'conference' ? (
          <select 
            value={selectedValue}
            onChange={(e) => setSelectedValue(e.target.value)}
            className="filter-select"
          >
            <option value="East">Eastern</option>
            <option value="West">Western</option>
          </select>
        ) : (
          <select 
            value={selectedValue}
            onChange={(e) => setSelectedValue(e.target.value)}
            className="filter-select"
          >
            <option value="Atlantic">Atlantic</option>
            <option value="Pacific">Pacific</option>
            <option value="Central">Central</option>
            <option value="Southeast">Southeast</option>
            <option value="Northwest">Northwest</option>
            <option value="Southwest">Southwest</option>
          </select>
        )}
      </div>

      {loading && <div className="loading">Loading standings...</div>}
      {error && <div className="error">{error}</div>}
      
      {!loading && !error && (
        <div className="standings-table">
          <div className="standings-header">
            <span className="team-cell">Team</span>
            <span className="record-cell">W</span>
            <span className="record-cell">L</span>
            <span className="record-cell">GP</span>
          </div>
          {teams.map((team) => (
            <div key={team.abbreviation} className="standings-row">
              <span className="team-cell">{team.team}</span>
              <span className="record-cell">{team.win_count}</span>
              <span className="record-cell">{team.loss_count}</span>
              <span className="record-cell">{team.game_count}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TeamStandings; 
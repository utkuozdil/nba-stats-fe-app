import React, { useState, useEffect } from 'react';
import { NBAService } from '../services/api.service';
import { LeadersResponse, StatCategory } from '../types/nba.types';
import './Leaders.css';
import { cacheService } from '../utils/cache';

const Leaders: React.FC = () => {
  const [leaders, setLeaders] = useState<LeadersResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [category, setCategory] = useState<StatCategory>('points');

  const categories: { value: StatCategory; label: string }[] = [
    { value: 'points', label: 'Points' },
    { value: 'rebounds', label: 'Rebounds' },
    { value: 'assists', label: 'Assists' },
    { value: 'blocks', label: 'Blocks' },
    { value: 'steals', label: 'Steals' }
  ];

  useEffect(() => {
    const fetchLeaders = async () => {
      try {
        setLoading(true);
        
        // Check cache first
        const cacheKey = `leaders-${category}-2024`;
        const cachedData = cacheService.get<LeadersResponse>(cacheKey);
        
        if (cachedData) {
          setLeaders(cachedData);
          setError(null);
          setLoading(false);
          return;
        }

        // If not in cache, fetch from API
        const data = await NBAService.getLeaders({
          season: 2024,
          category,
          limit: 10
        });
        
        // Store in cache
        cacheService.set(cacheKey, data);
        
        setLeaders(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch leaders');
      } finally {
        setLoading(false);
      }
    };

    fetchLeaders();
  }, [category]);

  const getStatValue = (leader: any) => {
    switch (category) {
      case 'points': return leader.point_count;
      case 'rebounds': return leader.total_rebound;
      case 'assists': return leader.assist_count;
      case 'blocks': return leader.block_count;
      case 'steals': return leader.steal_count;
      default: return 0;
    }
  };

  return (
    <div className="leaders-container">
      <div className="leaders-header">
        <h2>League Leaders</h2>
        <div className="category-select">
          {categories.map(cat => (
            <button
              key={cat.value}
              className={`category-btn ${category === cat.value ? 'active' : ''}`}
              onClick={() => setCategory(cat.value)}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {loading && <div className="loading">Loading leaders...</div>}
      {error && <div className="error">{error}</div>}
      
      {!loading && !error && leaders && (
        <div className="leaders-list">
          {leaders.leaders.map((leader, index) => (
            <div key={leader.player_name} className="leader-card">
              <div className="rank">{index + 1}</div>
              <div className="player-info">
                <div className="player-name">{leader.player_name}</div>
                <div className="team-name">{leader.team_name}</div>
              </div>
              <div className="stat-value">
                {getStatValue(leader)?.toFixed(2)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Leaders; 
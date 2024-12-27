import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { NBAService } from '../services/api.service';
import { cacheService } from '../utils/cache';
import './AdvancedStats.css';

const CATEGORIES = [
  { value: 'ts_percentage', label: 'True Shooting %' },
  { value: 'efg_percentage', label: 'Effective Field Goal %' },
  { value: 'usage_rate', label: 'Usage Rate' },
  { value: 'off_rating', label: 'Offensive Rating' },
  { value: 'def_rating', label: 'Defensive Rating' },
  { value: 'net_rating', label: 'Net Rating' }
];

interface StatsData {
  player_name: string;
  team_name: string;
  value: number;
}

const AdvancedStats: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState(CATEGORIES[0].value);
  const [data, setData] = useState<StatsData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [limit, setLimit] = useState<number>(10);

  const limitOptions = [10, 25, 50, 100];

  // Get paginated data based on current limit
  const getPaginatedData = () => {
    return data.slice(0, limit);
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Check cache first
        const cacheKey = `advanced-stats-${selectedCategory}`;
        const cachedData = cacheService.get<StatsData[]>(cacheKey);

        if (cachedData) {
          setData(cachedData);
          setLoading(false);
          return;
        }

        // If not in cache, fetch from API
        const response = await NBAService.getAdvancedStats(selectedCategory);
        
        // Store in cache
        cacheService.set(cacheKey, response.leaders);
        
        setData(response.leaders);
      } catch (err) {
        setError('Failed to fetch stats');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedCategory]);

  return (
    <div className="advanced-stats-container">
      <div className="advanced-stats-header">
        <h2>Advanced Stats</h2>
      </div>
      <div className="controls">
        <select 
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="category-select"
        >
          {CATEGORIES.map(category => (
            <option key={category.value} value={category.value}>
              {category.label}
            </option>
          ))}
        </select>
        <div className="limit-select">
          <label>Show:</label>
          <select 
            value={limit} 
            onChange={(e) => setLimit(Number(e.target.value))}
            className="limit-dropdown"
          >
            {limitOptions.map(opt => (
              <option key={opt} value={opt}>{opt === 100 ? 'All' : opt}</option>
            ))}
          </select>
          <span className="total-items">of {data.length} items</span>
        </div>
      </div>

      {loading && <div className="loading">Loading...</div>}
      {error && <div className="error">{error}</div>}
      
      {!loading && !error && (
        <div className="chart-container">
          <ResponsiveContainer width="100%" height={400}>
            <BarChart
              data={getPaginatedData()}
              margin={{ top: 20, right: 30, left: 20, bottom: 100 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
              <XAxis 
                dataKey="player_name" 
                angle={-45}
                textAnchor="end"
                height={100}
                tick={{ fill: 'rgba(255, 255, 255, 0.8)' }}
              />
              <YAxis tick={{ fill: 'rgba(255, 255, 255, 0.8)' }} />
              <Tooltip 
                cursor={{ fill: 'rgba(97, 218, 251, 0.1)' }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="custom-tooltip">
                        <p className="player">{data.player_name}</p>
                        <p className="team">{data.team_name}</p>
                        <p className="value">{data.value.toFixed(1)}</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar 
                dataKey="value" 
                fill="#61dafb"
                radius={[4, 4, 0, 0]}
                onMouseOver={(data, index) => {
                  // Custom hover effect if needed
                }}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default AdvancedStats; 
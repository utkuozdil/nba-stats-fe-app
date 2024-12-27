import React, { useState, useEffect } from 'react';
import { NBAService } from '../services/api.service';
import { LeadersResponse, StatCategory, StatType, Leader } from '../types/nba.types';
import './Leaders.css';
import { cacheService } from '../utils/cache';

const ITEMS_PER_PAGE = 10;

const Leaders: React.FC = () => {
  const [leaders, setLeaders] = useState<LeadersResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [category, setCategory] = useState<StatCategory>('points');
  const [statType, setStatType] = useState<StatType>('average');
  const [limit, setLimit] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState<number>(0);

  const isPercentageStat = (cat: StatCategory) => {
    return ['field_goal_percentage', 'free_throw_percentage', 'three_point_percentage'].includes(cat);
  };

  const categories: { id: StatCategory; label: string }[] = [
    { id: 'points', label: 'Points' },
    { id: 'rebounds', label: 'Rebounds' },
    { id: 'assists', label: 'Assists' },
    { id: 'steals', label: 'Steals' },
    { id: 'blocks', label: 'Blocks' },
    { id: 'field_goal_percentage', label: 'FG%' },
    { id: 'free_throw_percentage', label: 'FT%' },
    { id: 'three_point_percentage', label: '3P%' },
    { id: 'minutes_played', label: 'Minutes' }
  ];

  const limitOptions = [10, 25, 50, 100, 200, 500, 1000];

  // Function to paginate the data
  const getPaginatedData = (data: Leader[]) => {
    const startIndex = (currentPage - 1) * limit;
    const endIndex = startIndex + limit;
    return data.slice(startIndex, endIndex);
  };

  useEffect(() => {
    const fetchLeaders = async () => {
      try {
        setLoading(true);

        // Check cache first
        const cacheKey = `leaders-${category}-${statType}-2024`;
        const cachedData = cacheService.get<LeadersResponse>(cacheKey);

        if (cachedData) {
          setLeaders(cachedData);
          setTotalCount(cachedData.leaders.length);
          setError(null);
          setLoading(false);
          return;
        }

        // If not in cache, fetch from API
        const data = await NBAService.getLeaders({
          season: 2024,
          category,
          type: isPercentageStat(category) ? undefined : statType
        });

        const leadersResponse = {
          leaders: data.leaders,
          total_count: data.leaders.length
        };

        // Store in cache
        cacheService.set(cacheKey, leadersResponse);
        
        setLeaders(leadersResponse);
        setTotalCount(data.leaders.length);
        setError(null);
      } catch (err) {
        console.error('Error fetching leaders:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch leaders');
      } finally {
        setLoading(false);
      }
    };

    fetchLeaders();
  }, [category, statType]);

  const totalPages = Math.ceil(totalCount / limit);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    setCurrentPage(1);
  };

  const getStatValue = (leader: any) => {
    const value = (() => {
      switch (category) {
        case 'points': return leader.point_count ?? 0;
        case 'rebounds': return leader.total_rebound ?? 0;
        case 'assists': return leader.assist_count ?? 0;
        case 'blocks': return leader.block_count ?? 0;
        case 'steals': return leader.steal_count ?? 0;
        case 'field_goal_percentage': return leader.field_goal_percentage ?? 0;
        case 'free_throw_percentage': return leader.free_throw_percentage ?? 0;
        case 'three_point_percentage': return leader.three_point_percentage ?? 0;
        case 'minutes_played': {
          if (!leader.minutes_played) return "0:00";
          // Format seconds to always show two digits
          const [minutes, seconds] = leader.minutes_played.split(':');
          return `${minutes}:${seconds.padStart(2, '0')}`;
        }
        default: return 0;
      }
    })();

    if (value === null || value === undefined) {
      return '0';
    }

    if (isPercentageStat(category)) {
      return `${Math.round(value * 100)}%`;
    }

    if (category === 'minutes_played') {
      return value; // Return the time string directly
    }

    return statType === 'total' ? Math.round(value).toString() : Number(value).toFixed(2);
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      
      if (currentPage > 3) {
        pages.push('...');
      }
      
      for (let i = Math.max(2, currentPage - 1); i <= Math.min(currentPage + 1, totalPages - 1); i++) {
        pages.push(i);
      }
      
      if (currentPage < totalPages - 2) {
        pages.push('...');
      }
      
      pages.push(totalPages);
    }
    
    return pages;
  };

  const renderPagination = () => (
    <div className="pagination">
      <button
        className="page-btn"
        disabled={currentPage === 1}
        onClick={() => handlePageChange(1)}
        title="First Page"
      >
        «
      </button>
      <button
        className="page-btn"
        disabled={currentPage === 1}
        onClick={() => handlePageChange(currentPage - 1)}
        title="Previous Page"
      >
        ‹
      </button>
      
      <div className="page-numbers">
        {getPageNumbers().map((page, index) => (
          typeof page === 'number' ? (
            <button
              key={index}
              className={`page-number ${currentPage === page ? 'active' : ''}`}
              onClick={() => handlePageChange(page)}
            >
              {page}
            </button>
          ) : (
            <span key={index} className="page-ellipsis">...</span>
          )
        ))}
      </div>

      <button
        className="page-btn"
        disabled={currentPage === totalPages}
        onClick={() => handlePageChange(currentPage + 1)}
        title="Next Page"
      >
        ›
      </button>
      <button
        className="page-btn"
        disabled={currentPage === totalPages}
        onClick={() => handlePageChange(totalPages)}
        title="Last Page"
      >
        »
      </button>
    </div>
  );

  return (
    <div className="leaders-container">
      <div className="leaders-header">
        <h2>League Leaders</h2>
        <div className="leaders-controls">
          {!isPercentageStat(category) && (
            <div className="stat-type-toggle">
              <button
                className={`toggle-btn ${statType === 'average' ? 'active' : ''}`}
                onClick={() => setStatType('average')}
              >
                Average
              </button>
              <button
                className={`toggle-btn ${statType === 'total' ? 'active' : ''}`}
                onClick={() => setStatType('total')}
              >
                Total
              </button>
            </div>
          )}
          <div className="category-buttons">
            {categories.map((cat) => (
              <button
                key={cat.id}
                className={`category-button ${cat.id === category ? 'active' : ''}`}
                onClick={() => setCategory(cat.id)}
              >
                {cat.label}
              </button>
            ))}
          </div>
          <div className="pagination-controls">
            <div className="limit-select">
              <label>Show:</label>
              <select 
                value={limit} 
                onChange={(e) => handleLimitChange(Number(e.target.value))}
                className="limit-dropdown"
              >
                {limitOptions.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
              <span className="total-items">of {totalCount} items</span>
            </div>
            {totalPages > 1 && renderPagination()}
          </div>
        </div>
      </div>

      {loading && <div className="loading">Loading leaders...</div>}
      {error && <div className="error">{error}</div>}
      
      {!loading && !error && leaders && (
        <>
          <div className="leaders-header-row">
            <div className="header-player">PLAYER/TEAM</div>
            <div className="header-value">
              {category === 'minutes_played' ? 'MIN' : 
               isPercentageStat(category) ? '%' : 
               statType === 'total' ? 'TOTAL' : 'AVG'}
            </div>
          </div>
          <div className="leaders-list">
            {getPaginatedData(leaders.leaders).map((leader, index) => (
              <div key={leader.player_name} className="leader-card">
                <div className="player-info">
                  <div className="rank">
                    {(currentPage - 1) * limit + index + 1}
                  </div>
                  <div className="player-details">
                    <div className="player-name">{leader.player_name}</div>
                    <div className="team-name">{leader.team_name}</div>
                  </div>
                </div>
                <div className="stat-value">
                  {getStatValue(leader)}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Leaders; 
import React from 'react';
import './Sidebar.css';

const Sidebar: React.FC = () => {
  const handleNavigation = (id: string) => {
    const element = document.getElementById(id);
    const header = document.querySelector('.App-header');
    if (element && header) {
      const headerHeight = header.getBoundingClientRect().height;
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      
      window.scrollTo({
        top: elementPosition - headerHeight - 20,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="sidebar">
      <nav className="sidebar-nav">
        <button 
          className="nav-item" 
          onClick={() => handleNavigation('games')}
        >
          Games
        </button>
        <button 
          className="nav-item" 
          onClick={() => handleNavigation('standings')}
        >
          Standings
        </button>
        <button 
          className="nav-item" 
          onClick={() => handleNavigation('leaders')}
        >
          Leaders
        </button>
        <button 
          className="nav-item" 
          onClick={() => handleNavigation('advanced')}
        >
          Advanced Stats
        </button>
      </nav>
    </div>
  );
};

export default Sidebar; 
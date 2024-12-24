import React from 'react';
import './Sidebar.css';

interface SidebarProps {
  onNavigate: (section: string, showDatePicker: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onNavigate }) => {
  const handleNavigation = (id: string, showDatePicker: boolean) => {
    const element = document.getElementById(id);
    const header = document.querySelector('.App-header');
    if (element && header) {
      const headerHeight = header.getBoundingClientRect().height;
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      
      window.scrollTo({
        top: elementPosition - headerHeight - 20,
        behavior: 'smooth'
      });
      
      onNavigate(id, showDatePicker);
    }
  };

  return (
    <div className="sidebar">
      <nav className="sidebar-nav">
        <button 
          className="nav-item" 
          onClick={() => handleNavigation('games', true)}
        >
          Games
        </button>
        <button 
          className="nav-item" 
          onClick={() => handleNavigation('standings', false)}
        >
          Standings
        </button>
        <button 
          className="nav-item" 
          onClick={() => handleNavigation('leaders', false)}
        >
          Leaders
        </button>
      </nav>
    </div>
  );
};

export default Sidebar; 
import React from 'react';
import './App.css';
import TeamStandings from './components/TeamStandings';
import GamesList from './components/GamesList';
import Sidebar from './components/Sidebar';
import Leaders from './components/Leaders';
import AdvancedStats from './components/AdvancedStats';

function App() {
  return (
    <div className="App">
      <Sidebar />
      <header className="App-header">
        <h1>NBA Stats</h1>
      </header>
      <main className="container">
        <section id="games">
          <GamesList />
        </section>
        <section id="standings">
          <TeamStandings />
        </section>
        <section id="leaders">
          <Leaders />
        </section>
        <section id="advanced">
          <AdvancedStats />
        </section>
      </main>
    </div>
  );
}

export default App; 
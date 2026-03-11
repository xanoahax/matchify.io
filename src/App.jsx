import { useTournament } from './context/TournamentContext';
import TournamentName from './components/Setup/TournamentName';
import PlayerInput from './components/Setup/PlayerInput';
import TeamManager from './components/Setup/TeamManager';
import TournamentTree from './components/Bracket/TournamentTree';
import Celebration from './components/Bracket/Celebration';

import MainMenu from './components/Setup/MainMenu';

function App() {
  const { currentStage, resetTournament, advanceStage } = useTournament();

  const renderStage = () => {
    switch (currentStage) {
      case 'MAIN_MENU':
        return <MainMenu />;
      case 'SETUP_NAME':
        return <TournamentName />;
      case 'SETUP_PLAYERS':
        return <PlayerInput />;
      case 'SETUP_TEAMS':
        return <TeamManager />;
      case 'BRACKET':
        return <TournamentTree />;
      case 'CELEBRATION':
        return <Celebration />;
      default:
        return <TournamentName />;
    }
  };

  return (
    <div className="app-container">
      <header className="header animate-fade-in" style={{ position: 'relative' }}>
        <h1 style={{ fontSize: '3rem' }}>
          Welcome to <span 
            className="text-gradient" 
            onClick={() => advanceStage('MAIN_MENU')} 
            style={{ cursor: 'pointer' }}
            title="Go to Start Screen"
          >
            PongBuddy
          </span>
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginTop: '8px' }}>
          Create and manage your custom tournaments with ease.
        </p>
        
        {currentStage !== 'MAIN_MENU' && currentStage !== 'SETUP_NAME' && (
          <button 
            onClick={() => {
              if(window.confirm('Are you sure you want to abandon this tournament? All progress will be lost.')) {
                resetTournament();
              }
            }}
            className="glass-button" 
            style={{ position: 'absolute', top: 0, right: 0, fontSize: '0.8rem', padding: '6px 12px' }}
          >
            🔄 Restart
          </button>
        )}
      </header>

      <main className="main-content">
        {renderStage()}
      </main>
    </div>
  );
}

export default App;

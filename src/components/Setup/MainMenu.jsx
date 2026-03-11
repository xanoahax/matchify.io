import { useState } from 'react';
import { useTournament } from '../../context/TournamentContext';
import HistoryView from '../Bracket/HistoryView';

export default function MainMenu() {
  const { advanceStage, players, resetTournament, history, clearHistory } = useTournament();
  const [selectedHistory, setSelectedHistory] = useState(null);

  const handleStartNew = () => {
    resetTournament();
    advanceStage('SETUP_PLAYERS');
  };

  const handleContinue = () => {
    if (players.length === 0) advanceStage('SETUP_PLAYERS');
    else advanceStage('RESTORE_PREVIOUS');
  };

  if (selectedHistory) {
    return <HistoryView tournament={selectedHistory} onBack={() => setSelectedHistory(null)} />;
  }

  const hasActiveUnfinished = players.length > 0;

  return (
    <div className="glass-panel animate-fade-in" style={{ padding: '40px', width: '100%', maxWidth: '600px', display: 'flex', flexDirection: 'column', gap: '40px' }}>
      
      {/* Active Tournament Section */}
      <div style={{ textAlign: 'center' }}>
        <h2 style={{ marginBottom: '16px', fontSize: '2rem' }}>Welcome Back</h2>
        {hasActiveUnfinished ? (
          <>
            <p style={{ color: 'var(--text-muted)', marginBottom: '24px', fontSize: '1.1rem' }}>
              You have an unfinished tournament: <br/>
              <strong style={{ color: 'var(--accent-secondary)' }}>"{tournamentName || 'Unnamed Tournament'}"</strong>
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center' }}>
              <button className="glass-button primary" onClick={handleContinue} style={{ width: '100%', maxWidth: '300px', padding: '16px' }}>
                ▶️ Continue
              </button>
              <button className="glass-button" onClick={handleStartNew} style={{ width: '100%', maxWidth: '300px' }}>
                ➕ Start New
              </button>
            </div>
            <p style={{ color: 'var(--error-color, #ff4d4d)', marginTop: '16px', fontSize: '0.8rem', opacity: 0.8 }}>
              Warning: Starting a new tournament will erase your saved progress.
            </p>
          </>
        ) : (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
             <button className="glass-button primary" onClick={handleStartNew} style={{ width: '100%', maxWidth: '300px', padding: '16px' }}>
                ➕ Start New Tournament
             </button>
          </div>
        )}
      </div>

      {/* History Section */}
      {history.length > 0 && (
        <div style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '30px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ color: 'var(--text-main)', margin: 0 }}>Past Tournaments</h3>
            <button 
              style={{ background: 'transparent', border: 'none', color: 'var(--error-color, #ff4d4d)', cursor: 'pointer', fontSize: '0.9rem', opacity: 0.8, transition: 'opacity 0.2s', padding: '4px 8px' }}
              onMouseOver={(e) => e.target.style.opacity = 1}
              onMouseOut={(e) => e.target.style.opacity = 0.8}
              onClick={() => {
                if(window.confirm('Do you really want to clear all past tournaments?')) {
                  clearHistory();
                }
              }}
            >
              Clear History
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '300px', overflowY: 'auto', paddingRight: '8px' }}>
            {history.map(tourney => (
              <div 
                key={tourney.id} 
                className="glass-panel" 
                style={{ padding: '16px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.02)', transition: 'all 0.2s ease' }}
                onClick={() => setSelectedHistory(tourney)}
                onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)'}
                onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)'}
              >
                <div>
                  <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{tourney.name || 'Unnamed Tournament'}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{new Date(tourney.date).toLocaleDateString()}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--success-color, #4dff4d)' }}>
                  👑 {tourney.winner?.name}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}

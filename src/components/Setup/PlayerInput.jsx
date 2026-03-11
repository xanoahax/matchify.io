import { useState } from 'react';
import { useTournament } from '../../context/TournamentContext';

export default function PlayerInput() {
  const { players, addPlayer, removePlayer, advanceStage } = useTournament();
  const [inputValue, setInputValue] = useState('');

  const handleAdd = (e) => {
    e.preventDefault();
    if (inputValue.trim()) {
      addPlayer(inputValue.trim());
      setInputValue('');
    }
  };

  return (
    <div className="glass-panel animate-fade-in" style={{ padding: '40px', width: '100%', maxWidth: '600px' }}>
      <h2 style={{ marginBottom: '16px', textAlign: 'center' }}>Add Participants</h2>
      <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '24px' }}>
        Add all players who will compete. ({players.length} added)
      </p>

      <form onSubmit={handleAdd} style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
        <input 
          type="text" 
          className="glass-input" 
          placeholder="Player Name" 
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          autoFocus
        />
        <button type="submit" className="glass-button primary" disabled={!inputValue.trim()}>
          Add
        </button>
      </form>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '24px', maxHeight: '200px', overflowY: 'auto' }}>
        {players.map(player => (
          <div key={player.id} className="glass-panel" style={{ padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>{player.name}</span>
            <button 
              onClick={() => removePlayer(player.id)}
              style={{ color: '#ff4d4d', fontSize: '1.2rem' }}
            >
              &times;
            </button>
          </div>
        ))}
        {players.length === 0 && (
          <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '20px' }}>
            No players added yet.
          </div>
        )}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
        <button className="glass-button" onClick={() => advanceStage('MAIN_MENU')}>
          Back
        </button>
        <button 
          className="glass-button primary" 
          onClick={() => advanceStage('SETUP_TEAMS')}
          disabled={players.length < 2}
        >
          Next: Form Teams
        </button>
      </div>
    </div>
  );
}

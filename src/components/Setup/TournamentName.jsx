import { useTournament } from '../../context/TournamentContext';

export default function TournamentName() {
  const { tournamentName, setTournamentName, advanceStage } = useTournament();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (tournamentName.trim()) {
      advanceStage('SETUP_PLAYERS');
    }
  };

  const handleInputFocus = (e) => {
    if (window.innerWidth <= 768 && e.target) {
      setTimeout(() => {
        e.target.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 300); // Wait for mobile keyboard to appear
    }
  };

  return (
    <div className="glass-panel animate-fade-in" style={{ padding: '40px', width: '100%', maxWidth: '600px' }}>
      <h2 style={{ marginBottom: '24px', textAlign: 'center' }}>Create a Tournament</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <input 
          type="text" 
          className="glass-input" 
          placeholder="Enter Tournament Name" 
          value={tournamentName}
          onChange={(e) => setTournamentName(e.target.value)}
          onFocus={handleInputFocus}
          autoFocus
        />
        <button 
          type="submit" 
          className="glass-button primary" 
          style={{ width: '100%', padding: '16px', fontSize: '1.1rem' }}
          disabled={!tournamentName.trim()}
        >
          Next: Add Players
        </button>
      </form>
    </div>
  );
}

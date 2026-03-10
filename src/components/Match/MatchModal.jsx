import { useTournament } from '../../context/TournamentContext';

export default function MatchModal({ match, onClose, isReadOnly = false }) {
  const { finishMatch } = useTournament();

  if (!match) return null;

  const handleWinnerSelect = (winnerId) => {
    if (isReadOnly) return;
    finishMatch(match.id, winnerId);
    onClose();
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.7)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div className="glass-panel animate-fade-in" style={{ padding: '40px', width: '100%', maxWidth: '500px', textAlign: 'center' }}>
        <h2 style={{ marginBottom: '24px' }}>Resolve Match</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>Who won?</p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '32px' }}>
          {[match.team1, match.team2].map((team, idx) => {
            const isWinner = match.winnerId === team?.id;
            return (
            <button
              key={team?.id || idx}
              className={`glass-button ${isWinner ? 'primary' : ''}`}
              style={{
                flex: 1,
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                alignItems: 'center',
                cursor: isReadOnly ? 'default' : 'pointer',
                opacity: (isReadOnly && !isWinner && match.status === 'FINISHED') ? 0.4 : 1
              }}
              onClick={() => handleWinnerSelect(team.id)}
            >
              {team?.emoji && <span style={{ fontSize: '2rem' }}>{team.emoji}</span>}
              <span style={{ fontWeight: 'bold' }}>{team?.name}</span>
            </button>
          )})}
        </div>

        <button className="glass-button secondary" onClick={onClose}>
          Cancel
        </button>
      </div>
    </div>
  );
}

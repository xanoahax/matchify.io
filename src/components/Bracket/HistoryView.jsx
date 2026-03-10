import { useState } from 'react';
import MatchNode from './MatchNode';
import MatchModal from '../Match/MatchModal';

export default function HistoryView({ tournament, onBack }) {
  const [selectedMatch, setSelectedMatch] = useState(null);

  if (!tournament || !tournament.bracket) return null;
  const { name, date, winner, bracket } = tournament;

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
      
      {/* Header Bar */}
      <div style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0,0,0,0.5)', borderBottom: '1px solid var(--glass-border)' }}>
        <button className="glass-button" onClick={onBack}>
          🔙 Back to Menu
        </button>
        <div style={{ textAlign: 'center' }}>
          <h2 className="text-gradient">{name}</h2>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Played on {new Date(date).toLocaleDateString()}
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--success-color, #4dff4d)', color: '#000', padding: '8px 16px', borderRadius: '30px', fontWeight: 'bold' }}>
          🏆 {winner?.emoji} {winner?.name}
        </div>
      </div>

      {/* Bracket Area (Read Only) */}
      <div className="tournament-scroll-container">
        <div className="bracket-container">
          {bracket.map((round, rIndex) => (
            <div key={`round-${rIndex}`} className="round-container">
              <h3 className="round-title">
                {rIndex === bracket.length - 1 ? 'Final' : `Round ${rIndex + 1}`}
              </h3>
              {round.map((match) => (
                <MatchNode
                  key={match.id}
                  match={match}
                  onMatchClick={() => {
                     // In history mode, matches are clickable just to view details
                     setSelectedMatch(match);
                  }}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* View Only Match Modal */}
      {selectedMatch && (
        <MatchModal
          match={selectedMatch}
          onClose={() => setSelectedMatch(null)}
          isReadOnly={true}
        />
      )}
    </div>
  );
}

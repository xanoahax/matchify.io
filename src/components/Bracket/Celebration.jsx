import { useEffect, useRef, useState } from 'react';
import { useTournament } from '../../context/TournamentContext';

export default function Celebration() {
  const { bracket, saveToHistory } = useTournament();
  const hasSaved = useRef(false);

  // We freeze the winner in local state so the celebration screen doesn't disappear 
  // when the tournament context is wiped by saveToHistory.
  const [winnerTeam] = useState(() => {
    if (!bracket) return null;
    const finalRound = bracket[bracket.length - 1];
    if (!finalRound || !finalRound[0]) return null;
    const finalMatch = finalRound[0];
    return finalMatch.winnerId === finalMatch.team1?.id ? finalMatch.team1 : finalMatch.team2;
  });

  useEffect(() => {
    if (!hasSaved.current && winnerTeam) {
      saveToHistory(winnerTeam);
      hasSaved.current = true;
    }
  }, [winnerTeam, saveToHistory]);

  if (!winnerTeam) return null; // Prevent crash when state clears

  return (
    <div className="glass-panel animate-fade-in" style={{ padding: '60px', width: '100%', maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
      <h1 className="text-gradient" style={{ fontSize: '4rem', marginBottom: '16px' }}>Tournament Complete!</h1>
      <h2 style={{ color: 'var(--text-muted)', marginBottom: '40px' }}>The Champion is</h2>

      <div style={{ animation: 'fadeIn 1s ease-out forwards', transform: 'scale(1.2)' }}>
        {winnerTeam?.emoji && <div style={{ fontSize: '5rem', marginBottom: '16px' }}>{winnerTeam.emoji}</div>}
        <div style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>{winnerTeam?.name}</div>
      </div>

      <div style={{ marginTop: '60px' }}>
        <button
          className="glass-button primary"
          onClick={() => window.location.reload()}
          style={{ padding: '16px 32px', fontSize: '1.2rem' }}
        >
          Start New Tournament
        </button>
      </div>
    </div>
  );
}

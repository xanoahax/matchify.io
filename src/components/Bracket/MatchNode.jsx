export default function MatchNode({ match, onMatchClick }) {
  const isClickable = match.status === 'ACTIVE';

  const renderTeam = (team, isWinner) => {
    if (!team) return <div style={{ color: 'var(--text-muted)' }}>TBD</div>;
    if (team.isBye) return <div style={{ color: 'var(--text-muted)' }}>BYE</div>;
    return (
      <div 
        className="match-team"
        style={{
          fontWeight: isWinner ? 'bold' : 'normal',
          color: match.status === 'FINISHED' 
                   ? (isWinner ? 'var(--success-color, #4dff4d)' : 'var(--error-color, #ff4d4d)') 
                   : (isWinner ? 'var(--success-color, #4dff4d)' : 'var(--text-main)'),
          opacity: match.status === 'FINISHED' && !isWinner ? 0.6 : 1
        }}>
        {team.emoji && <span>{team.emoji}</span>}
        <span className="match-team-name">
          {team.name}
        </span>
      </div>
    );
  };

  const getBorderColor = () => {
    if (match.status === 'ACTIVE') return 'var(--accent-color)';
    if (match.status === 'FINISHED') return 'var(--glass-border)';
    return 'rgba(255,255,255,0.05)';
  };

  return (
    <div
      className="glass-panel match-node"
      style={{
        cursor: onMatchClick ? 'pointer' : (isClickable ? 'pointer' : 'default'),
        borderColor: getBorderColor(),
        boxShadow: isClickable ? '0 0 15px rgba(255, 46, 147, 0.4)' : 'none',
        transform: isClickable ? 'scale(1.05)' : 'scale(1)'
      }}
      onClick={onMatchClick ? onMatchClick : undefined}
      title={onMatchClick ? 'View match details' : (isClickable ? 'Click to play match' : '')}
    >
      {renderTeam(match.team1, match.winnerId === match?.team1?.id)}
      <div className="match-divider" />
      {renderTeam(match.team2, match.winnerId === match?.team2?.id)}
    </div>
  );
}

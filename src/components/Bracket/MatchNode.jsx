export default function MatchNode({ match, onMatchClick }) {
  const isClickable = match.status === 'ACTIVE';

  const renderTeam = (team, isWinner) => {
    if (!team) return <div style={{ color: 'var(--text-muted)' }}>TBD</div>;
    if (team.isBye) return <div style={{ color: 'var(--text-muted)' }}>BYE</div>;
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        fontWeight: isWinner ? 'bold' : 'normal',
        color: match.status === 'FINISHED' 
                 ? (isWinner ? 'var(--success-color, #4dff4d)' : 'var(--error-color, #ff4d4d)') 
                 : (isWinner ? 'var(--success-color, #4dff4d)' : 'var(--text-main)'),
        opacity: match.status === 'FINISHED' && !isWinner ? 0.6 : 1
      }}>
        {team.emoji && <span>{team.emoji}</span>}
        <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '120px' }}>
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
      className="glass-panel"
      style={{
        width: '200px',
        padding: '12px',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        cursor: onMatchClick ? 'pointer' : (isClickable ? 'pointer' : 'default'),
        transition: 'all 0.2s ease',
        borderColor: getBorderColor(),
        boxShadow: isClickable ? '0 0 15px rgba(255, 46, 147, 0.4)' : 'none',
        transform: isClickable ? 'scale(1.05)' : 'scale(1)'
      }}
      onClick={onMatchClick ? onMatchClick : undefined}
      title={onMatchClick ? 'View match details' : (isClickable ? 'Click to play match' : '')}
    >
      {renderTeam(match.team1, match.winnerId === match?.team1?.id)}
      <div style={{ height: '1px', background: 'var(--glass-border)', width: '100%' }} />
      {renderTeam(match.team2, match.winnerId === match?.team2?.id)}
    </div>
  );
}

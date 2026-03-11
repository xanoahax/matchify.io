export default function RandomMode({
  assignmentMode,
  teamSize,
  setTeamSize,
  handleGenerateRandomTeams,
  teams
}) {
  if (assignmentMode !== 'random') return null;

  const isUneven = teams.some(t => t.players.length < teamSize);

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <label>Players per team:</label>
        <input
          type="number"
          className="glass-input"
          style={{ width: '60px', padding: '8px' }}
          value={teamSize}
          min={1}
          onChange={(e) => setTeamSize(parseInt(e.target.value) || 1)}
        />
        <button className="glass-button secondary" onClick={handleGenerateRandomTeams} style={{ padding: '8px 16px' }}>
          Regenerate
        </button>
      </div>

      {isUneven && (
        <div style={{ 
          background: 'rgba(255, 165, 0, 0.1)', 
          border: '1px solid rgba(255, 165, 0, 0.3)', 
          color: '#ffa500', 
          padding: '12px 16px', 
          borderRadius: '8px', 
          marginBottom: '24px',
          textAlign: 'center',
          fontSize: '0.9rem',
          gridColumn: '1 / -1' // To stretch across the entire flex parent if needed
        }}>
          ⚠️ <strong>Uneven teams:</strong> Some teams have fewer players.
        </div>
      )}
    </>
  );
}

export const EMOJIS = ['🐺', '🦅', '🦁', '🐉', '🐍', '🦈', '☠️', '⚔️', '🛡️', '👑', '🔥', '⚡'];

export default function TeamCard({
  team,
  assignmentMode,
  isUneven,
  unassignedPlayers,
  updateTeamEmoji,
  updateTeamName,
  removePlayerFromTeam,
  assignPlayerToTeam,
  deleteTeam
}) {
  return (
    <div className="glass-panel" style={{ 
      padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px', 
      background: isUneven ? 'rgba(255, 165, 0, 0.05)' : 'rgba(255,255,255,0.02)',
      borderColor: isUneven ? 'rgba(255, 165, 0, 0.4)' : 'var(--glass-border)'
    }}>
      <div style={{ display: 'flex', gap: '8px' }}>
        <select
          className="glass-input"
          style={{ width: '60px', padding: '8px', fontSize: '1.2rem', textAlign: 'center' }}
          value={team.emoji}
          onChange={(e) => updateTeamEmoji(team.id, e.target.value)}
        >
          {EMOJIS.map(em => <option key={em} value={em}>{em}</option>)}
        </select>
        <input
          type="text"
          className="glass-input"
          value={team.name}
          placeholder={team.players.map(p => p.name).join(', ') || 'Team Name'}
          onChange={(e) => updateTeamName(team.id, e.target.value)}
          style={{ flex: 1, padding: '8px', fontWeight: 'bold' }}
        />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
        {team.players.map(p => (
          <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.05)', padding: '6px 10px', borderRadius: '6px' }}>
             <span style={{ fontSize: '0.9rem' }}>{p.name}</span>
             {assignmentMode === 'manual' && (
                <button onClick={() => removePlayerFromTeam(p.id, team.id)} style={{ background: 'none', border: 'none', color: 'var(--error-color, #ff4d4d)', cursor: 'pointer', fontSize: '1.2rem', padding: '0 4px' }}>&times;</button>
             )}
          </div>
        ))}
        {team.players.length === 0 && <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>Empty Team</div>}
      </div>
      {assignmentMode === 'manual' && unassignedPlayers.length > 0 && (
          <div style={{ marginTop: 'auto' }}>
             <select 
                 className="glass-input" 
                 style={{ width: '100%', padding: '6px', fontSize: '0.85rem' }}
                 value=""
                 onChange={(e) => assignPlayerToTeam(e.target.value, team.id)}
             >
                 <option value="" disabled>+ Assign Player</option>
                 {unassignedPlayers.map(up => (
                     <option key={up.id} value={up.id} style={{ color: 'black' }}>{up.name}</option>
                 ))}
             </select>
          </div>
      )}
      {isUneven && <div style={{ fontSize: '0.8rem', color: '#ffa500', margin: '4px 0' }}>⚠️ Missing player(s)</div>}
      {assignmentMode === 'manual' && (
          <button 
            onClick={() => deleteTeam(team.id)}
            style={{ background: 'rgba(255,0,0,0.1)', color: '#ff4d4d', border: 'none', padding: '6px', borderRadius: '4px', cursor: 'pointer', marginTop: 'auto' }}
          >
              Delete Team
          </button>
      )}
    </div>
  );
}

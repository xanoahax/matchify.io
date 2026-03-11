export default function ManualMode({
  assignmentMode,
  unassignedPlayers,
  handleAddManualTeam
}) {
  if (assignmentMode !== 'manual') return null;

  return (
    <div className="glass-panel" style={{ marginBottom: '24px', padding: '20px', background: 'rgba(0,0,0,0.2)', width: '100%' }}>
      <h3 style={{ marginBottom: '12px', fontSize: '1.1rem' }}>Unassigned Players ({unassignedPlayers.length})</h3>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
         {unassignedPlayers.length === 0 ? (
             <span style={{ color: 'var(--text-muted)' }}>All players assigned!</span>
         ) : (
             unassignedPlayers.map(p => (
                 <div key={p.id} className="player-chip glass-panel" style={{ padding: '6px 12px', borderRadius: '20px', fontSize: '0.9rem' }}>
                     {p.name}
                 </div>
             ))
         )}
      </div>
      <div style={{ marginTop: '16px', borderTop: '1px solid var(--glass-border)', paddingTop: '16px' }}>
         <button className="glass-button secondary" onClick={handleAddManualTeam}>
             + Add Empty Team
         </button>
      </div>
    </div>
  );
}

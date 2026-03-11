import { useState, useEffect } from 'react';
import { useTournament } from '../../context/TournamentContext';

const EMOJIS = ['🐺', '🦅', '🦁', '🐉', '🐍', '🦈', '☠️', '⚔️', '🛡️', '👑', '🔥', '⚡'];

export default function TeamManager() {
  const { players, teams, setTeams, generateBracket, advanceStage } = useTournament();
  const [teamSize, setTeamSize] = useState(2);
  const [assignmentMode, setAssignmentMode] = useState('random'); // random, manual

  // Auto-generate teams on mount if random is selected and no teams exist
  useEffect(() => {
    if (teams.length === 0 && assignmentMode === 'random' && players.length > 0) {
      handleGenerateRandomTeams();
    }
  }, []);

  const handleGenerateRandomTeams = () => {
    // Shuffle players
    const shuffled = [...players].sort(() => 0.5 - Math.random());
    const newTeams = [];

    for (let i = 0; i < shuffled.length; i += teamSize) {
      const teamPlayers = shuffled.slice(i, i + teamSize);
      const randomEmoji = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
      newTeams.push({
        id: crypto.randomUUID(),
        name: '',
        emoji: randomEmoji,
        players: teamPlayers
      });
    }
    setTeams(newTeams);
  };

  const updateTeamName = (teamId, newName) => {
    setTeams(teams.map(t => t.id === teamId ? { ...t, name: newName } : t));
  };

  const updateTeamEmoji = (teamId, newEmoji) => {
    setTeams(teams.map(t => t.id === teamId ? { ...t, emoji: newEmoji } : t));
  };

  const handleAddManualTeam = () => {
    const randomEmoji = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
    setTeams([...teams, {
        id: crypto.randomUUID(),
        name: '',
        emoji: randomEmoji,
        players: []
    }]);
  };

  const assignPlayerToTeam = (playerId, teamId) => {
    const playerToAssign = players.find(p => p.id === playerId);
    if (!playerToAssign) return;
    
    setTeams(teams.map(t => {
       if (t.id === teamId) {
           return { ...t, players: [...t.players, playerToAssign] };
       }
       return t;
    }));
  };

  const removePlayerFromTeam = (playerId, teamId) => {
    setTeams(teams.map(t => {
       if (t.id === teamId) {
           return { ...t, players: t.players.filter(p => p.id !== playerId) };
       }
       return t;
    }));
  };

  // Calculate unassigned players
  const assignedPlayerIds = new Set(teams.flatMap(t => t.players.map(p => p.id)));
  const unassignedPlayers = players.filter(p => !assignedPlayerIds.has(p.id));

  // Switch mode handler
  const handleModeSwitch = (mode) => {
    setAssignmentMode(mode);
    if (mode === 'random') {
      handleGenerateRandomTeams();
    } else {
      // Clear teams when switching back to manual to avoid weird states, or leave them?
      // Leaving them means they can start with random and tweak. That's a great feature actually!
    }
  };

  return (
    <div className="glass-panel animate-fade-in" style={{ padding: '40px', width: '100%', maxWidth: '800px' }}>
      <h2 style={{ marginBottom: '16px', textAlign: 'center' }}>Form Teams</h2>

      <div className="mobile-flex-col" style={{ display: 'flex', gap: '20px', marginBottom: '24px', justifyContent: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <label>Mode:</label>
          <select
            className="glass-input"
            style={{ width: 'auto', padding: '8px' }}
            value={assignmentMode}
            onChange={(e) => handleModeSwitch(e.target.value)}
          >
            <option value="random" style={{ color: 'black' }}>Random</option>
            <option value="manual" style={{ color: 'black' }}>Manual</option>
          </select>
        </div>

        {assignmentMode === 'random' && (
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
        )}
      </div>

      {assignmentMode === 'random' && teams.some(t => t.players.length < teamSize) && (
        <div style={{ 
          background: 'rgba(255, 165, 0, 0.1)', 
          border: '1px solid rgba(255, 165, 0, 0.3)', 
          color: '#ffa500', 
          padding: '12px 16px', 
          borderRadius: '8px', 
          marginBottom: '24px',
          textAlign: 'center',
          fontSize: '0.9rem'
        }}>
          ⚠️ <strong>Uneven teams:</strong> Some teams have fewer players.
        </div>
      )}

      {assignmentMode === 'manual' && (
        <div className="glass-panel" style={{ marginBottom: '24px', padding: '20px', background: 'rgba(0,0,0,0.2)' }}>
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
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '16px', marginBottom: '24px', maxHeight: '400px', overflowY: 'auto' }}>
        {teams.map((team, idx) => {
          const isUneven = assignmentMode === 'random' && team.players.length < teamSize;
          return (
          <div key={team.id} className="glass-panel" style={{ 
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
            {isUneven && <div style={{ fontSize: '0.8rem', color: '#ffa500', marginTop: '4px' }}>⚠️ Missing player(s)</div>}
            {assignmentMode === 'manual' && (
                <button 
                  onClick={() => setTeams(teams.filter(t => t.id !== team.id))}
                  style={{ background: 'rgba(255,0,0,0.1)', color: '#ff4d4d', border: 'none', padding: '6px', borderRadius: '4px', cursor: 'pointer', marginTop: '4px' }}
                >
                    Delete Team
                </button>
            )}
          </div>
        )})}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px', alignItems: 'center' }}>
        <button className="glass-button" onClick={() => advanceStage('SETUP_PLAYERS')}>
          Back
        </button>
        
        <button
          className="glass-button primary"
          onClick={generateBracket}
          disabled={teams.length < 2}
        >
          Generate Bracket!
        </button>
      </div>
    </div>
  );
}

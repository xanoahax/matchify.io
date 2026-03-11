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

  return (
    <div className="glass-panel animate-fade-in" style={{ padding: '40px', width: '100%', maxWidth: '800px' }}>
      <h2 style={{ marginBottom: '16px', textAlign: 'center' }}>Form Teams</h2>

      <div style={{ display: 'flex', gap: '20px', marginBottom: '24px', justifyContent: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <label>Mode:</label>
          <select
            className="glass-input"
            style={{ width: 'auto', padding: '8px' }}
            value={assignmentMode}
            onChange={(e) => setAssignmentMode(e.target.value)}
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
                placeholder={team.players.map(p => p.name).join(', ')}
                onChange={(e) => updateTeamName(team.id, e.target.value)}
                style={{ flex: 1, padding: '8px', fontWeight: 'bold' }}
              />
            </div>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              {team.players.map(p => p.name).join(', ')}
            </div>
            {isUneven && <div style={{ fontSize: '0.8rem', color: '#ffa500', marginTop: '-4px' }}>⚠️ Missing player(s)</div>}
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

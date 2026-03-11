import { useState, useEffect } from 'react';
import { useTournament } from '../../context/TournamentContext';
import TeamCard, { EMOJIS } from './Teams/TeamCard';
import RandomMode from './Teams/RandomMode';
import ManualMode from './Teams/ManualMode';

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

  const deleteTeam = (teamId) => {
    setTeams(teams.filter(t => t.id !== teamId));
  };

  // Calculate unassigned players
  const assignedPlayerIds = new Set(teams.flatMap(t => t.players.map(p => p.id)));
  const unassignedPlayers = players.filter(p => !assignedPlayerIds.has(p.id));

  // Switch mode handler
  const handleModeSwitch = (mode) => {
    setAssignmentMode(mode);
    if (mode === 'random') {
      handleGenerateRandomTeams();
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

        <RandomMode 
          assignmentMode={assignmentMode}
          teamSize={teamSize}
          setTeamSize={setTeamSize}
          handleGenerateRandomTeams={handleGenerateRandomTeams}
          teams={teams}
        />
      </div>

      <ManualMode 
        assignmentMode={assignmentMode}
        unassignedPlayers={unassignedPlayers}
        handleAddManualTeam={handleAddManualTeam}
      />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '16px', marginBottom: '24px', maxHeight: '400px', overflowY: 'auto' }}>
        {teams.map((team) => (
          <TeamCard 
            key={team.id}
            team={team}
            assignmentMode={assignmentMode}
            isUneven={assignmentMode === 'random' && team.players.length < teamSize}
            unassignedPlayers={unassignedPlayers}
            updateTeamEmoji={updateTeamEmoji}
            updateTeamName={updateTeamName}
            removePlayerFromTeam={removePlayerFromTeam}
            assignPlayerToTeam={assignPlayerToTeam}
            deleteTeam={deleteTeam}
          />
        ))}
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

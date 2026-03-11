import { createContext, useContext, useState, useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { createBracketFromTeams, resolveMatchInBracket } from '../utils/bracketLogic';

const TournamentContext = createContext();

export function useTournament() {
  return useContext(TournamentContext);
}

export function TournamentProvider({ children }) {
  // We use useLocalStorage for everything we want to persist
  const [tournamentName, setTournamentName] = useLocalStorage('pongbuddy_name', '');
  const [players, setPlayers] = useLocalStorage('pongbuddy_players', []);
  const [teams, setTeams] = useLocalStorage('pongbuddy_teams', []);
  const [bracket, setBracket] = useLocalStorage('pongbuddy_bracket', null);
  const [history, setHistory] = useLocalStorage('pongbuddy_history', []);
  
  // Stages: 'MAIN_MENU' -> 'SETUP_NAME' -> 'SETUP_PLAYERS' -> 'SETUP_TEAMS' -> 'BRACKET' -> 'CELEBRATION'
  const [currentStage, setCurrentStage] = useState('MAIN_MENU');
  
  // On mount or when history loads, check if there's an existing tournament to restore or view history
  useEffect(() => {
    if (tournamentName || players.length > 0 || bracket || history.length > 0) {
      setCurrentStage('MAIN_MENU'); // Offer resume OR view history
    } else {
      setCurrentStage('SETUP_NAME'); // Clean start
    }
  }, []);

  const resetTournament = () => {
    setTournamentName('');
    setPlayers([]);
    setTeams([]);
    setBracket(null);
    setCurrentStage(history.length > 0 ? 'MAIN_MENU' : 'SETUP_NAME');
  };

  const saveToHistory = (winnerTeam) => {
     const completedTournament = {
         id: crypto.randomUUID(),
         date: new Date().toISOString(),
         name: tournamentName,
         players: players,
         teams: teams,
         bracket: bracket,
         winner: winnerTeam
     };
     setHistory(prev => [completedTournament, ...prev]);
     
     // Clear the active tournament state
     setTournamentName('');
     setPlayers([]);
     setTeams([]);
     setBracket(null);
  };

  const clearHistory = () => {
    setHistory([]);
  };

  const addPlayer = (name) => {
    const newPlayer = { id: crypto.randomUUID(), name };
    setPlayers((prev) => [...prev, newPlayer]);
  };

  const removePlayer = (id) => {
    setPlayers((prev) => prev.filter(p => p.id !== id));
  };

  const addTeam = (team) => {
    setTeams((prev) => [...prev, { id: crypto.randomUUID(), ...team }]);
  };

  const removeTeam = (id) => {
    setTeams((prev) => prev.filter(t => t.id !== id));
  };

  const advanceStage = (stage) => {
    if (stage === 'RESTORE_PREVIOUS') {
      if (bracket) setCurrentStage('BRACKET');
      else if (teams.length > 0) setCurrentStage('SETUP_TEAMS');
      else if (players.length > 0) setCurrentStage('SETUP_PLAYERS');
      else setCurrentStage('SETUP_NAME');
    } else {
      setCurrentStage(stage);
    }
  };

  const generateBracket = () => {
    const newBracket = createBracketFromTeams(teams);
    setBracket(newBracket);
    setCurrentStage('BRACKET');
  };

  const finishMatch = (matchId, winnerId) => {
    const { bracket: updatedBracket, isFinalMatch } = resolveMatchInBracket(bracket, matchId, winnerId);
    setBracket(updatedBracket);
    
    if (isFinalMatch) {
      setCurrentStage('CELEBRATION');
    }
  };

  const value = {
    tournamentName, setTournamentName,
    players, addPlayer, removePlayer,
    teams, setTeams, addTeam, removeTeam,
    bracket, setBracket,
    generateBracket, finishMatch,
    currentStage, advanceStage, resetTournament,
    history, saveToHistory, clearHistory
  };

  return (
    <TournamentContext.Provider value={value}>
      {children}
    </TournamentContext.Provider>
  );
}

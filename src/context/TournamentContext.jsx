import { createContext, useContext, useState, useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

const TournamentContext = createContext();

export function useTournament() {
  return useContext(TournamentContext);
}

export function TournamentProvider({ children }) {
  // We use useLocalStorage for everything we want to persist
  const [tournamentName, setTournamentName] = useLocalStorage('matchify_name', '');
  const [players, setPlayers] = useLocalStorage('matchify_players', []);
  const [teams, setTeams] = useLocalStorage('matchify_teams', []);
  const [bracket, setBracket] = useLocalStorage('matchify_bracket', null);
  const [history, setHistory] = useLocalStorage('matchify_history', []);
  
  // Stages: 'MAIN_MENU' -> 'SETUP_PLAYERS' -> 'SETUP_TEAMS' -> 'BRACKET' -> 'CELEBRATION'
  const [currentStage, setCurrentStage] = useState('MAIN_MENU');
  
  // On mount or when history loads, check if there's an existing tournament to restore or view history
  useEffect(() => {
    if (players.length > 0 || bracket || history.length > 0) {
      setCurrentStage('MAIN_MENU'); // Offer resume OR view history
    } else {
      setCurrentStage('SETUP_PLAYERS'); // Clean start
    }
  }, []);

  const resetTournament = () => {
    setTournamentName('');
    setPlayers([]);
    setTeams([]);
    setBracket(null);
    setCurrentStage(history.length > 0 ? 'MAIN_MENU' : 'SETUP_PLAYERS');
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
      else setCurrentStage('SETUP_PLAYERS');
    } else {
      setCurrentStage(stage);
    }
  };

  const generateBracket = () => {
    let p = 1;
    while (p < teams.length) p *= 2;
    const shuffledTeams = [...teams]
      .map(t => ({ ...t, name: t.name.trim() || t.players.map(p => p.name).join(', ') }))
      .sort(() => 0.5 - Math.random());
    
    const newBracket = [];
    
    // 1. Build blank rounds
    let currentRoundMatches = p / 2;
    let matchCounter = 1;
    
    for (let r = 0; currentRoundMatches >= 1; r++) {
      const roundMatches = [];
      for (let m = 0; m < currentRoundMatches; m++) {
        roundMatches.push({
          id: `M-${matchCounter++}`,
          roundIndex: r,
          matchIndex: m,
          team1: null,
          team2: null,
          winnerId: null,
          status: 'PENDING',
          nextMatchId: currentRoundMatches > 1 ? null : 'CHAMPION',
          nextMatchSlot: null
        });
      }
      newBracket.push(roundMatches);
      currentRoundMatches /= 2;
    }

    // 2. Link matches between rounds
    for (let r = 0; r < newBracket.length - 1; r++) {
      for (let m = 0; m < newBracket[r].length; m++) {
        newBracket[r][m].nextMatchId = newBracket[r + 1][Math.floor(m / 2)].id;
        newBracket[r][m].nextMatchSlot = m % 2 === 0 ? 'team1' : 'team2';
      }
    }

    // Helper: Push team forward, resolving chained BYEs
    const propagate = (bracketArray, targetId, targetSlot, team) => {
      if (!targetId || targetId === 'CHAMPION') return;
      
      let targetMatch = null;
      for (const round of bracketArray) {
        targetMatch = round.find(m => m.id === targetId);
        if (targetMatch) break;
      }
      
      if (targetMatch) {
         targetMatch[targetSlot] = team;
         if (targetMatch.team1 && targetMatch.team2 && targetMatch.status === 'PENDING') {
            const hasBye = targetMatch.team1.isBye || targetMatch.team2.isBye;
            if (hasBye) {
               targetMatch.status = 'FINISHED';
               const autoWinner = targetMatch.team1.isBye ? targetMatch.team2 : targetMatch.team1;
               targetMatch.winnerId = autoWinner.id;
               propagate(bracketArray, targetMatch.nextMatchId, targetMatch.nextMatchSlot, autoWinner);
            } else {
               targetMatch.status = 'ACTIVE';
            }
         }
      }
    };

    // 3. Assign teams / BYEs to first round
    let teamIdx = 0;
    // Layer 1
    for (let m = 0; m < newBracket[0].length; m++) {
      if (teamIdx < shuffledTeams.length) {
         newBracket[0][m].team1 = shuffledTeams[teamIdx++];
      }
    }
    // Layer 2
    for (let m = 0; m < newBracket[0].length; m++) {
      if (teamIdx < shuffledTeams.length) {
         newBracket[0][m].team2 = shuffledTeams[teamIdx++];
      } else {
         newBracket[0][m].team2 = { id: `BYE-${m}`, isBye: true, name: 'BYE' };
      }
    }

    // Evaluate first round
    for (let m = 0; m < newBracket[0].length; m++) {
       const match = newBracket[0][m];
       if (match.team2 && match.team2.isBye) {
          match.winnerId = match.team1.id;
          match.status = 'FINISHED';
          propagate(newBracket, match.nextMatchId, match.nextMatchSlot, match.team1);
       } else if (match.team1 && match.team1.isBye) {
          match.winnerId = match.team2.id;
          match.status = 'FINISHED';
          propagate(newBracket, match.nextMatchId, match.nextMatchSlot, match.team2);
       } else {
          match.status = 'ACTIVE';
       }
    }

    setBracket(newBracket);
    setCurrentStage('BRACKET');
  };

  const finishMatch = (matchId, winnerId) => {
    const newBracket = JSON.parse(JSON.stringify(bracket));
    
    let matchFound = null;
    for (const round of newBracket) {
      matchFound = round.find(m => m.id === matchId);
      if (matchFound) break;
    }

    if (matchFound) {
      matchFound.status = 'FINISHED';
      matchFound.winnerId = winnerId;
      const winnerTeam = winnerId === matchFound.team1.id ? matchFound.team1 : matchFound.team2;

      if (matchFound.nextMatchId) {
        if (matchFound.nextMatchId === 'CHAMPION') {
          setCurrentStage('CELEBRATION');
        } else {
          // Propagate
          let nextMatch = null;
          for (const round of newBracket) {
            nextMatch = round.find(m => m.id === matchFound.nextMatchId);
            if (nextMatch) break;
          }
          if (nextMatch) {
            nextMatch[matchFound.nextMatchSlot] = winnerTeam;
            if (nextMatch.team1 && nextMatch.team2 && nextMatch.status === 'PENDING') {
              nextMatch.status = 'ACTIVE';
            }
          }
        }
      }
    }
    
    setBracket(newBracket);
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

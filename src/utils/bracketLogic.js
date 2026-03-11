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

export const createBracketFromTeams = (teams) => {
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

  return newBracket;
};

export const resolveMatchInBracket = (currentBracket, matchId, winnerId) => {
  const newBracket = JSON.parse(JSON.stringify(currentBracket)); // deep copy
  
  let matchFound = null;
  for (const round of newBracket) {
    matchFound = round.find(m => m.id === matchId);
    if (matchFound) break;
  }

  if (matchFound) {
    matchFound.status = 'FINISHED';
    matchFound.winnerId = winnerId;
    const winnerTeam = winnerId === matchFound.team1.id ? matchFound.team1 : matchFound.team2;

    if (matchFound.nextMatchId && matchFound.nextMatchId !== 'CHAMPION') {
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
  
  // Return the newly calculated bracket, and whether a champion was crowned
  return {
    bracket: newBracket,
    isFinalMatch: matchFound && matchFound.nextMatchId === 'CHAMPION'
  };
};

import { useState } from 'react';
import { useTournament } from '../../context/TournamentContext';
import MatchNode from './MatchNode';
import MatchModal from '../Match/MatchModal';

export default function TournamentTree() {
  const { bracket } = useTournament();
  const [selectedMatch, setSelectedMatch] = useState(null);

  if (!bracket || bracket.length === 0) return null;

  const getRoundTitle = (rIndex) => {
    // If it's the first round and contains Byes, call it Knockout Stage
    const isFirstRoundWithByes = rIndex === 0 && bracket[0].some(m => m.team1?.isBye || m.team2?.isBye);
    if (isFirstRoundWithByes) {
      return 'Knockout Phase';
    }

    if (rIndex === bracket.length - 1) return 'Final';
    if (rIndex === bracket.length - 2) return 'Semi-Final';
    if (rIndex === bracket.length - 3) return 'Quarter-Final';
    
    return `Round ${rIndex + 1}`;
  };

  return (
    <div className="tournament-scroll-container">
      <div className="bracket-container">
        {bracket.map((round, rIndex) => {
          // Filter out matches that are just BYE auto-advances
          const validMatches = round.filter(m => !(m.team1?.isBye || m.team2?.isBye));
          
          if (validMatches.length === 0) return null;

          return (
            <div key={`round-${rIndex}`} className="round-container">
              <h3 className="round-title">
                {getRoundTitle(rIndex)}
              </h3>
              {validMatches.map((match) => (
                <MatchNode
                  key={match.id}
                  match={match}
                  onMatchClick={(e) => {
                    if (match.status === 'ACTIVE') {
                      setSelectedMatch(match);
                      // On mobile devices, scrolling the clicked match to the center makes the modal feel more anchored.
                      if (window.innerWidth <= 768 && e && e.currentTarget) {
                         setTimeout(() => {
                            e.currentTarget.scrollIntoView({ behavior: 'smooth', block: 'center' });
                         }, 50);
                      }
                    }
                  }}
                />
              ))}
            </div>
          );
        })}
      </div>

      {selectedMatch && (
        <MatchModal
          match={selectedMatch}
          onClose={() => setSelectedMatch(null)}
        />
      )}
    </div>
  );
}

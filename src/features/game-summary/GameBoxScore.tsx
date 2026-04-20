import { VStack } from '@chakra-ui/react';
import { GameBoxScoreType, TeamBoxScoreType } from 'interfaces';

import TeamBoxScore from './TeamBoxScore';

interface GameBoxScoreProps {
  gameBoxScore: GameBoxScoreType | null;
  canEditPlayer: (playerId: string) => boolean;
  onEditPlayer: (playerId: string) => void;
}

export default function GameBoxScore({
  gameBoxScore,
  canEditPlayer,
  onEditPlayer,
}: GameBoxScoreProps) {
  return (
    <VStack align="stretch">
      {gameBoxScore?.teams?.map((team: TeamBoxScoreType) => (
        <TeamBoxScore
          key={team.teamId}
          team={team}
          canEditPlayer={canEditPlayer}
          onEditPlayer={onEditPlayer}
          scoringType={gameBoxScore.scoring}
        />
      ))}
    </VStack>
  );
}

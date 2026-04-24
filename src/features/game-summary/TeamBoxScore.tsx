import { Box, Heading, Table } from '@chakra-ui/react';
import { GameScoringEnum, Player, TeamBoxScoreType } from 'interfaces';

import { PlayerStatRow } from './PlayerStatRow';

type TeamBoxScoreProps = {
  team: TeamBoxScoreType;
  canEditPlayer: (playerId: string) => boolean;
  onEditPlayer: (playerId: string) => void;
  scoringType: GameScoringEnum;
};

export default function TeamBoxScore({
  team,
  canEditPlayer,
  onEditPlayer,
  scoringType,
}: TeamBoxScoreProps) {
  return (
    <Box borderWidth="1px" borderRadius="lg" overflow="hidden">
      <Heading size="md" px={4} py={2}>
        {team.teamName} ({team.score})
      </Heading>
      <Table.ScrollArea>
        <Table.Root
          striped
          stickyHeader
          css={{
            '& [data-sticky]': {
              position: 'sticky',
              zIndex: 1,
              bg: 'bg',

              _after: {
                content: '""',
                position: 'absolute',
                pointerEvents: 'none',
                top: '0',
                bottom: '-1px',
                width: '24px',
              },
            },
            '& [data-sticky=start]': {
              _after: {
                insetInlineStart: '0',
                translate: '-100% 0',
                shadow: 'inset -8px 0px 8px -8px rgba(0, 0, 0, 0.16)',
              },
            },

            '& thead tr': {
              shadow: '0 1px 0 0 {colors.border}',
              '&:has(th[data-sticky])': {
                zIndex: 2,
              },
            },
          }}
        >
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeader
                data-sticky="start"
                minW={100}
                left="0"
                pt={1}
                pb={1}
              >
                Player
              </Table.ColumnHeader>
              <Table.ColumnHeader
                p={0}
                textAlign={'center'}
                fontSize={'smaller'}
              >
                PTS
              </Table.ColumnHeader>
              <Table.ColumnHeader
                p={0}
                textAlign={'center'}
                fontSize={'smaller'}
              >
                FG
              </Table.ColumnHeader>
              <Table.ColumnHeader
                p={0}
                textAlign={'center'}
                fontSize={'smaller'}
              >
                3PT
              </Table.ColumnHeader>
              <Table.ColumnHeader
                p={0}
                textAlign={'center'}
                fontSize={'smaller'}
              >
                AST
              </Table.ColumnHeader>
              <Table.ColumnHeader
                p={0}
                textAlign={'center'}
                fontSize={'smaller'}
              >
                STL
              </Table.ColumnHeader>
              <Table.ColumnHeader
                p={0}
                textAlign={'center'}
                fontSize={'smaller'}
              >
                BLK
              </Table.ColumnHeader>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {team.players.map((player: Player) => (
              <PlayerStatRow
                key={player.userId}
                player={player}
                didWin={team.won}
                canEdit={canEditPlayer(player.userId)}
                onEditPlayer={onEditPlayer}
                scoringType={scoringType}
              />
            ))}
          </Table.Body>
        </Table.Root>
      </Table.ScrollArea>
    </Box>
  );
}

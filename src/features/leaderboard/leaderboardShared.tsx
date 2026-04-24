import { Icon } from '@chakra-ui/react';
import {
  LeaderboardPlayer,
  LeaderboardStatKey,
  TeamCombinationSummary,
} from 'interfaces';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';

export type LeaderboardTab = 'players' | 'teams';
export type PlayerSortKey = 'average' | 'total';
export type TeamSortKey = 'winPct' | 'pointDiffAvg' | 'gamesPlayed';
export type SortDirection = 'asc' | 'desc';
export type TeamGamesFilter = 'all' | '2plus' | '5plus';

export const statOptions: {
  key: LeaderboardStatKey;
  label: string;
  shortLabel: string;
  color: string;
}[] = [
  { key: 'points', label: 'Points', shortLabel: 'PTS', color: 'cyan' },
  { key: 'threes', label: 'Threes', shortLabel: '3PT', color: 'pink' },
  { key: 'assists', label: 'Assists', shortLabel: 'AST', color: 'orange' },
  { key: 'steals', label: 'Steals', shortLabel: 'STL', color: 'yellow' },
  { key: 'blocks', label: 'Blocks', shortLabel: 'BLK', color: 'purple' },
  { key: 'wins', label: 'Wins', shortLabel: 'Win', color: 'green' },
];

export const teamFilterOptions: {
  key: TeamGamesFilter;
  label: string;
  minimumGames: number;
  color: string;
}[] = [
  { key: 'all', label: 'All Teams', minimumGames: 0, color: 'cyan' },
  { key: '2plus', label: '2+ Games', minimumGames: 2, color: 'pink' },
  { key: '5plus', label: '5+ Games', minimumGames: 5, color: 'orange' },
];

export const teamSortOptions: {
  key: TeamSortKey;
  label: string;
}[] = [
  { key: 'winPct', label: 'Win %' },
  { key: 'pointDiffAvg', label: 'Point Diff' },
  { key: 'gamesPlayed', label: 'Games' },
];

export const sortArrow = (
  sortKey: string,
  activeSortKey: string,
  direction: SortDirection,
) => {
  if (sortKey !== activeSortKey) return '';

  return (
    <Icon marginLeft={1} size="xs">
      {direction === 'desc' ? <IoIosArrowDown /> : <IoIosArrowUp />}
    </Icon>
  );
};

export const getTeamLineupLabel = (combination: TeamCombinationSummary) => {
  return combination.players.map((player) => player.name).join(' / ');
};

export const getPlayerRows = (
  players: LeaderboardPlayer[],
  selectedStat: LeaderboardStatKey,
  sortKey: PlayerSortKey,
  sortDirection: SortDirection,
) => {
  return players
    .map((player) => {
      const statLine = player.stats[selectedStat];

      return {
        ...player,
        average: statLine.average,
        total: statLine.total,
      };
    })
    .sort((a, b) => {
      const aValue = a[sortKey];
      const bValue = b[sortKey];
      const result =
        aValue === bValue ? a.name.localeCompare(b.name) : bValue - aValue;

      return sortDirection === 'desc' ? result : -result;
    });
};

export const getTeamRows = (
  combinations: TeamCombinationSummary[],
  minimumGames: number,
  sortKey: TeamSortKey,
  sortDirection: SortDirection,
) => {
  return combinations
    .filter((combination) => combination.gamesPlayed >= minimumGames)
    .sort((a, b) => {
      const aValue = a[sortKey];
      const bValue = b[sortKey];
      const result =
        aValue === bValue
          ? getTeamLineupLabel(a).localeCompare(getTeamLineupLabel(b))
          : bValue - aValue;

      return sortDirection === 'desc' ? result : -result;
    });
};

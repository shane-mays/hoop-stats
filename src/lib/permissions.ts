import { User } from 'interfaces';

const STATS_ADMIN_USERNAME = 'OVO';

export const isStatsAdmin = (user: User | undefined) => {
  return user?.username === STATS_ADMIN_USERNAME;
};

export const canEditPlayerStats = (
  currentUser: User | undefined,
  targetPlayerId: string,
) => {
  if (!currentUser) return false;
  if (isStatsAdmin(currentUser)) return true;
  return currentUser.id === targetPlayerId;
};

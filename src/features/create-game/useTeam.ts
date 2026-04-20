import { User } from 'interfaces';
import { useState } from 'react';

export default function useTeam(users: User[], initial: User[] = []) {
  const [team, setTeams] = useState(initial);

  const add = (userId: string) => {
    const player = users.find((p) => p.id === userId);
    if (!player) return;
    setTeams((prev) => [...prev, player]);
  };

  const remove = (userId: string) =>
    setTeams((prev) => prev.filter((t) => t.id !== userId));

  return { team, add, remove };
}

export type TeamHook = ReturnType<typeof useTeam>;

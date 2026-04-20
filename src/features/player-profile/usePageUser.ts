import { User } from 'interfaces';
import { getErrorMessage } from 'lib/errors';
import { fetchUserByPublicId } from 'lib/supabaseApi';
import { useCallback, useEffect, useState } from 'react';

export default function usePageUser(
  routePublicUserId: string | undefined,
  selectedUser: User | undefined,
) {
  const [pageUser, setPageUser] = useState<User | undefined>();
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [userLoadError, setUserLoadError] = useState<string | null>(null);

  const loadPageUser = useCallback(async () => {
    setIsLoadingUser(true);
    setUserLoadError(null);

    try {
      let user = selectedUser;
      if (routePublicUserId) {
        user = await fetchUserByPublicId(routePublicUserId);
      }

      setPageUser(user);
    } catch (error) {
      setPageUser(undefined);
      setUserLoadError(getErrorMessage(error, 'Unable to load player.'));
    } finally {
      setIsLoadingUser(false);
    }
  }, [routePublicUserId, selectedUser]);

  useEffect(() => {
    void loadPageUser();
  }, [loadPageUser]);

  return {
    pageUser,
    isLoadingUser,
    userLoadError,
    loadPageUser,
  };
}

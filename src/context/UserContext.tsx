import { User } from 'interfaces';
import { getUserById } from 'lib/supabaseApi';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

type UserContextType = {
  selectedUser: User | undefined;
  setCurrentUser: (user: User) => void;
  logout: () => void;
};

const UserContext = createContext<UserContextType | null>(null);

export const useUser = () => {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error('useUser must be used inside UserProvider');
  }

  return context;
};

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [selectedUser, setCurrentUser] = useState<User | undefined>();

  useEffect(() => {
    if (!selectedUser) return;
    localStorage.setItem('hoopStatsUserId', selectedUser.id);
  }, [selectedUser]);

  useEffect(() => {
    const storedId = localStorage.getItem('hoopStatsUserId');
    if (!storedId) return;

    const fetchStoredUser = async () => {
      if (!storedId && typeof storedId != 'string') return;
      try {
        const user = await getUserById(storedId);
        setCurrentUser(user);
      } catch {
        localStorage.removeItem('hoopStatsUserId');
        setCurrentUser(undefined);
      }
    };

    fetchStoredUser();
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('hoopStatsUserId');
    setCurrentUser(undefined);
  }, []);

  return (
    <UserContext.Provider
      value={{
        selectedUser,
        setCurrentUser,
        logout,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

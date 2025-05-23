import React, { createContext, useContext, useEffect, useState } from 'react';

type User = {
  id: number;
  username: string;
};

type UserContextType = {
  user: User | null;
  setUser: (user: User | null) => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  // 로그인 상태 확인
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('https://dori.api.newbie.sparcs.me/api/me', {
          credentials: 'include',
        });
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        } else {
          setUser(null);
        }
      } catch {
        setUser(null);
      }
    };

    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

// 커스텀 훅으로 사용
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser는 UserProvider 안에서만 사용 가능합니다.');
  }
  return context;
};

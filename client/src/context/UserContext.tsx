import { createContext, useState, useEffect, ReactNode } from "react";

interface User {
  _id: string;
  name: string;
  username: string;
  role: string;
  activated: boolean;
}

interface UserContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  searchedRooms: any;
  setSearchedRooms: React.Dispatch<React.SetStateAction<any>>;
}

interface UserProviderProps {
  children: ReactNode;
}

// Create the UserContext
export const UserContext = createContext<UserContextType | undefined>(
  undefined
);

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null); // Initially null
  const [searchedRooms, setSearchedRooms] = useState<any>(null); // Initially null

  // Load user from localStorage when the app starts
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Save user to localStorage when it's updated
  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    }
  }, [user]);

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        searchedRooms,
        setSearchedRooms,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { getToken, setToken as persistToken } from "./api";

interface AuthCtx {
  token: string | null;
  setToken: (t: string | null) => void;
  isAuthed: boolean;
}

const Ctx = createContext<AuthCtx>({
  token: null,
  setToken: () => {},
  isAuthed: false,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setTokenState] = useState<string | null>(null);

  useEffect(() => {
    setTokenState(getToken());
  }, []);

  const setToken = (t: string | null) => {
    persistToken(t);
    setTokenState(t);
  };

  return (
    <Ctx.Provider value={{ token, setToken, isAuthed: !!token }}>
      {children}
    </Ctx.Provider>
  );
}

export const useAuth = () => useContext(Ctx);

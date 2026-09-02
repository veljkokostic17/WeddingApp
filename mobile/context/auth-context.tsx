import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

import { setAuthToken } from "@/services/api";
import {
  login as loginApi,
  register as registerApi,
  getCurrentUser,
} from "@/services/auth-api";
import { deleteToken, getToken, saveToken } from "@/services/token-storage";
import { CurrentUser, LoginRequest, RegisterRequest } from "@/types/auth";

interface AuthContextValue {
  user: CurrentUser | null;
  bootstrapping: boolean;
  login: (body: LoginRequest) => Promise<void>;
  register: (body: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [bootstrapping, setBootstrapping] = useState(true);

  async function applyToken(token: string) {
    await saveToken(token);
    setAuthToken(token);
    setUser(await getCurrentUser());
  }

  async function login(body: LoginRequest) {
    const result = await loginApi(body);
    await applyToken(result.token);
  }

  async function register(body: RegisterRequest) {
    const result = await registerApi(body);
    await applyToken(result.token);
  }

  async function logout() {
    await deleteToken();
    setAuthToken(null);
    setUser(null);
  }

  useEffect(() => {
    async function restoreSession() {
      try {
        const token = await getToken();
        if (token == null) return;

        setAuthToken(token);
        setUser(await getCurrentUser());
      } catch {
        await deleteToken();
        setAuthToken(null);
      } finally {
        setBootstrapping(false);
      }
    }

    restoreSession();
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, bootstrapping, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context == null) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

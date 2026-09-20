import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

import { setAuthToken, setOnUnauthorized } from "@/services/api";
import {
  login as loginApi,
  register as registerApi,
  updateProfile as updateProfileApi,
  getCurrentUser,
} from "@/services/auth-api";
import { deleteToken, getToken, saveToken } from "@/services/token-storage";
import {
  CurrentUser,
  LoginRequest,
  RegisterRequest,
  UpdateProfileRequest,
} from "@/types/auth";

interface AuthContextValue {
  user: CurrentUser | null;
  bootstrapping: boolean;
  login: (body: LoginRequest) => Promise<void>;
  register: (body: RegisterRequest) => Promise<void>;
  updateProfile: (body: UpdateProfileRequest) => Promise<void>;
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

  async function updateProfile(body: UpdateProfileRequest) {
    setUser(await updateProfileApi(body));
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

  //Token expired mid usage case
  useEffect(() => {
    setOnUnauthorized(() => {
      void logout();
    });
    return () => setOnUnauthorized(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, bootstrapping, login, register, updateProfile, logout }}
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

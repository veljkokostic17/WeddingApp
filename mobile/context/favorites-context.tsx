import { Favorite } from "@/types/favorite";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { useAuth } from "./auth-context";
import { apiGet } from "@/services/api";
import {
  addFavorite,
  chooseVendor,
  removeFavorite,
} from "@/services/favorite-api";

interface FavoritesContextValue {
  favorites: Favorite[];
  loading: boolean;
  isFavorite: (vendorId: number) => boolean;
  toggleFavorite: (vendorId: number) => Promise<void>;
  choose: (vendorId: number) => Promise<void>;
}

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadFavorites() {
      if (user == null) {
        setFavorites([]);
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        setFavorites(await apiGet<Favorite[]>("/favorite"));
      } finally {
        setLoading(false);
      }
    }

    loadFavorites();
  }, [user]);

  const isFavorite = (vendorId: number) =>
    favorites.some((f) => f.vendorId === vendorId);

  const toggleFavorite = async (vendorId: number) => {
    if (isFavorite(vendorId)) {
      await removeFavorite(vendorId);
      setFavorites((prev) => prev.filter((f) => f.vendorId !== vendorId));
    } else {
      const created = await addFavorite(vendorId);
      setFavorites((prev) => [...prev, created]);
    }
  };

  const choose = async (vendorId: number) => {
    await chooseVendor(vendorId);
    setFavorites(await apiGet<Favorite[]>("/favorite"));
  };

  return (
    <FavoritesContext.Provider
      value={{ favorites, loading, isFavorite, toggleFavorite, choose }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (context == null) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return context;
}

import { useEffect, useState } from "react";
import { apiGet } from "@/services/api";


export function useFetch<T>(path: string | null) {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);


    useEffect(() => {
        let ignore = false;

        const load = async () => {
            if (!path) {
                setLoading(false);
                return;
            }

            setLoading(true);
            setError(null);

            try {
                const result = await apiGet<T>(path);
                if (!ignore) setData(result);
            } catch (e) {
                if (!ignore) setError(e instanceof Error ? e.message : "Greška pri učitavanju.");
            } finally {
                if (!ignore) setLoading(false);
            }
        };

        load();

        return () => { ignore = true; };

    }, [path]);

    return { data, loading, error }

};
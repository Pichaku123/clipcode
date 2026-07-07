import { useState, useEffect, useCallback } from "react";
import client from "../api/client";

export function useApi(url, deps = []) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    //refetch only runs initially and when deps changes, which causes the useEffect to call refetch and it fetches again.
    const refetch = useCallback(() => {
        setLoading(true);
        setError(null);
        client
            .get(url)
            .then((res) => setData(res.data))
            .catch((err) =>
                setError(err.response?.data?.error || "Something went wrong."),
            )
            .finally(() => setLoading(false));
    }, deps);

    useEffect(() => {
        refetch();
    }, [refetch]);

    return { data, loading, error, refetch };
}

import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { get } from '~/services/apiService';
import { useConfigStore, type ConfigData } from '~/store/ConfigData';

async function fetchConfig(): Promise<ConfigData> {
    const res = await get<ConfigData>({ path: "settings/web"});
    return res;
}

export function useLoadConfig() {
    const setConfig = useConfigStore((state) => state.setConfig);

    const query = useQuery({
        queryKey: ['settings/web'],
        queryFn: fetchConfig,
        // staleTime: 1000 * 60 * 10,
    });

    useEffect(() => {
        if (query.status === 'success' && query.data) {
            setConfig(query.data);
        }
    }, [query.status, query.data, setConfig]);

    return query;
}

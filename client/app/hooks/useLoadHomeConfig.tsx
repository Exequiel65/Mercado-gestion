import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { get } from '~/services/apiService';
import { useHomeConfig } from '~/store/homeStore';
import type { IHomeConfig } from '~/types/Products';

async function fetchConfig(): Promise<IHomeConfig> {
    const res = await get<IHomeConfig>({ path: "settings/home/web" });
    return res;
}

export function useLoadHomeConfig() {
    const setConfig = useHomeConfig((state) => state.setConfig);

    const query = useQuery({
        queryKey: ['settings/home/web'],
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

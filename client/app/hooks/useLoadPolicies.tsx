import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { get } from '~/services/apiService';

export interface IPolicy 
{
    id: string;
    description: string;
    createdAt: string;
    updatedAt: string;
}

async function fechtPolicy(path:string): Promise<IPolicy> {
    const res = await get<IPolicy>({ path: path });
    return res;
}

export function useLoadPolicy(type: string, path:string) : IPolicy | undefined {
    const query = useQuery({
        queryKey: [type],
        queryFn: () => fechtPolicy(path),
        // staleTime: 1000 * 60 * 10,
    });

    useEffect(() => {

    }, [query.status, query.data]);

    return query.data;
}

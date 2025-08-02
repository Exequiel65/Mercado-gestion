import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { get } from '~/services/apiService';
import { useCategoryStore, type Category } from '~/store/categoryStore';

async function fetchCategory(): Promise<Category[]> {
    const res = await get<Category[]>({ path: "category" });
    return res;
}

export function useLoadCategories() {
    const setConfig = useCategoryStore((state) => state.setCategories);

    const query = useQuery({
        queryKey: ['categories'],
        queryFn: fetchCategory,
        // staleTime: 1000 * 60 * 10,
    });

    useEffect(() => {
        if (query.status === 'success' && query.data) {
            setConfig(query.data);
        }
    }, [query.status, query.data, setConfig]);

    return query;
}

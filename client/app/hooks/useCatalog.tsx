import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { get } from '~/services/apiService';
import type { IProduct } from '~/types/Products';

async function fetchConfig({ category, sub,child, minPrice, maxPrice, discount, sortBy }: {
    category?: number, 
    sub?: number, 
    child?: number,
    minPrice?: string,
    maxPrice?: string,
    discount?: string,
    sortBy?: string
}): Promise<IProduct[]> {
    let query = "";
    if (category) query += `category=${category}`;
    if (sub) query += (query ? "&" : "") + `subcategory=${sub}`;
    if (child) query += (query ? "&" : "") + `childCategory=${child}`;
    if (minPrice) query += (query ? "&" : "") + `minPrice=${minPrice}`;
    if (maxPrice) query += (query ? "&" : "") + `maxPrice=${maxPrice}`;
    if (discount) query += (query ? "&" : "") + `discount=${discount}`;
    if (sortBy) query += (query ? "&" : "") + `sort=${sortBy}`; 

    const res = await get<IProduct[]>({ path: "product", query });
    return res;

}

export function useLoadCatalog(params: {
    category?: number, 
    sub?: number, 
    child?: number,
    minPrice?: string,
    maxPrice?: string,
    discount?: string,
    sortBy?: string
}) {

    const [Products, setProducts] = useState<IProduct[]>([])
    const query = useQuery({
        queryKey: ['catalog', ...Object.values(params)],
        queryFn: () => fetchConfig(params),
        staleTime: 1000 * 60 * 10,
    });

    useEffect(() => {
        if (query.status === 'success' && query.data) {
            setProducts(query.data);
        }
    }, [Products, params]);

    return query;
}

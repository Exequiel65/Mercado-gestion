// hooks/useLoadSectionProducts.ts
import { useQuery } from '@tanstack/react-query';
import { get } from '~/services/apiService';
import type { IProduct } from '~/types/Products';

export function useLoadSectionProducts(path: string) {
    return useQuery({
        queryKey: ['section-products', path],
        queryFn: () => {
            // Extraer parámetros de la URL
            const url = new URL(path, window.location.origin);
            const queryParams = url.searchParams;
            
            // Construir query string para la API
            let apiQuery = '';
            queryParams.forEach((value, key) => {
                apiQuery += apiQuery ? '&' : '';
                apiQuery += `${key}=${value}`;
            });
            
            return get<IProduct[]>({ path: "product", query: apiQuery });
        },
        enabled: !!path // Solo se ejecuta si hay un path válido
    });
}
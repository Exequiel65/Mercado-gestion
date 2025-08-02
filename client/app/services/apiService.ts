
// src/services/configService.ts
import api from './api';

interface IGet {
    path: string;
    query?: string;
}

interface IGetById {
    path: string;
    id: string | number;
}

interface IUpdate<T> {
    path: string;
    id: string | number;
    data: T
}

interface IPost<T> { 
    path: string; data: T 
}

interface IDelete{ 
    path: string; id: string | number 
}

export async function update<T, R>({ path, id, data }: IUpdate<T>): Promise<R> {
    const response = await api.put<R>(`${path}/${id}`, data);
    return response.data;
}

export async function post<T, R>({ path, data }: IPost<T>): Promise<R> {
    const response = await api.post<R>(path, data);
    return response.data;
}

export async function del<T = void>({ path, id }:IDelete ): Promise<T> {
    const response = await api.delete<T>(`${path}/${id}`);
    return response.data;
}


export async function get<T>({ path, query}: IGet): Promise<T> {
    let url = query ? `${path}?${query}` : path
    const response = await api.get<T>(url);
    return response.data;
}

export async function getById<T>({ path, id }: IGetById): Promise<T> {
    const response = await api.get<T>(`${path}/${id}`);
    return response.data;
}

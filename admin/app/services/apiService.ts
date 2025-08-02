
import api from './api';

interface IGet {
    path: string;
    query?: string;
    token?: string | null
}

interface IGetById {
    path: string;
    id: string | number;
}

interface IUpdate<T> {
    path: string;
    id: string | number;
    data: T,
    token? : string | null
}

interface IPost<T> { 
    path: string; data: T; token? :string | null
}

interface IDelete{ 
    path: string; id: string | number; token? : string | null
}

interface IApiResponse<T>{
    success: boolean;
    message: string,
    data : T
}


export async function update<T, R>({ path, id, data, token }: IUpdate<T>): Promise<IApiResponse<R>> {

    const response = await api.put<IApiResponse<R>>(`${path}/${id}`, data, {
        headers : {
            Authorization : token && `Bearer ${token}`
        }
    });
    return response.data;
}

export async function post<T, R>({ path, data, token}: IPost<T>): Promise<IApiResponse<R>> {
    const response = await api.post<IApiResponse<R>>(path, data, {
        headers: {
            Authorization : token && `Bearer ${token}`
        }
    });
    return response.data;
}

export async function del<T = void>({ path, id, token}:IDelete ): Promise<IApiResponse<T>> {
    const response = await api.delete<IApiResponse<T>>(`${path}/${id}`, {
        headers: {
            Authorization: token ? `Bearer ${token}` : undefined
        }});
    return response.data;
}


export async function get<T>({ path, query, token}: IGet): Promise<IApiResponse<T>> {
    let url = query ? `${path}?${query}` : path
    const response = await api.get<IApiResponse<T>>(url, {headers:{
        Authorization : (token) && `Bearer ${token}`
    }});
    return response.data;
}

export async function getById<T>({ path, id }: IGetById): Promise<T> {
    const response = await api.get<T>(`${path}/${id}`);
    return response.data;
}

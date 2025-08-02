import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router'
import { useForm } from 'react-hook-form';

import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'

import { get, post, update } from '~/services/apiService'
import { toast } from 'sonner'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod';
import { FormField, FormItem, FormLabel, FormMessage, Form } from '../ui/form';
import { useAuthStore } from '~/store/auth-store';
import { AxiosError } from 'axios';
import { Select, SelectItem, SelectTrigger, SelectValue, SelectContent } from '../ui/select';

const userSchema = z.object({
    id: z.string().optional(),
    name: z.string().min(2, 'Requerido'),
    email: z.string().email('Email inválido'),
    phoneNumber: z.string().optional(),
    password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres').optional(),
    picture: z.string().url().optional(),
    dateOfBirth: z.string().optional(),
    roles: z.array(z.string()).min(1, 'Al menos un rol'),
    isActive: z.boolean(),
    isEnabled: z.boolean(),
    isDeleted: z.boolean(),
})

const roleSchema = z.object({
    name: z.string().min(2, 'required'),
    NormalizedName: z.string().min(2, 'required'),
    Description: z.string().min(2, 'required')
})



export type UserFormValues = z.infer<typeof userSchema>
export type rolesType = z.infer<typeof roleSchema>

export default function UserDetailForm() {
    const { id } = useParams()
    const navigate = useNavigate()
    const { token, user } = useAuthStore(s => s)
    const form = useForm<UserFormValues>({
        resolver: zodResolver(userSchema),
        defaultValues: {
            id: '',
            name: '',
            email: '',
            phoneNumber: '',
            picture: '',
            dateOfBirth: '',
            password: '',
            roles: [],
            isActive: false,
            isEnabled: false,
            isDeleted: false
        },
    })
    const [Roles, setRoles] = useState<rolesType[]>([]);
    const isEdit = id !== 'new'

    const getData = async () => {
        var roles = await get<rolesType[]>({ path: 'user/roles', token: token });
        if (roles.success) setRoles(roles.data)
        if (isEdit) {
            var user = await get<UserFormValues>({ path: `user/${id}`, token: token });
            if (user.success) {
                form.reset({
                    ...user.data,
                    roles: user.data.roles,
                    dateOfBirth: user.data.dateOfBirth?.split("T")[0]
                })
            } else {
                toast.error("No se pudo cargar el usuario")
            }
        }


    }
    useEffect(() => {
        getData();
    }, [id, isEdit, form])

    const onSubmit = async (data: UserFormValues) => {
        try {
            if (id) {
                const res = isEdit
                    ? await update<any, any>({
                        path: `user`, id: id, data:
                        {
                            ...data,
                            id: id,
                            dateOfBirth: data.dateOfBirth && new Date(data.dateOfBirth).toISOString()
                        }, token: token
                    })
                    : await post({ path: 'user', data: data, token })

                if (res.success) {
                    toast.success(`Usuario ${isEdit ? 'actualizado' : 'creado'} correctamente`)
                    // navigate('/user')
                } else {
                    toast.error('Ocurrió un error al guardar el usuario')
                }
            }
        } catch (error) {
            if (typeof (error) === typeof AxiosError) {
                var e = error as AxiosError;
                const data = e.response?.data as { success?: boolean; message?: string } | undefined;
                if (data && data.success === false) {
                    toast.error(data.message)
                    throw null;
                }
            }
            toast.error('Ocurrió un error al guardar el usuario')

        }

    }

    return (
        <div className="p-6 xl:w-full mx-auto">
            <Card>
                <CardHeader>
                    <CardTitle>{isEdit ? 'Editar usuario' : 'Nuevo usuario'}</CardTitle>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <div className='grid lg:grid-cols-4 gap-4 sm:grid-cols-2'>
                                <div className='col-span-1'>
                                    <FormField
                                        control={form.control}
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem className='w-full'>
                                                <FormLabel>Nombre</FormLabel>
                                                <Input placeholder="Nombre completo" {...field} />
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <div className='col-span-1'>
                                    <FormField
                                        control={form.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem className='w-full'>
                                                <FormLabel>Email</FormLabel>
                                                <Input type="email" disabled={id !== 'new'} placeholder="correo@ejemplo.com" {...field} />
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <FormField
                                    control={form.control}
                                    name="phoneNumber"
                                    render={({ field }) => (
                                        <FormItem className='col-span-1'>
                                            <FormLabel>Teléfono</FormLabel>
                                            <Input placeholder="+54..." {...field} />
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="roles"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Roles</FormLabel>
                                            <Select
                                                value={field.value?.[0] || ""}
                                                onValueChange={(value) => field.onChange([value])}>
                                                <SelectTrigger className="w-[180px]">
                                                    <SelectValue placeholder="Rol" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {Roles.map((r, idx) => (
                                                        <SelectItem key={idx} value={r.name}>{r.name}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="picture"
                                    render={({ field }) => (
                                        <FormItem className="col-span-1 space-y-2">
                                            <FormLabel>Imagen de perfil</FormLabel>
                                            {field.value && (
                                                <div className="w-32 h-32 overflow-hidden rounded-full border">
                                                    <img
                                                        src={field.value}
                                                        alt="avatar"
                                                        className="object-cover w-full h-full"
                                                    />
                                                </div>
                                            )}
                                            <Input
                                                type="file"
                                                accept="image/*"
                                                className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                                                onChange={async (e) => {
                                                    const file = e.target.files?.[0];
                                                    if (!file) return;

                                                    const reader = new FileReader();
                                                    reader.onloadend = () => {
                                                        const base64 = reader.result?.toString() || "";
                                                        field.onChange(base64);
                                                    };
                                                    reader.readAsDataURL(file);
                                                }}
                                            />
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="dateOfBirth"
                                    render={({ field }) => (
                                        <FormItem className='flex flex-col'>
                                            <FormLabel>Fecha de nacimiento</FormLabel>
                                            <Input
                                                type="date"
                                                {...field}
                                                max={new Date().toISOString().split("T")[0]}
                                            />
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                {
                                    user?.roles.some(role => role === 'superadmin' || role === "admin") && (
                                        <FormField
                                            control={form.control}
                                            name="password"
                                            render={({ field }) => (
                                                <FormItem className='flex flex-col'>
                                                    <FormLabel>Contraseña</FormLabel>
                                                    <Input
                                                        type="password"
                                                        {...field}
                                                        placeholder="Ingrese una contraseña"
                                                    />
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    )
                                }

                            </div>


                            <div className="flex justify-end gap-2 pt-4">
                                <Button type="button" variant="outline" onClick={() => navigate('/admin/user')}>
                                    Cancelar
                                </Button>
                                <Button type="submit">{isEdit ? 'Guardar cambios' : 'Crear usuario'}</Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    )
}

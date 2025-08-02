import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '~/components/ui/button';
import { get, update } from '~/services/apiService';
import { useAuthStore } from '~/store/auth-store';
import { FormField, FormItem, FormLabel, FormMessage, Form } from '~/components/ui/form';
import { Input } from '~/components/ui/input';
import { Textarea } from '~/components/ui/textarea';
import { Image } from 'lucide-react';
import { toast } from 'sonner'
const socialMediaSchema = z.object({
    id: z.number(),
    instagram: z.string().optional().nullable(),
    facebook: z.string().optional().nullable(),
    twitter: z.string().optional().nullable(),
});

const businessSchema = z.object({
    id: z.number(),
    name: z.string(),
    description: z.string(),
    address: z.string(),
    googleMapsUrl: z.string().optional().nullable(),
    email: z.string(),
    phoneNumber: z.string(),
    logoUrl: z.string(),
    iconUrl: z.string(),
    legendUrl: z.string().optional().nullable(),
    socialMediaId: z.number(),
    socialMedia: socialMediaSchema,
});

export type BusinessType = z.infer<typeof businessSchema>;
export type SocialMediaType = z.infer<typeof socialMediaSchema>;

export function meta(){
  return [
    {title: "Tu negocio"}
  ]
}

export default function Business() {
    const token = useAuthStore(s => s.token);
    const [HasEdit, setHasEdit] = useState<boolean>(false);
    const [Id, setId] = useState(0)
    const form = useForm<BusinessType>({
        resolver: zodResolver(businessSchema),
        defaultValues: {
            id: 0,
            name: "",
            description: "",
            address: "",
            googleMapsUrl: "",
            email: "",
            phoneNumber: "",
            logoUrl: "",
            iconUrl: "",
            legendUrl: "",
            socialMediaId: 0,
            socialMedia: {
                id: 0,
                facebook: "",
                instagram: "",
                twitter: ""
            },
        }
    })

    const getData = async () => {
        var business = await get<BusinessType>({ path: "business", token: token })
        if (business.success) {
            form.reset({
                ...business.data
            })
            setId(business.data.id)
        }
    }

    useEffect(() => {
        getData();
    }, [form]);

    const onSubmit = async (data: BusinessType) => {
        try {
            const res = await update<any, any>({
                path: `business`,
                id: Id,
                data: data,
                token: token
            })
            if (res.success)
                toast.success(`Organización actualizado correctamente`)
        } catch (error) {
            toast.error(`Ocurrió un error al actualizar la organización`)
        }
    };
    return (
        <div className="flex flex-col gap-4 p-6">

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight">Organización</h1>
                            <p className="text-muted-foreground text-sm">Gestioná los datos de tu organización.</p>
                        </div>
                        <div>
                            {HasEdit ? (
                                <div>
                                    <Button variant="secondary" className='mx-2' onClick={() => setHasEdit(!HasEdit)}>
                                        Cancelar
                                    </Button>
                                    <Button type='submit'>
                                        Guardar
                                    </Button>

                                </div>

                            ) : (
                                <Button onClick={() => setHasEdit(!HasEdit)}>
                                    Editar
                                </Button>
                            )}

                        </div>
                        {/* Botón para crear usuario (opcional) */}
                        {/* <Button variant="default" size="sm">Nuevo usuario</Button> */}
                    </div>
                    <div className='space-y-4'>


                        <div className='grid lg:grid-cols-4 gap-4 sm:grid-cols-2'>
                            <div className='col-span-1'>
                                <FormField
                                    control={form.control}
                                    name="name"
                                    disabled={!HasEdit}
                                    render={({ field }) => (
                                        <FormItem className='w-full'>
                                            <FormLabel>Nombre</FormLabel>
                                            <Input placeholder="Nombre completo" {...field} value={field.value ?? ""} />
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className='col-span-1'>
                                <FormField
                                    control={form.control}
                                    name="address"
                                    disabled={!HasEdit}
                                    render={({ field }) => (
                                        <FormItem className='w-full'>
                                            <FormLabel>Dirección</FormLabel>
                                            <Input placeholder="Dirección" {...field} value={field.value ?? ""} />
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className='col-span-1'>
                                <FormField
                                    control={form.control}
                                    name="email"
                                    disabled={!HasEdit}
                                    render={({ field }) => (
                                        <FormItem className='w-full'>
                                            <FormLabel>Email</FormLabel>
                                            <Input placeholder="info@org.net" {...field} value={field.value ?? ""} />
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className='col-span-1'>
                                <FormField
                                    control={form.control}
                                    name="phoneNumber"
                                    disabled={!HasEdit}
                                    render={({ field }) => (
                                        <FormItem className='w-full'>
                                            <FormLabel>Número de telefono</FormLabel>
                                            <Input placeholder="Número de telefono" {...field} value={field.value ?? ""} />
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className='col-span-1'>
                                <FormField
                                    control={form.control}
                                    name="googleMapsUrl"
                                    disabled={!HasEdit}
                                    render={({ field }) => (
                                        <FormItem className='w-full'>
                                            <FormLabel>Link de google Maps</FormLabel>
                                            <Input placeholder="https://googlemaps.com" {...field} value={field.value ?? ""} />
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className='col-span-full'>
                                <FormField
                                    control={form.control}
                                    name="description"
                                    disabled={!HasEdit}
                                    render={({ field }) => (
                                        <FormItem className='w-full'>
                                            <FormLabel>Descripción</FormLabel>
                                            <Textarea placeholder="Descripcion de tu organización" {...field} value={field.value ?? ""} />
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>
                        <div className='grid lg:grid-cols-4 gap-4 sm:grid-cols-2'>
                            <div className='col-span-full'>
                                <hr></hr>
                                <h3 className="font-bold tracking-tight text-gray-800 pt-3">Redes Sociales</h3>
                            </div>
                            <div className='col-span-1'>
                                <FormField
                                    control={form.control}
                                    name="socialMedia.facebook"
                                    disabled={!HasEdit}
                                    render={({ field }) => (
                                        <FormItem className='w-full'>
                                            <FormLabel>Facebook</FormLabel>
                                            <Input placeholder="Link Facebook" {...field} value={field.value ?? ""} />
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className='col-span-1'>
                                <FormField
                                    control={form.control}
                                    name="socialMedia.instagram"
                                    disabled={!HasEdit}
                                    render={({ field }) => (
                                        <FormItem className='w-full'>
                                            <FormLabel>Instagram</FormLabel>
                                            <Input placeholder="Link Instagram" {...field} value={field.value ?? ""} />
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className='col-span-1'>
                                <FormField
                                    control={form.control}
                                    name="socialMedia.twitter"
                                    disabled={!HasEdit}
                                    render={({ field }) => (
                                        <FormItem className='w-full'>
                                            <FormLabel>Twiter</FormLabel>
                                            <Input placeholder="Link Twiter" {...field} value={field.value ?? ""} />
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>
                        <div className='grid lg:grid-cols-4 gap-4 sm:grid-cols-2'>
                            <div className='col-span-full'>
                                <hr />
                                <h2 className="font-bold tracking-tight text-gray-800 pt-3">Galería</h2>
                            </div>

                            <div className='col-span-1'>
                                <FormField
                                    control={form.control}
                                    disabled={!HasEdit}
                                    name="logoUrl"
                                    render={({ field }) => (
                                        <FormItem className='w-full'>
                                            <FormLabel>Logo</FormLabel>
                                            {field.value && (
                                                <div className="mb-2 h-24 w-24 rounded border overflow-hidden">
                                                    <img
                                                        src={field.value}
                                                        alt="Logo preview"
                                                        className="object-contain h-full w-full"
                                                    />
                                                </div>
                                            )}
                                            {!field.value && (
                                                <div className="mb-2 h-24 w-24 rounded border overflow-hidden flex justify-center items-center">
                                                    <Image />
                                                </div>
                                            )}
                                            {HasEdit && (
                                                <Input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={async (e) => {
                                                        const file = e.target.files?.[0];
                                                        if (file) {
                                                            const reader = new FileReader();
                                                            reader.onloadend = () => {
                                                                field.onChange(reader.result); // guarda base64 en el campo
                                                            };
                                                            reader.readAsDataURL(file);
                                                        }
                                                    }}
                                                />
                                            )}
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className='col-span-1'>
                                <FormField
                                    control={form.control}
                                    name="iconUrl"
                                    render={({ field }) => (
                                        <FormItem className='w-full'>
                                            <FormLabel>Icono</FormLabel>
                                            {field.value && (
                                                <div className="mb-2 h-24 w-24 rounded border overflow-hidden">
                                                    <img
                                                        src={field.value}
                                                        alt="Logo preview"
                                                        className="object-contain h-full w-full"
                                                    />
                                                </div>
                                            )}
                                            {!field.value && (
                                                <div className="mb-2 h-24 w-24 rounded border overflow-hidden flex justify-center items-center">
                                                    <Image />
                                                </div>
                                            )}
                                            {HasEdit && (
                                                <Input
                                                    type="file"
                                                    accept="image/ico"
                                                    onChange={async (e) => {
                                                        const file = e.target.files?.[0];
                                                        if (file) {
                                                            const reader = new FileReader();
                                                            reader.onloadend = () => {
                                                                field.onChange(reader.result);
                                                            };
                                                            reader.readAsDataURL(file);
                                                        }
                                                    }}
                                                />
                                            )}
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>
                    </div>
                </form>
            </Form>
        </div >
    )
}

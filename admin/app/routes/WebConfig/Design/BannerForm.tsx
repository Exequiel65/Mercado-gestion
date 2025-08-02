import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect } from 'react'
import { useFieldArray, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { Button } from '~/components/ui/button';
import { FormField, FormItem, FormLabel, FormMessage, Form } from '~/components/ui/form';
import { Input } from '~/components/ui/input';
import { get, post } from '~/services/apiService';
import { useAuthStore } from '../../../store/auth-store';

const bannerSchema =
    z.object({
        id: z.number().optional(),
        text: z.string().optional(),
        link: z.string().url().nullable().optional(),
        sm: z.string().url(),
        md: z.string().url(),
        xl: z.string().url(),

    });
type FormValues = z.infer<typeof bannerArraySchema>;
type Banner = z.infer<typeof bannerSchema>;
const bannerArraySchema = z.object({
    banners: z.array(bannerSchema),
});
const defaultData: FormValues = {
    banners: [],
};


export default function BannerForm() {
    const token = useAuthStore(x => x.token);
    const form = useForm<FormValues>({
        resolver: zodResolver(bannerArraySchema),
        defaultValues: defaultData,
    });

    const { control, handleSubmit } = form;

    const { fields, append, remove } = useFieldArray({
        control,
        name: "banners",
    });

    const getData = async () => {
        try {
            let result = await get<Banner[]>({ path: "/webconfig/banner", token });
            if (result.success) {
                form.reset({
                    banners: result.data
                });
            }
        } catch (error) {
            console.error("Error al cargar los banners:", error);
            toast.error("Error al cargar los banners");
        }
    }

    useEffect(() => {
        getData();

    }, [])


    const onSubmit = async (data: FormValues) => {
        try {
            const result = await post<Banner[], Banner[]>({ path: "/webconfig/banner", data: data.banners, token });
            if (!result.success) {
                toast.error(result.message);
                return;
            }
            form.reset({
                banners: result.data
            });
            toast.success("Banners guardados correctamente");
        } catch (error) {
            console.error("Error al guardar los banners:", error);
            toast.error("Error al guardar los banners");
        }
    };

    return (
        <div className="p-6 space-y-4">
            <Form {...form}>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {fields.map((field, index) => (
                        <div key={field.id} className="space-y-4 border p-4 rounded-lg shadow-sm">
                            <h2 className="font-semibold text-lg">Banner #{index + 1}</h2>
                            <FormField
                                control={control}
                                name={`banners.${index}.text` as `banners.${number}.text`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Texto del banner</FormLabel>
                                        <Input placeholder="Texto del banner" {...field} value={field.value ?? ""} />
                                        <FormMessage />
                                    </FormItem>
                                )} />
                            <FormField
                                control={control}
                                name={`banners.${index}.link` as `banners.${number}.link`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Link (opcional - redirige a un enlace)</FormLabel>
                                        <Input placeholder="Texto del banner" {...field} value={field.value ?? ""} />
                                        <FormMessage />
                                    </FormItem>
                                )} />
                            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2'>
                                {(["sm", "md", "xl"] as const).map((size) => (
                                    <FormField
                                        key={size}
                                        control={control}
                                        name={`banners.${index}.${size}` as
                                            | `banners.${number}.sm`
                                            | `banners.${number}.md`
                                            | `banners.${number}.xl`}
                                        render={({ field }) => (
                                            <FormItem className='col-span-1 w-full'>
                                                <FormLabel>Imagen {size.toUpperCase()}</FormLabel>
                                                {field.value && (
                                                    <div className="w-full h-32 overflow-hidden rounded-2xl border">
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
                                ))}
                            </div>


                            <Button
                                type="button"
                                variant="destructive"
                                onClick={() => remove(index)}
                            >
                                Eliminar banner
                            </Button>
                        </div>
                    ))}

                    <Button
                        type="button"
                        variant="outline"
                        onClick={() =>
                            append({
                                sm: "",
                                md: "",
                                xl: "",
                            })
                        }
                    >
                        Agregar nuevo banner
                    </Button>

                    <div className="pt-6">
                        <Button type="submit">Guardar</Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { toast } from "sonner";
import { get, post } from "~/services/apiService";
import { useAuthStore } from "~/store/auth-store";
import { useEffect } from "react";

const buttonSchema = z.object({
    text: z.string().optional().nullable(),
    path: z.string().optional().nullable()
});

const itemSchema = z.object({
    id: z.number().optional(),
    image: z.string().url().min(1, "La imagen es requerida"),
    title: z.string().optional(),
    subtitle: z.string().optional().nullable(),
    theme: z.enum(["light", "dark"]),
    priority: z.number().min(0),
    bannerGridId: z.number().optional(),
    button: buttonSchema.optional(),
});

const bannerGridSchema = z.object({
    id: z.number().optional(),
    title: z.string().optional(),
    items: z.array(itemSchema),
});

type BannerGridFormType = z.infer<typeof bannerGridSchema>;

export default function BannerGridForm() {
    const token = useAuthStore((state) => state.token);
    const form = useForm<BannerGridFormType>({
        resolver: zodResolver(bannerGridSchema),
        defaultValues: {
            title: "",
            items: [],
        },
    });

    const { control, handleSubmit } = form;
    const { fields, append, remove } = useFieldArray({
        control,
        name: "items",
    });

    const getData = async () => 
        {
            try {
                const result = await get<BannerGridFormType>({path : "/webconfig/banner-grid", token});
                if (result.success) {
                    form.reset(result.data);
                }                

            } catch (error) {
                toast.error("Error al cargar la grilla de banners");
                console.error("Error al cargar la grilla de banners:", error);
            }
    }

    useEffect(() => {
        getData();
    }, []);

    const onSubmit = async (data: BannerGridFormType) => {
        try {
            const result = await post<BannerGridFormType, any>({path: "/webconfig/banner-grid", data: data, token});
            if(result.success) {
                toast.success("Grilla de banners guardada correctamente");
            }
        } catch (error) {
            toast.error("Error al guardar la grilla de banners");
            console.error("Error al guardar la grilla de banners:", error);
        }
    };

    return (
        <div className="p-6 space-y-6">
            <Form {...form}>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                        control={control}
                        name="title"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Título de la grilla</FormLabel>
                                <Input {...field} placeholder="Proximos lanzamientos" />
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {fields.map((item, index) => (
                        <div key={item.id} className="border rounded-lg p-4 space-y-4 shadow-sm">
                            <h3 className="font-semibold text-lg">Item #{index + 1}</h3>

                            <FormField
                                control={control}
                                name={`items.${index}.image`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Imagen</FormLabel>
                                        {field.value && (
                                                <div className="w-full h-44 overflow-hidden rounded-2xl border">
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
                                control={control}
                                name={`items.${index}.title`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Título</FormLabel>
                                        <Input {...field} placeholder="Título del item" />
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={control}
                                name={`items.${index}.subtitle`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Subtítulo</FormLabel>
                                        <Textarea
                                            {...field}
                                            value={field.value ?? ""}
                                            placeholder="Subtítulo del item (opcional)"
                                        />
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={control}
                                name={`items.${index}.theme`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Tema</FormLabel>
                                        <select
                                            className="w-full border rounded px-3 py-2"
                                            value={field.value}
                                            onChange={(e) => field.onChange(e.target.value)}
                                        >
                                            <option value="">Seleccionar</option>
                                            <option value="light">Claro</option>
                                            <option value="dark">Oscuro</option>
                                        </select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={control}
                                name={`items.${index}.priority`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Prioridad</FormLabel>
                                        <Input
                                            type="number"
                                            {...field}
                                            value={field.value ?? 0}
                                            onChange={(e) => field.onChange(parseInt(e.target.value))}
                                        />
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    control={control}
                                    name={`items.${index}.button.text`}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Texto del botón</FormLabel>
                                            <Input {...field} value={field.value ?? ""} placeholder="Texto del botón" />
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={control}
                                    name={`items.${index}.button.path`}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>URL del botón</FormLabel>
                                            <Input {...field} value={field.value ?? ""} placeholder="https://..." />
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <Button
                                type="button"
                                variant="destructive"
                                onClick={() => remove(index)}
                            >
                                Eliminar item
                            </Button>
                        </div>
                    ))}

                    <Button
                        type="button"
                        variant="outline"
                        onClick={() =>
                            append({
                                title: "",
                                subtitle: "",
                                image: "",
                                theme: "light",
                                priority: 0,
                                bannerGridId: 0,
                                button: {
                                    text: "",
                                    path: "",
                                },
                            })
                        }
                    >
                        Agregar item
                    </Button>

                    <div className="pt-4">
                        <Button type="submit">Guardar</Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}

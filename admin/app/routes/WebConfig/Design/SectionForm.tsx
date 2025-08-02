import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { Button } from '~/components/ui/button';
import { FormField, FormItem, FormLabel, FormMessage, Form } from '~/components/ui/form';
import { Input } from '~/components/ui/input';
import { Checkbox } from '~/components/ui/checkbox';
import { get, post } from '~/services/apiService';
import { useAuthStore } from '~/store/auth-store';
import CategorySelectors from '~/components/Customs/Form/CategoriesSelector';
import type { CategoryType, TypeCategory } from '~/routes/Categories/Categories';

const buttonSchema = z.object({
    text: z.string().nullable().optional(),
    path: z.string().nullable().optional(),
    position: z.enum(['bottom', 'top']).nullable().optional(),
});

const optionSchema = z.object({
    hasDiscount: z.boolean().nullable().optional(),
    toDiscount: z.number().nullable().optional(),
    isFeatured: z.boolean().nullable().optional(),
    categoryId: z.number().nullable().optional(),
    subCategoryId: z.number().nullable().optional(),
    childCategoryId: z.number().nullable().optional()
})



const sectionSchema = z.object({
    id: z.number().optional(),
    title: z.string().optional(),
    sectionItem: z.string().nullable().optional(),
    showButtonSlider: z.boolean().default(false).optional(),
    secondLine: z.boolean().default(false).optional(),
    endDate: z.date().nullable().optional(),
    button: buttonSchema.optional(),
    optionSection: optionSchema.optional()
});

const sectionSchemaArray = z.object({
    sections: z.array(sectionSchema),
});

type Section = z.infer<typeof sectionSchema>;
type FormValues = z.infer<typeof sectionSchemaArray>;

export default function SectionForm() {
    const token = useAuthStore((x) => x.token);
    const [Categories, setCategories] = useState<CategoryType>([])
    const form = useForm<FormValues>({
        resolver: zodResolver(sectionSchemaArray),
        defaultValues: {
            sections: [],
        },
    });

    const { control, handleSubmit } = form;

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'sections',
    });

    const fetchCategories = async () => {
        try {
            const res = await get<TypeCategory[]>({ path: 'category', token })
            if (res.success) {
                setCategories(res.data)
            } else {
                toast.error('No se pudieron cargar las categorías')
            }
        } catch (error) {
            console.error('Error fetching categories:', error)
            toast.error('No se pudieron cargar las categorías')
        }
    }
    const getData = async () => {
        try {
            const result = await get<Section[]>({ path: '/webconfig/section', token });
            if (result.success) {
                form.reset({
                    sections: result.data,
                });
            }
        } catch (error) {
            console.error('Error al cargar las secciones:', error);
            toast.error('Error al cargar las secciones');
        }
    };

    useEffect(() => {
        getData();
        fetchCategories();
    }, []);

    const onSubmit = async (data: FormValues) => {
        try {
            const result = await post<Section[], Section[]>({
                path: '/webconfig/section',
                data: data.sections,
                token,
            });

            if (!result.success) {
                toast.error(result.message);
                return;
            }

            form.reset({
                sections: result.data,
            });

            toast.success('Secciones guardadas correctamente');
        } catch (error) {
            console.error('Error al guardar las secciones:', error);
            toast.error('Error al guardar las secciones');
        }
    };

    return (
        <div className="p-6 space-y-6">
            <Form {...form}>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                    {fields.map((field, index) => (
                        <div
                            key={field.id}
                            className="space-y-6 border p-6 rounded-xl shadow-sm bg-white"
                        >
                            <div className="flex justify-between items-center">
                                <h2 className="font-semibold text-lg">Sección #{index + 1}</h2>
                                <Button
                                    type="button"
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => remove(index)}
                                >
                                    Eliminar
                                </Button>
                            </div>

                            <FormField
                                control={control}
                                name={`sections.${index}.title`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Título</FormLabel>
                                        <Input placeholder="Título de la sección" {...field} value={field.value ?? ''} />
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={control}
                                name={`sections.${index}.sectionItem`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Subtítulo</FormLabel>
                                        <Input placeholder="Identificador o alias" {...field} value={field.value ?? ''} />
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    control={control}
                                    name={`sections.${index}.showButtonSlider`}
                                    render={({ field }) => (
                                        <FormItem className="flex items-center gap-2">
                                            <Checkbox
                                                id={`showButtonSlider-${index}`}
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                            <FormLabel htmlFor={`showButtonSlider-${index}`}>Mostrar botones laterales</FormLabel>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={control}
                                    name={`sections.${index}.secondLine`}
                                    render={({ field }) => (
                                        <FormItem className="flex items-center gap-2">
                                            <Checkbox
                                                id={`secondLine-${index}`}
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                            <FormLabel htmlFor={`secondLine-${index}`}>Habilitar dos filas</FormLabel>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="space-y-4 border-t pt-4">
                                <h3 className="text-md font-semibold">Botón</h3>

                                <FormField
                                    control={control}
                                    name={`sections.${index}.button.text`}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Texto</FormLabel>
                                            <Input placeholder="Texto del botón" {...field} value={field.value ?? ''} />
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={control}
                                    name={`sections.${index}.button.path`}
                                    disabled
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Link</FormLabel>
                                            <Input placeholder="https://ejemplo.com" {...field} value={field.value ?? ''} />
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={control}
                                    name={`sections.${index}.button.position`}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Posición</FormLabel>
                                            <select
                                                className="w-full border rounded px-3 py-2"
                                                value={field.value ?? ''}
                                                onChange={(e) => field.onChange(e.target.value)}
                                            >
                                                <option value="">Seleccionar</option>
                                                <option value="top">Arriba</option>
                                                <option value="bottom">Abajo</option>
                                            </select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="space-y-4 border-t pt-4">
                                <h3 className="text-md font-semibold">Opciones de combinación para link del boton</h3>

                                <CategorySelectors
                                    form={form}
                                    Categories={Categories}
                                    categoryId={form.getValues(`sections.${index}.optionSection.categoryId`) ?? undefined}
                                    subCategoryId={form.getValues(`sections.${index}.optionSection.subCategoryId`) ?? undefined}
                                    childCategoryId={form.getValues(`sections.${index}.optionSection.childCategoryId`) ?? undefined}
                                    nameCategory={`sections.${index}.optionSection.categoryId`}
                                    nameSubcategory={`sections.${index}.optionSection.subCategoryId`}
                                    nameChildCategory={`sections.${index}.optionSection.childCategoryId`}
                                />

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <FormField
                                        control={control}
                                        name={`sections.${index}.optionSection.isFeatured`}
                                        render={({ field }) => (
                                            <FormItem className="flex items-center gap-2">
                                                <Checkbox
                                                    checked={field.value ?? false}
                                                    onCheckedChange={field.onChange}
                                                />
                                                <FormLabel>Ver destacados</FormLabel>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={control}
                                        name={`sections.${index}.optionSection.hasDiscount`}
                                        render={({ field }) => (
                                            <FormItem className="flex items-center gap-2">
                                                <Checkbox
                                                    checked={field.value ?? false}
                                                    onCheckedChange={field.onChange}
                                                />
                                                <FormLabel>Con descuentos</FormLabel>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={control}
                                        name={`sections.${index}.optionSection.toDiscount`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Hasta %</FormLabel>
                                                <Input
                                                    type="number"
                                                    placeholder="Ej: 50"
                                                    disabled={!form.watch(`sections.${index}.optionSection.hasDiscount`)}
                                                    {...field}
                                                    value={field.value ?? ''}
                                                    onChange={(e) => field.onChange(e.target.valueAsNumber)}

                                                />
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}

                    <div className="flex justify-between pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() =>
                                append({
                                    title: '',
                                    showButtonSlider: false,
                                    secondLine: false,
                                    endDate: null,
                                    button: {
                                        text: '',
                                        path: '',
                                        position: undefined
                                    },
                                    optionSection: {
                                        isFeatured: false,
                                        hasDiscount: false,
                                        toDiscount: undefined,
                                        categoryId: undefined,
                                        subCategoryId: undefined,
                                        childCategoryId: undefined
                                    }
                                })
                            }
                        >
                            Agregar nueva sección
                        </Button>

                        <Button type="submit">Guardar</Button>
                    </div>
                </form>
            </Form>
        </div>

    );
}

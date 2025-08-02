import React, { useEffect, useState } from 'react'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '~/components/ui/accordion'
import { z } from "zod"
import { Folder, Layers} from 'lucide-react'
import EditCategory from './EditCategory'
import { get } from '~/services/apiService';
import { useAuthStore } from '~/store/auth-store'


export const childCategorySchema = z.object({
    id: z.number().nullable().default(0),
    name: z.string(),
    subCategoryId: z.number().default(0),
})

export const subCategorySchema = z.object({
    id: z.number().nullable().default(0),
    name: z.string(),
    categoryId: z.number().nullable().default(0),
    childCategories: z.array(childCategorySchema),
})

export const categorySchema = z.object({
    id: z.number().nullable().default(0),
    name: z.string(),
    subCategories: z.array(subCategorySchema),
})

export const mockSchema = z.array(categorySchema)

export type TypeCategory = z.infer<typeof categorySchema>
export type CategoryType = z.infer<typeof mockSchema>
export type SubcategoryType = z.infer<typeof subCategorySchema>
export type ChildCategoryType = z.infer<typeof childCategorySchema>

const mock: CategoryType = [
    {
        "id": 0,
        "name": "",
        "subCategories": [
            {
                "id": 0,
                "name": "",
                "categoryId": 0,
                "childCategories": [
                    {
                        "id": 0,
                        "name": "",
                        "subCategoryId": 0,
                    }
                ],
            }
        ],
    }
]

export function meta(){
  return [
    {title: "Categorias"}
  ]
}

export default function Categories() {
    const [Categories, setCategories] = useState<CategoryType>([])
    const token = useAuthStore((state) => state.token)

    const getCategories = async () => {
        try {
            const response = await get<CategoryType>({ path: '/category', token });
            const data = mockSchema.parse(response.data);
            setCategories(data);
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    }
    useEffect(() => {
        getCategories();
    }, [])

    return (
        <div className="flex flex-col gap-4 p-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Categorías</h1>
                    <p className="text-muted-foreground text-sm">Gestioná las categorías de tus productos.</p>
                </div>
                <EditCategory
                    className="px-4 py-2"
                    category={mock[0]}
                    type='add'
                    title='Agregar Categoría'
                    titleButton='Agregar Categoría'
                    onUpdateData={getCategories}

                />

            </div>

            <Accordion type="multiple" className="w-full space-y-2">
                {Categories.map((cat) => (
                    <AccordionItem key={cat.id} value={`cat-${cat.id}`} className="border rounded-md relative">
                        <AccordionTrigger className="bg-muted px-4 py-2 rounded-t-md hover:bg-muted/80 w-full">
                            <div className="flex justify-between items-center w-full">
                                <div className="flex items-center gap-2">
                                    <Folder className="w-4 h-4 text-primary" />
                                    <span className="font-medium">{cat.name}</span>
                                </div>
                            </div>
                        </AccordionTrigger>
                        <EditCategory
                            className="px-4 py-2 absolute -top-0 right-10 mt-0.5"
                            category={cat}
                            type='edit'
                            title="Editar Categoría"
                            titleButton="Editar"
                            onUpdateData={getCategories}
                        />
                        <AccordionContent className="bg-background px-6 py-4 border-t">
                            {cat.subCategories.length > 0 ? subCategory(cat.subCategories) : (
                                <p className="text-muted-foreground text-sm">Sin subcategorías.</p>
                            )}
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </div>
    )
}


const subCategory = (subCategories: SubcategoryType[]) => (
    <Accordion type="multiple" className="w-full space-y-2 pl-4">
        {subCategories.map((sub) => (
            <AccordionItem key={sub.id} value={`sub-${sub.id}`} className="border rounded-md">
                <AccordionTrigger className="bg-gray-100 px-4 py-2 hover:bg-gray-100/80">
                    <div className="flex items-center gap-2">
                        <Layers className="w-4 h-4 text-muted-foreground" />
                        <span className="font-medium">{sub.name}</span>
                    </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 py-2 border-t">
                    {sub.childCategories.length > 0 ? childCategory(sub.childCategories) : (
                        <p className="text-muted-foreground text-sm">Sin categorías hijas.</p>
                    )}
                </AccordionContent>
            </AccordionItem>
        ))}
    </Accordion>
)

const childCategory = (child: ChildCategoryType[]) => (
    <ul className="space-y-2 pl-4">
        {child.map((c) => (
            <li key={c.id} className="flex justify-between items-center bg-gray-50 p-2 rounded border">
                <span>{c.name}</span>
            </li>
        ))}
    </ul>
)



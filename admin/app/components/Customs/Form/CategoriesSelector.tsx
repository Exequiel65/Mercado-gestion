import { useEffect, useMemo } from "react"
import {
    FormField, FormItem, FormLabel, FormMessage
} from "~/components/ui/form"
import {
    Select, SelectTrigger, SelectValue, SelectContent, SelectItem
} from "~/components/ui/select"
import type { TypeCategory } from "~/routes/Categories/Categories"

type Props = {
    form: any
    Categories: TypeCategory[],
    categoryId?: number
    subCategoryId?: number
    childCategoryId?: number
    nameCategory?: string
    nameSubcategory?: string
    nameChildCategory?: string
}

export default function CategorySelectors({ form, Categories, categoryId, subCategoryId, childCategoryId,nameCategory = "categoryId", nameSubcategory = "subCategoryId", nameChildCategory = "childCategoryId"  }: Props) {

    useEffect(() => {
        if (categoryId && !form.getValues(nameCategory)) {
            form.setValue(nameCategory, categoryId)
        }
        if (subCategoryId && !form.getValues(nameSubcategory)) {
            form.setValue(nameSubcategory, subCategoryId)
        }
        if (childCategoryId && !form.getValues(nameChildCategory)) {
            form.setValue(nameChildCategory, childCategoryId)
        }
    }, [categoryId, subCategoryId, childCategoryId, form])

    const selectedCategoryId = form.watch(nameCategory)
    const selectedSubCategoryId = form.watch(nameSubcategory)

    const subCategories = useMemo(() => {
        if (!selectedCategoryId) return []
        const selectedCategory = Categories.find(cat => cat.id === selectedCategoryId)
        return selectedCategory?.subCategories || []
    }, [Categories, selectedCategoryId])

    const childCategories = useMemo(() => {
        if (!selectedCategoryId || !selectedSubCategoryId) return []
        const selectedCategory = Categories.find(cat => cat.id === selectedCategoryId)
        const selectedSubCategory = selectedCategory?.subCategories.find(sub => sub.id === selectedSubCategoryId)
        return selectedSubCategory?.childCategories || []
    }, [Categories, selectedCategoryId, selectedSubCategoryId])

    const handleCategoryChange = (categoryId: string) => {
        form.setValue(nameCategory, Number(categoryId))
        form.setValue(nameSubcategory, "") 
        form.setValue(nameChildCategory, "")
    }
    const handleSubCategoryChange = (subCategoryId: string) => {
        form.setValue(nameSubcategory, Number(subCategoryId))
        form.setValue(nameChildCategory, "")
    }

    return (
        <>
            {/* Categoría */}
            <FormField
                control={form.control}
                name={nameCategory}
                render={({ field }) => (
                    <FormItem className="min-w-48 max-w-48 col-span-1">
                        <FormLabel>Categoría</FormLabel>
                        <Select
                            value={field.value ? String(field.value) : ""}
                            onValueChange={handleCategoryChange}
                        >
                            <SelectTrigger className="min-w-48 max-w-48">
                                <SelectValue placeholder="Seleccione una categoría" />
                            </SelectTrigger>
                            <SelectContent>
                                {Categories.map(cat => (
                                    <SelectItem key={cat.id} value={String(cat.id)}>
                                        {cat.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                )}
            />

            {/* Subcategoría */}
            <FormField
                control={form.control}
                name={nameSubcategory}
                render={({ field }) => (
                    <FormItem className="min-w-48 max-w-48 col-span-1">
                        <FormLabel>Subcategoría</FormLabel>
                        <Select
                            value={field.value ? String(field.value) : ""}
                            onValueChange={handleSubCategoryChange}
                            disabled={!selectedCategoryId}
                        >
                            <SelectTrigger className="min-w-48 max-w-48">
                                <SelectValue placeholder="Seleccione una subcategoría" />
                            </SelectTrigger>
                            <SelectContent>
                                {subCategories.map(subCat => (
                                    <SelectItem key={subCat.id} value={String(subCat.id)}>
                                        {subCat.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                )}
            />

            {/* Subcategoría hija */}
            <FormField
                control={form.control}
                name={nameChildCategory}
                render={({ field }) => (
                    <FormItem className="min-w-48 max-w-48 col-span-1">
                        <FormLabel>Subcategoría hija</FormLabel>
                        <Select
                            value={field.value ? String(field.value) : ""}
                            onValueChange={(val) => field.onChange(Number(val))}
                            disabled={!selectedSubCategoryId}
                        >
                            <SelectTrigger className="min-w-48 max-w-48">
                                <SelectValue placeholder="Seleccione una subcategoría hija" />
                            </SelectTrigger>
                            <SelectContent>
                                {childCategories.map(child => (
                                    <SelectItem key={child.id} value={String(child.id)}>
                                        {child.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </>
    )
}
import { Pencil, Plus, Trash2 } from 'lucide-react'
import React, { useState } from 'react'
import { Button } from '~/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '~/components/ui/dialog'
import { Input } from '~/components/ui/input'

import type { z } from 'zod'
import type { categorySchema } from './Categories'
import { cn } from '~/lib/utils'
import { post } from '~/services/apiService'
import { useAuthStore } from '~/store/auth-store'
import { toast } from 'sonner'
type Category = z.infer<typeof categorySchema>

export default function EditCategory(
    {
        category,
        className,
        type,
        title,
        titleButton,
        onUpdateData,
    }:
        { category: Category, className?: string, type: "add" | "edit", title?: string, titleButton?: string, onUpdateData?: () => void }) {
    const [data, setData] = useState<Category>(category)
    const token = useAuthStore(state => state.token)
    const updateCategoryName = (value: string) => {
        setData(prev => ({ ...prev, name: value }))
    }

    const updateSubName = (idx: number, value: string) => {
        const updated = [...data.subCategories]
        updated[idx].name = value
        setData(prev => ({ ...prev, subCategories: updated }))
    }

    const updateChildName = (subIdx: number, childIdx: number, value: string) => {
        const updated = [...data.subCategories]
        updated[subIdx].childCategories[childIdx].name = value
        setData(prev => ({ ...prev, subCategories: updated }))
    }

    const updateCategory = async (updatedCategory: Category) => {
        try {
            const response = await post<Category, any>({ path: "category", data: updatedCategory, token })
            if (response.success) {

                if (type === "add") {
                    toast.success('Categoría agregada exitosamente')
                } else {
                    toast.success('Categoría actualizada exitosamente')
                }
                if (onUpdateData) {
                    onUpdateData()
                }
            } else {
                if (type === "add") {
                    toast.error('Error al agregar la categoría')
                } else {
                    toast.error('Error al actualizar la categoría')
                }
            }
        } catch (error) {
            if (type === "add") {
                toast.error('Error al agregar la categoría')
            } else {
                toast.error('Error al actualizar la categoría')
            }

        }
    }

    return (
        <Dialog >
            <DialogTrigger asChild className={cn(className)}>
                <Button variant="outline" size="sm">
                    {type === "add" ? <Plus className="mr-2 h-4 w-4" /> : <Pencil className="mr-2 h-4 w-4" />}
                    {titleButton}
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>
                        {type === "add" ? "Agrega" : "Edita"} la estructura de categorías y subcategorías.
                    </DialogDescription>
                </DialogHeader>

                {/* Nombre de categoría */}
                <div className="space-y-2">
                    <p className="font-semibold">Nombre de la categoría</p>
                    <Input value={data.name} onChange={e => updateCategoryName(e.target.value)} />
                </div>

                {/* Subcategorías */}
                <div className="space-y-4 mt-4">
                    <div className="flex justify-between items-center">
                        <p className="font-semibold">Subcategorías</p>
                        <Button variant="outline" size="sm" onClick={() => {
                            setData(prev => ({
                                ...prev,
                                subCategories: [
                                    ...prev.subCategories,
                                    {
                                        id: 0,
                                        name: '',
                                        categoryId: prev.id === null ? 0 : prev.id,
                                        childCategories: [],
                                    }
                                ]
                            }))
                        }}>
                            <Plus className="w-4 h-4 mr-1" /> Agregar subcategoría
                        </Button>
                    </div>

                    {data.subCategories.map((sub, idx) => (
                        <div key={sub.id} className="space-y-2 border p-3 rounded-md">
                            <p className='w-full'>Nombre de la subcategoria:</p>
                            <div className="flex gap-2 items-center">
                                <Input
                                    value={sub.name}
                                    onChange={e => updateSubName(idx, e.target.value)}
                                    className="flex-1"
                                />
                                <Button variant="destructive" size="icon" onClick={() => {
                                    const updated = [...data.subCategories]
                                    updated.splice(idx, 1)
                                    setData(prev => ({ ...prev, subCategories: updated }))
                                }}>
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>

                            {/* Hijos */}
                            <div className="pl-4 space-y-2">
                                <hr></hr>
                                <p className="font-normal">Hijos de {sub.name}:</p>
                                {sub.childCategories.map((child, cIdx) => (
                                    <div key={child.id} className="flex gap-2 items-center">
                                        <Input
                                            value={child.name}
                                            onChange={e => updateChildName(idx, cIdx, e.target.value)}
                                            className="flex-1"
                                        />
                                        <Button variant="destructive" size="icon" onClick={() => {
                                            const updated = [...data.subCategories]
                                            updated[idx].childCategories.splice(cIdx, 1)
                                            setData(prev => ({ ...prev, subCategories: updated }))
                                        }}>
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                ))}
                                <Button variant="outline" size="sm" onClick={() => {
                                    const updated = [...data.subCategories]
                                    updated[idx].childCategories.push({
                                        id: 0,
                                        name: '',
                                        subCategoryId: sub.id ?? 0,
                                    })
                                    setData(prev => ({ ...prev, subCategories: updated }))
                                }}>
                                    <Plus className="w-4 h-4 mr-1" /> Agregar hijo
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Botón de guardar (opcional) */}
                <div className="mt-6 text-right">
                    <Button onClick={() => updateCategory(data)} className="bg-blue-500 text-white hover:bg-blue-600">
                        Guardar cambios
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}

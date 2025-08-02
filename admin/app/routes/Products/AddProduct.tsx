import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'

import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { FormField, FormItem, FormLabel, FormMessage, Form } from '~/components/ui/form'
import { Checkbox } from '~/components/ui/checkbox'

import { get, post } from '~/services/apiService'
import { productSchema, type Product } from './table/schema'
import { useAuthStore } from '~/store/auth-store'
import type { CategoryType, TypeCategory } from '../Categories/Categories'
import { Textarea } from '~/components/ui/textarea'
import CategorySelectors from '~/components/Customs/Form/CategoriesSelector'
import { formatPrice, parsePrice } from '../../lib/utils';

export function meta() {
  return [
    { title: "Agregar producto" }
  ]
}

export default function AddProduct() {
  const token = useAuthStore(s => s.token)
  const navigate = useNavigate()
  const [imagePreviews, setImagePreviews] = useState<any[]>([])
  const [Categories, setCategories] = useState<CategoryType>([])
  const form = useForm<Product>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      id: 0,
      name: '',
      description: '',
      price: 0,
      stock: 0,
      isActive: true,
      isDeleted: false,
      deletedDate: null,
      deletedBy: null,
      isFeatured: false,
      isSoldOut: false,
      hasDiscount: false,
      amountDiscount: null,
      categoryId: null,
      subCategoryId: null,
      childCategoryId: null,
      images: [],
      category: null,
      subCategory: null,
      childCategory: null,
    },
  })

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
  useEffect(() => {
    fetchCategories()
  }, [form])

  const handleImageUpload = async (files: FileList | null) => {
    if (!files) return
    const base64List: any[] = []
    for (const file of Array.from(files)) {
      const reader = new FileReader()
      const base64 = await new Promise<string>((resolve, reject) => {
        reader.onload = () => resolve(reader.result as string)
        reader.onerror = reject
        reader.readAsDataURL(file)
      })
      base64List.push({
        mediaUrl: base64,
        mediaType: file.type,
      })
    }


    setImagePreviews([...imagePreviews, ...base64List])
    form.setValue('images', base64List)
  }


  const handleRemoveImage = (indexToRemove: number) => {
    const updatedImages = imagePreviews.filter((_, index) => index !== indexToRemove)
    setImagePreviews(updatedImages)
    form.setValue('images', updatedImages)
  }
  const onSubmit = async (data: Product) => {
    try {
      const res = await post<Product, any>({
        path: 'product',
        data: {
          ...data,
          images: imagePreviews,
        },
        token,
      })
      if (res.success) {
        toast.success('Producto agregado correctamente')
        navigate('/admin/products')
      } else {
        toast.error('Ocurrió un error al guardar el producto')
      }
    } catch {
      toast.error('Ocurrió un error al guardar el producto')
    }
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Agregar nuevo producto</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>Nombre</FormLabel>
                      <Input placeholder="Nombre del producto" {...field} />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem className="col-span-2 lg:col-span-4">
                      <FormLabel>Descripción</FormLabel>
                      <Textarea placeholder="Descripción" {...field} />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Precio</FormLabel>
                      <Input
                        type="text"
                        min={0}
                        step={0.01}
                        {...field}
                        onChange={(e) => {
                          const parsed = parsePrice(e.target.value)
                          field.onChange(parsed)
                        }} value={formatPrice(field.value) ?? ""}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="stock"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Stock</FormLabel>
                      <Input type="number" min={0} {...field} onChange={(e) => field.onChange(e.target.valueAsNumber)} value={field.value ?? 0} />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <CategorySelectors
                  Categories={Categories}
                  form={form}
                />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <FormField
                  control={form.control}
                  name="isActive"
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-2">
                      <Checkbox id="active" checked={field.value} onCheckedChange={field.onChange} />
                      <FormLabel htmlFor="active">Activo</FormLabel>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="isFeatured"
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-2">
                      <Checkbox id="featured" checked={field.value} onCheckedChange={field.onChange} />
                      <FormLabel htmlFor="featured">Destacado</FormLabel>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="isSoldOut"
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-2">
                      <Checkbox id="soldout" checked={field.value} onCheckedChange={field.onChange} />
                      <FormLabel htmlFor="soldout">Sin Stock</FormLabel>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="hasDiscount"
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-2">
                      <Checkbox id="discount" checked={field.value} onCheckedChange={field.onChange} />
                      <FormLabel htmlFor="discount">Descuento</FormLabel>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="amountDiscount"
                  disabled={!form.watch('hasDiscount')}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Monto descuento</FormLabel>
                      <Input
                        type="number"
                        min={0}
                        step={0.01}
                        {...field}
                        onChange={(e) => field.onChange(e.target.valueAsNumber)} value={field.value ?? 0}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />

              </div>

              {/* Imágenes */}
              <div className="space-y-2">
                <FormLabel>Imágenes del producto</FormLabel>
                <Input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => handleImageUpload(e.target.files)}
                />
                <div className="flex flex-wrap gap-4 mt-2">
                  {imagePreviews.map((src, idx) => (
                    <div key={idx} className="relative group">
                      <img
                        src={src.mediaUrl}
                        alt={`preview-${idx}`}
                        className="w-24 h-24 object-cover border rounded"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(idx)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => navigate('/admin/products')}>
                  Cancelar
                </Button>
                <Button type="submit">Guardar cambios</Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}

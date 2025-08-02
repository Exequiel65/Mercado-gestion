import { z } from "zod"

export const productSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string(),
  price: z.number(),
  stock: z.number(),
  createdDate: z.string().optional(),
  updatedDate: z.string().optional(),
  createdBy: z.string().optional(),
  updatedBy: z.string().optional().nullable(),
  isActive: z.boolean(),
  isDeleted: z.boolean(),
  deletedDate: z.string().nullable(),
  deletedBy: z.string().optional().nullable(),
  isFeatured: z.boolean(),
  isSoldOut: z.boolean(),
  hasDiscount: z.boolean(),
  amountDiscount: z.number().nullable(),
  categoryId: z.number().nullable(),
  subCategoryId: z.number().nullable(),
  childCategoryId: z.number().nullable(),
  images: z.array(z.any()).nullable(),
  category: z.any().nullable(),        
  subCategory: z.any().nullable(),     
  childCategory: z.any().nullable(),

})


export const productSimpleSchema = z.object({
  id: z.number(),
  name: z.string(),
  
  price: z.number(),
  stock: z.number(),
 
  isActive: z.boolean(),
  isDeleted: z.boolean(),

  isFeatured: z.boolean(),
  isSoldOut: z.boolean(),
  hasDiscount: z.boolean(),
  
  categoryId: z.number().nullable(),
  subCategoryId: z.number().nullable(),
  childCategoryId: z.number().nullable()
})

export type ProductSimple = z.infer<typeof productSimpleSchema>;

export type Product = z.infer<typeof productSchema>
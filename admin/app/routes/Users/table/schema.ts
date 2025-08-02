import { z } from "zod"

export const userSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  userName: z.string(),
  picture: z.string().nullable(),
  entityId: z.number(),
  storeId: z.number().nullable(),
  isActive: z.boolean(),
  isEnabled: z.boolean(),
  isDeleted: z.boolean(),
  roles: z.array(z.string()),
})

export type user = z.infer<typeof userSchema>
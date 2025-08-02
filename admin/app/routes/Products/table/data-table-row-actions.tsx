"use client"

import { type Row } from "@tanstack/react-table"
import { MoreHorizontal } from "lucide-react"

import { Button } from "~/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu"
import { productSimpleSchema } from "./schema"
import { Link } from "react-router"
import { del, post } from "~/services/apiService"
import { toast } from "sonner"
import { useAuthStore } from "~/store/auth-store"


interface DataTableRowActionsProps<TData> {
  row: Row<TData>
}

export function DataTableRowActions2<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const product = productSimpleSchema.parse(row.original)
  const token = useAuthStore(s => s.token)
  const onDelete = async () => {
    try {
      const res = await del<any>({ path: 'product', id: product.id, token })
      if (res.success) {
        toast.success('Producto eliminado correctamente')
      } else {
        toast.error('Ocurrió un error al eliminar el producto')
      }
    } catch (err) {
      console.error('Error deleting product:', err)
      toast.error('Ocurrió un error al eliminar el producto')
    }
  }

  const onQuickAction = async (action: string) => {
    try {
      const res = await post<any,any>({ path: `product/quick-action/${product.id}`, token, data: { action } })
      if (res.success) {
        toast.success(`Acción rápida "${action}" aplicada correctamente`)
      } else {
        toast.error(`Ocurrió un error al aplicar la acción rápida "${action}"`)
      }    
    } catch (error) {
      
    }
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="data-[state=open]:bg-muted size-8"
        >
          <MoreHorizontal />
          <span className="sr-only">Abrir menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px]">
        <DropdownMenuItem asChild><Link to={`/admin/products/${product.id}/edit`}>Editar</Link></DropdownMenuItem>
        {/* <DropdownMenuItem>Make a copy</DropdownMenuItem>
        <DropdownMenuItem>Favorite</DropdownMenuItem> */}
        <DropdownMenuSeparator />
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>Acciones rapidas</DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuRadioGroup value={product.name}>
              {product.hasDiscount && (
                <DropdownMenuRadioItem value="notDiscounted" onClick={() => onQuickAction('NOT_DISCOUNT')}>
                  Desactivar descuento
                </DropdownMenuRadioItem>
              )}
              {!product.isSoldOut && (
                <DropdownMenuRadioItem value="soldout" onClick={() => onQuickAction('SOLDOUT')}>
                  Agotado
                </DropdownMenuRadioItem>
              )}
              {product.isActive && !product.isDeleted && (
                <DropdownMenuRadioItem value="disabled" onClick={() => onQuickAction('DISABLED')}>
                  Desactivar
                </DropdownMenuRadioItem>
              )}
            </DropdownMenuRadioGroup>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        {!product.isDeleted && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive" onClick={onDelete}>
              Eliminar
              <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
            </DropdownMenuItem>
          </>

        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export const labels = [
  {
    value: "DISABLED",
    label: "Desactivar",
  },
  {
    value: "ACTIVE",
    label: "Activar",
  },
  {
    value: "SOLDOUT",
    label: "Agotado",
  },
  {
    value: "FEATURED",
    label: "Destacar",
  },
  {
    value: "NOT_DISCOUNT",
    label: "Desactivar descuento",
  },
]

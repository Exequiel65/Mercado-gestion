import { type ColumnDef } from "@tanstack/react-table"

import { Badge } from "~/components/ui/badge"
import { Checkbox } from "~/components/ui/checkbox"

import { DataTableColumnHeader } from "../../../components/Customs/table/data-table-column-header"

import type { ProductSimple } from "./schema"
import { DataTableRowActions2 } from "./data-table-row-actions"

export const columns: ColumnDef<ProductSimple>[] = [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                }
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
                className="translate-y-[2px]"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
                className="translate-y-[2px]"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "name",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Nombre" />
        ),
        cell: ({ row }) => {
            // const label = labels.find((label) => label.value === row.original.email)
            return (
                <div className="flex gap-2">
                    {/* {label && <Badge variant="outline">{label.label}</Badge>} */}
                    <span className="max-w-[500px] truncate font-medium">
                        {row.getValue("name")}
                    </span>
                </div>
            )
        },
        meta: {
            displayName: "Nombre"
        }
    },
    {
        accessorKey: "price",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Precio" />
        ),
        cell: ({ row }) => {
            const price = row.getValue("price")
            return (
                <span className="font-medium">
                    {new Intl.NumberFormat("es-AR", {
                        style: "currency",
                        currency: "ARS",
                    }).format(Number(price))}
                </span>
            )
        },
        meta: {
            displayName: "Precio"
        }
    },
    {
        accessorKey: "stock",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Stock" />
        ),
        cell: ({ row }) => {
            const stock = row.getValue("stock")
            return <span className="font-medium">{String(stock)}</span>
        },
    },
    {
        accessorKey: "tags",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Etiquetas" />
        ),
        cell: ({ row }) => {
            const { isSoldOut, hasDiscount, isFeatured } = row.original;
            const tags: string[] = [];
            if (hasDiscount) tags.push("Descuento");
            if (isSoldOut) tags.push("Sold Out");
            if (isFeatured) tags.push("Destacado");
            // if (isPopular) tags.push("Popular");

            const tagStyles: Record<string, string> = {
                "Descuento": "border-blue-500 bg-blue-100",
                "Sold Out": "border-gray-500 bg-gray-100",
                "Nuevo": "border-purple-500 bg-purple-100",
                "Destacado": "border-orange-500 bg-orange-100",
            };

            return (
                <div className="flex flex-wrap gap-1">
                    {tags.length === 0 ? (
                        <span className="text-muted-foreground text-xs">Sin etiquetas</span>
                    ) : (
                        tags.map((tag) => (
                            <Badge
                                key={tag}
                                variant="outline"
                                className={tagStyles[tag] || "border-slate-300 bg-slate-100"}
                            >
                                {tag}
                            </Badge>
                        ))
                    )}
                </div>
            );
        },
        enableSorting: false,
        enableHiding: true,
        meta: {
            displayName: "Tags"
        }
    },
    {
        accessorKey: "status",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Status" />
        ),
        cell: ({ row }) => {
            const { isActive, isDeleted } = row.original

            const statusValue = isDeleted ? "isDeleted" : isActive && !isDeleted ? "active" : "inactive"

            const colorbg = statusValue === "isDeleted" ?
                "border-red-500 bg-red-100" : statusValue === "active" ?
                    "border-green-500 bg-green-100" : "border-yellow-500 bg-yellow-100";
            return (
                <div className="flex w-[100px] items-center gap-2">
                    {/* {status.icon && (
            <status.icon className="text-muted-foreground size-4" />
          )} */}

                    <Badge variant="outline" className={colorbg} >
                        {statusValue === "isDeleted" ? "Eliminado" : statusValue === "active" ? "Activo" : "Inactivo"}
                    </Badge>
                    {/* <span
            className={`py-1 px-3 rounded-sm ${colorbg}`}>
            {status.label}
          </span> */}
                </div>
            )
        },
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id))
        },
        enableSorting: false,
        meta: {
            displayName: "Estado"
        }
    },
    {
        id: "actions",
        cell: ({ row }) => <DataTableRowActions2 row={row} />,
    },
]



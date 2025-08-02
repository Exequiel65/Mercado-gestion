import { type ColumnDef } from "@tanstack/react-table"

import { Badge } from "~/components/ui/badge"
import { Checkbox } from "~/components/ui/checkbox"

import { DataTableColumnHeader } from "../../../components/Customs/table/data-table-column-header"

import { rols, statuses } from "./configTable"
import type { user } from "./schema"
import { DataTableRowActions2 } from "./data-table-row-actions"

export const columns: ColumnDef<user>[] = [
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
  // {
  //   accessorKey: "id",
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title="Task" />
  //   ),
  //   cell: ({ row }) => <div className="w-[80px]">{row.getValue("id")}</div>,
  //   enableSorting: false,
  //   enableHiding: false,

  // },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
    cell: ({ row }) => {
      // const label = labels.find((label) => label.value === row.original.email)
      return (
        <div className="flex gap-2">
          {/* {label && <Badge variant="outline">{label.label}</Badge>} */}
          <span className="max-w-[500px] truncate font-medium">
            {row.getValue("email")}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nombre" />
    ),
    cell: ({ row }) => {
      // const label = labels.find((label) => label.value === row.original.fullName)

      return (
        <div className="flex gap-2">
          {/* {label && <Badge variant="outline">{label.label}</Badge>} */}
          <span className="max-w-[500px] truncate font-medium">
            {row.getValue("name")}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: "isActive",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status = statuses.find(
        (status) => status.value === row.getValue("isActive")
      )
      if (!status) {
        return null
      }
      const value = status.label.toLowerCase()
      const colorbg = value === "activo" ?
        "border-green-500 bg-green-100" : value === "inactivo" ?
          "border-red-500 bg-red-100" : "border-yellow-500 bg-yellow-100";
      return (
        <div className="flex w-[100px] items-center gap-2">
          {/* {status.icon && (
            <status.icon className="text-muted-foreground size-4" />
          )} */}

          <Badge variant="outline" className={colorbg} >
            {status.label}
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
    enableSorting: false
  },
  {
    accessorKey: "roles",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Rol" />
    ),
    cell: ({ row }) => {
      const roles: string[] = row.original.roles

      if (!Array.isArray(roles) || roles.length === 0) {
        return null
      }

      const matchedRoles = roles
        .map((role) => rols.find((r) => r.value === role))
        .filter((r): r is { value: string; label: string } => Boolean(r))

      return (
        <div className="flex flex-wrap gap-2">
          {matchedRoles.map((rol, idx) => (
            <Badge key={idx} variant="secondary">
              {rol.label}
            </Badge>
          ))}
        </div>
      )
    },
    filterFn: (row, columnId, filterValue: string[]) => {
      const rowRoles: string[] = row.getValue(columnId)
      return filterValue.some((value) => rowRoles.includes(value))
    },
    enableSorting: false
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions2 row={row} />,
  },
]



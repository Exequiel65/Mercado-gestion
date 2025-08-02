import { ArrowDown, ArrowRight, ArrowUp, CheckCircle, Circle, CircleOff, HelpCircle, Timer, XCircle } from "lucide-react"
import type { IFilters } from "~/components/Customs/table/types"

export const statuses = [
    {
        value: true,
        label: "Activo",
        icon: CheckCircle,
    },
    {
        value: false,
        label: "inactivo",
        icon: XCircle,
    },
    {
        value: "pendiente",
        label: "Pendiente",
        icon: Circle,
    }
]

export const rols = [
    {
        label: "SuperAdmin",
        value: "superadmin",
        // icon: ArrowDown,
    },
    {
        label: "Admin",
        value: "admin",
        // icon: ArrowRight,
    },
    {
        label: "Usuario",
        value: "user",
        // icon: ArrowUp,
    },
]


export const filters : IFilters[] = [
    {
        columnName: "isActive",
        title: "status",
        options: statuses
    }
    ,
    {
        columnName: "roles",
        title: "Roles",
        options: rols
    },
]
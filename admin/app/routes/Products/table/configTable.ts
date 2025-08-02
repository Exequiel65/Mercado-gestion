import { CheckCircle, Star, XCircle } from "lucide-react"
import type { IFilters } from "~/components/Customs/table/types"


export const filters: IFilters[] = [
    {
        columnName: "status",
        title: "Estado",
        options: [
            { value: "active", label: "Activo", icon: CheckCircle },
            { value: "inactive", label: "Inactivo", icon: XCircle },
            { value: "isDeleted", label: "Eliminado", icon: XCircle },
        ]
    },
    {
        columnName: "tags",
        title: "Etiquetas",
        options: [
            { value: "hasDiscount", label: "Con Descuento", icon: CheckCircle },
            { value: "isSoldOut", label: "Agotado", icon: XCircle },
            { value: "isFeatured", label: "Destacado", icon: Star },

        ]
    },
    
]
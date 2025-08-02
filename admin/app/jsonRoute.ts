import {
    Building2,
    House,
    PackageSearch,
    ReceiptText,
    UserRound,
} from "lucide-react"
export const data = {
    navMain: [
        {
            title: "Inicio",
            url: "/admin",
            icon: House,
            isActive: false,
        },
        {
            title: "Productos",
            url: "#",
            icon: PackageSearch,
            items: [
                {
                    title: "Ver productos",
                    url: "/admin/products",
                },
                {
                    title: "Crear producto",
                    url: "/admin/products/add",
                },
                {
                    title: "Categorías",
                    url: "/admin/category"
                }
                // {
                //   title: "Quantum",
                //   url: "#",
                // },
            ],
        },
        {
            title: "Plataforma de usuarios",
            url: "/admin/user",
            icon: UserRound,
            isAdmin: true,
            onlySuperAdmin: true
        },
        // {
        //     title: "Configuraciones",
        //     url: "#",
        //     icon: Cog,
        //     isAdmin: true,
        //     items: [
        //         {
        //             title: "General",
        //             url: "#",
        //         },
        //         {
        //             title: "Usuarios",
        //             url: "/user",
        //         },
        //         {
        //             title: "Roles y permisos",
        //             url: "#",
        //             onlySuperAdmin: true
        //         },
        //         {
        //             title: "Facturación",
        //             url: "#",
        //         },
        //     ],
        // },
        {
            title: "Negocio",
            url: "/admin/business",
            icon: Building2,
            isAdmin: true,
            onlySuperAdmin: true
        },
        {
            title: "Web Tienda",
            url: "#",
            icon: ReceiptText,
            isAdmin: true,
            onlySuperAdmin: true,
            items: [
                {
                    title: "Configuración",
                    url: "/admin/webconfig",
                    onlySuperAdmin: true
                },
                {
                    title: "Diseño",
                    url: "/admin/webconfig/design",
                    onlySuperAdmin: true
                },
                {
                    title: "Términos y condiciones",
                    url: "/admin/webconfig/terms",
                    onlySuperAdmin: true
                },
                {
                    title: "Política de privacidad",
                    url: "/admin/webconfig/policy",
                    onlySuperAdmin: true
                },
                {
                    title: "Preguntas frecuentes",
                    url: "/admin/webconfig/frequently-question",
                    onlySuperAdmin: true
                }
            ]
        }
    ]
}
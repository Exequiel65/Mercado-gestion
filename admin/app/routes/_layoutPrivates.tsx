import { Outlet, Navigate } from "react-router"
import { useAuthStore, type User } from "~/store/auth-store"
import { AppSidebar } from "~/components/app-sidebar"
import { Separator } from "~/components/ui/separator"
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "~/components/ui/sidebar"
import { useEffect } from "react"
import api from "~/services/api"
import { useSetupStore, type Store } from "~/store/setup-store"
import { get } from "~/services/apiService"
import { Toaster } from "sonner"



export default function _layoutPrivates() {
    const { token, isHydrated, user, setUser } = useAuthStore()
    if (!isHydrated) return null


    const { setStores, setCurrentStore, setHydrated, isHydrated: hydratatedStore, stores } = useSetupStore();
    const getStores = async () => {
        try {
            const res = await api.get("store", {
                headers: {
                    Authorization : "Bearer " + token
                }
            })
            setStores(res.data as Store[])
        } catch (e) {
            console.error("Error fetching entity", e)
        }
    }

    const getUser = async () => {
        try {
            const res = await get<User>({ path: "user", token: token })
            setUser(res.data as User)
        } catch (e) {
            console.error("Error fetching entity", e)
        } finally {
            setHydrated(true)
        }
    }
    useEffect(() => {
        const fetchData = async () => {
            await getStores();
            await getUser();
        }
        fetchData()
    }, [])

    if (!isHydrated) return null
    if (!token) {
        return <Navigate to="/admin/login" replace />
    }
    if (!hydratatedStore || !user) {
        return null
    }
    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
                    <div className="flex items-center gap-2 px-4">
                        <SidebarTrigger className="-ml-1" />
                        <Separator
                            orientation="vertical"
                            className="mr-2 data-[orientation=vertical]:h-4"
                        />
                        {/* <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem className="hidden md:block">
                                    <BreadcrumbLink href="#">
                                        Building Your Application
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator className="hidden md:block" />
                                <BreadcrumbItem>
                                    <BreadcrumbPage>Data Fetching</BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>*/}
                    </div>
                </header>
                <Outlet />
                <Toaster expand={true} richColors position="top-center" />
            </SidebarInset>
        </SidebarProvider>
    )
}

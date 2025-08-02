import { ChevronRight, type LucideIcon } from "lucide-react"
import { Link } from "react-router"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "~/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "~/components/ui/sidebar"
import { useAuthStore } from "~/store/auth-store"

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: LucideIcon
    isActive?: boolean
    isAdmin?: boolean
    onlySuperAdmin? :boolean
    items?: {
      title: string
      url: string
      onlySuperAdmin?: boolean
    }[]
  }[]
}) {
  const user = useAuthStore(x => x.user)
  const isAdmin = user?.roles.some(r => r === "superadmin" || r === "admin")
  const isSuper = user?.roles.includes("superadmin")
  const canView = (item: any) => {
    if (item.isAdmin === true) return isAdmin
    if (item.isAdmin === false) return !isAdmin
    return true // si no está definido, lo ven todos
  }
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Platform</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          if (!canView(item)) return null

          const hasChildren = item.items?.length

          if (hasChildren) {
            const visibleChildren = item.items?.filter(sub =>
              sub.onlySuperAdmin ? isSuper : true
            )
            if (!visibleChildren?.length) return null

            return (
              <Collapsible
                key={item.title}
                asChild
                defaultOpen={item.isActive}
                className="group/collapsible"
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton tooltip={item.title}>
                      {item.icon && <item.icon />}
                      <span>{item.title}</span>
                      <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {visibleChildren.map(sub => (
                        <SidebarMenuSubItem key={sub.title}>
                          <SidebarMenuSubButton asChild>
                            <Link to={sub.url}>
                              <span>{sub.title}</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            )
          }

          return (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton isActive={item.isActive}>
                {item.icon && <item.icon />}
                <Link to={item.url}>{item.title}</Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}
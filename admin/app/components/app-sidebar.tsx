import * as React from "react"
import { NavMain } from "~/components/nav-main"
import { NavUser } from "~/components/nav-user"
import { TeamSwitcher } from "~/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "~/components/ui/sidebar"
import { useSetupStore } from "~/store/setup-store"
import { useAuthStore } from "~/store/auth-store"
import { data } from "~/jsonRoute"



export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const stores = useSetupStore(s => s.stores)
  const user = useAuthStore(s => s.user)
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher stores={stores} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        {/* <NavProjects projects={data.projects} /> */}
      </SidebarContent>
      <SidebarFooter>
        {user && (
          <NavUser user={user} />
        )}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}

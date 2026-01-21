import { 
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { NavLink, useLocation } from 'react-router-dom';
import { FileText, Settings } from 'lucide-react';

const sidebarItems = [
  { title: "Meus Conteúdos", url: "/profile", icon: FileText },
  { title: "Configurações", url: "/profile/settings", icon: Settings },
];

export function ProfileSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => {
    if (path === '/profile') {
      return currentPath === '/profile' || currentPath === '/profile/';
    }
    return currentPath.startsWith(path);
  };

  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive ? "bg-primary text-primary-foreground font-medium" : "hover:bg-accent/50";

  return (
    <Sidebar
      className={`${state === "collapsed" ? "w-14" : "w-64"} h-[calc(100vh-4rem)] border-r sticky top-16 z-40`}
      variant="sidebar"
      side="left"
    >
      <SidebarContent className="bg-background border-r">
        <SidebarGroup className="px-2 py-4">
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {sidebarItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      end={item.url === '/profile'}
                      className={({ isActive }) => getNavCls({ isActive })}
                    >
                      <item.icon className="h-4 w-4" />
                      {state !== "collapsed" && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
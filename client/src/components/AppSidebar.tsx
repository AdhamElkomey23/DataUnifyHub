
import { Home, DollarSign, Users, CheckSquare, BookOpen, Settings, ChevronRight } from "lucide-react";
import { Link, useLocation } from "wouter";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const mainItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: Home,
  },
  {
    title: "Prices",
    url: "/prices",
    icon: DollarSign,
  },
  {
    title: "Contacts",
    url: "/contacts",
    icon: Users,
  },
  {
    title: "Tasks",
    url: "/tasks",
    icon: CheckSquare,
  },
  {
    title: "Knowledge Base",
    url: "/knowledge",
    icon: BookOpen,
  },
];

export function AppSidebar() {
  const [location] = useLocation();

  return (
    <Sidebar>
      <SidebarHeader className="p-6 pb-4">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">BM</span>
          </div>
          <div>
            <h2 className="font-semibold text-base tracking-tight">Business Manager</h2>
            <p className="text-xs text-muted-foreground">Manage & Grow</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-3">
        <SidebarGroup>
          <SidebarGroupLabel className="px-3 text-xs font-semibold text-muted-foreground mb-2">
            MAIN MENU
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={location === item.url}
                    className="group relative h-11 px-3"
                  >
                    <Link href={item.url} data-testid={`link-${item.title.toLowerCase().replace(' ', '-')}`}>
                      <div className="flex items-center gap-3 flex-1">
                        <div className={`
                          flex items-center justify-center h-8 w-8 rounded-lg transition-colors
                          ${location === item.url 
                            ? 'bg-primary/10 text-primary' 
                            : 'text-muted-foreground group-hover:bg-accent group-hover:text-accent-foreground'
                          }
                        `}>
                          <item.icon className="h-4 w-4" />
                        </div>
                        <span className={`
                          font-medium text-sm
                          ${location === item.url ? 'text-foreground' : 'text-muted-foreground group-hover:text-foreground'}
                        `}>
                          {item.title}
                        </span>
                      </div>
                      {location === item.url && (
                        <ChevronRight className="h-4 w-4 text-primary opacity-70" />
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="p-3 mt-auto">
        <div className="flex items-center gap-3 rounded-xl p-3 border border-border/50 bg-card/50 hover:bg-accent/50 transition-colors cursor-pointer group">
          <Avatar className="h-9 w-9 border-2 border-primary/20">
            <AvatarFallback className="bg-primary text-primary-foreground text-xs font-semibold">
              AD
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate text-foreground">Admin User</p>
            <div className="flex items-center gap-2 mt-0.5">
              <Badge variant="outline" className="text-xs px-1.5 py-0 h-5">Admin</Badge>
              <span className="text-xs text-muted-foreground">•</span>
              <span className="text-xs text-muted-foreground">Online</span>
            </div>
          </div>
          <Settings className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}

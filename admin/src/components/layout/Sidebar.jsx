import { NavLink } from "react-router-dom";
import { 
  LayoutDashboard, 
  Users, 
  UserSquare2, 
  BrainCircuit, 
  ChefHat, 
  MessageSquare, 
  BarChart3, 
  ShieldAlert, 
  Bell, 
  Settings, 
  Activity 
} from "lucide-react";
import { cn } from "../../lib/utils";

const navItems = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Users", href: "/users", icon: Users },
  { name: "Guests", href: "/guests", icon: UserSquare2 },
  { name: "AI Monitoring", href: "/ai-logs", icon: BrainCircuit },
  { name: "Recipes", href: "/recipes", icon: ChefHat },
  { name: "Community", href: "/community", icon: MessageSquare },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
  { name: "Security", href: "/security", icon: ShieldAlert },
  { name: "Notifications", href: "/notifications", icon: Bell },
  { name: "System Health", href: "/health", icon: Activity },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar({ className }) {
  return (
    <aside className={cn("hidden md:flex w-64 flex-col border-r bg-card/50 backdrop-blur-md px-3 py-4 space-y-4", className)}>
      <div className="flex items-center px-3 mb-6">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
            <ChefHat className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold tracking-tight">AKitchen Admin</span>
        </div>
      </div>
      
      <nav className="flex-1 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.href}
            to={item.href}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                isActive 
                  ? "bg-primary/10 text-primary" 
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )
            }
          >
            <item.icon className="h-5 w-5" />
            {item.name}
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto px-3 py-2 bg-muted/50 rounded-lg">
        <p className="text-xs text-muted-foreground text-center">
          AKitchen AI Dashboard v1.0
        </p>
      </div>
    </aside>
  );
}

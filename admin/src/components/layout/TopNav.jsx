import { Menu, Search, Sun, Moon, LogOut } from "lucide-react";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { useThemeStore } from "../../store/themeStore";
import { useAuthStore } from "../../store/authStore";
import { useNavigate } from "react-router-dom";

export function TopNav({ setSidebarOpen }) {
  const { theme, toggleTheme } = useThemeStore();
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-md sm:px-6">
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden"
        onClick={() => setSidebarOpen(true)}
      >
        <Menu className="h-5 w-5" />
        <span className="sr-only">Toggle Sidebar</span>
      </Button>

      <div className="flex flex-1 items-center gap-4 md:gap-8">
        <form className="flex-1 sm:flex-initial">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search anything (Cmd+K)..."
              className="pl-9 sm:w-[300px] md:w-[400px] bg-muted/50 border-none focus-visible:ring-primary/50"
            />
          </div>
        </form>
      </div>

      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={toggleTheme} className="rounded-full">
          {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          <span className="sr-only">Toggle theme</span>
        </Button>
        
        <div className="hidden md:flex items-center gap-2 border-l pl-4">
          <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center overflow-hidden">
            {user?.picture ? (
              <img src={user.picture} alt="Profile" className="h-full w-full object-cover" />
            ) : (
              <span className="text-sm font-medium text-primary">{user?.name?.[0] || 'A'}</span>
            )}
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium leading-none">{user?.name || 'Admin'}</span>
            <span className="text-xs text-muted-foreground mt-1 capitalize">{user?.role || 'Super Admin'}</span>
          </div>
          <Button variant="ghost" size="icon" onClick={handleLogout} className="ml-2 rounded-full text-muted-foreground hover:text-destructive">
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}

import { Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AdminLayout } from "./components/layout/AdminLayout";
import { Login } from "./pages/Login";
import { Dashboard } from "./pages/Dashboard";
import { Users } from "./pages/Users";
import { Guests } from "./pages/Guests";
import { Recipes } from "./pages/Recipes";
import { AILogs } from "./pages/AILogs";
import { Community } from "./pages/Community";
import { Analytics } from "./pages/Analytics";
import { Security } from "./pages/Security";
import { Notifications } from "./pages/Notifications";
import { Health } from "./pages/Health";
import { Settings } from "./pages/Settings";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        <Route element={<AdminLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/users" element={<Users />} />
          <Route path="/guests" element={<Guests />} />
          <Route path="/recipes" element={<Recipes />} />
          <Route path="/ai-logs" element={<AILogs />} />
          <Route path="/community" element={<Community />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/security" element={<Security />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/health" element={<Health />} />
          <Route path="/settings" element={<Settings />} />
          
          {/* Fallback route */}
          <Route path="*" element={
            <div className="p-6 flex flex-col items-center justify-center h-[60vh]">
              <h1 className="text-4xl font-bold mb-2">404</h1>
              <p className="text-muted-foreground text-lg">Page not found or under construction.</p>
            </div>
          } />
        </Route>
      </Routes>
    </QueryClientProvider>
  );
}

export default App;
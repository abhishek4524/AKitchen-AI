import { useQuery } from "@tanstack/react-query";
import { Activity, Server, Cpu, Database } from "lucide-react";
import { StatCard } from "../components/ui/StatCard";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/Card";
import api from "../lib/axios";

export function Health() {
  const { data: health, isLoading } = useQuery({
    queryKey: ['admin-health'],
    queryFn: async () => {
      const res = await api.get('/admin/health');
      return res.data;
    },
    refetchInterval: 5000 // Refresh every 5s
  });

  if (isLoading) return <div className="flex justify-center p-8"><Activity className="animate-spin h-8 w-8 text-primary"/></div>;

  const memUsagePercent = health ? ((health.totalMem - health.freeMem) / health.totalMem * 100).toFixed(1) : 0;
  const uptimeHours = health ? (health.uptime / 3600).toFixed(1) : 0;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">System Health</h2>
        <p className="text-muted-foreground mt-1">
          Real-time backend server metrics and performance.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          title="Server Status"
          value={health?.status}
          icon={Server}
          className="text-green-500 border-green-500/20 bg-green-500/5"
        />
        <StatCard
          title="Uptime"
          value={`${uptimeHours} hrs`}
          icon={Activity}
        />
        <StatCard
          title="Memory Usage"
          value={`${memUsagePercent}%`}
          description={`${(health?.freeMem / 1024 / 1024 / 1024).toFixed(2)} GB Free`}
          icon={Database}
        />
      </div>

      <Card className="glass-panel">
        <CardHeader>
          <CardTitle>CPU Load Average</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-8">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">1 min</p>
              <p className="text-2xl font-bold">{health?.loadAvg[0].toFixed(2)}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">5 min</p>
              <p className="text-2xl font-bold">{health?.loadAvg[1].toFixed(2)}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">15 min</p>
              <p className="text-2xl font-bold">{health?.loadAvg[2].toFixed(2)}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

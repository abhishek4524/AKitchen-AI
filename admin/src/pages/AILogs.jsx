import { useQuery } from "@tanstack/react-query";
import { BrainCircuit, Cpu, Zap, Activity } from "lucide-react";
import { DataTable } from "../components/ui/DataTable";
import { StatCard } from "../components/ui/StatCard";
import api from "../lib/axios";

export function AILogs() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const res = await api.get('/admin/stats');
      return res.data;
    }
  });

  const usageStats = stats?.usageStats || {};
  
  // Transform usageStats into array for table
  const aiEndpoints = Object.keys(usageStats).map(key => ({
    endpoint: key,
    totalRequests: usageStats[key].total,
    uniqueUsers: usageStats[key].perUser?.length || 0,
    status: "Healthy"
  }));

  const columns = [
    {
      header: "AI Endpoint",
      accessorKey: "endpoint",
      cell: (row) => (
        <div className="flex items-center gap-2 font-medium capitalize">
          <BrainCircuit className="h-4 w-4 text-primary" />
          {row.endpoint.replace(/_/g, ' ')}
        </div>
      )
    },
    {
      header: "Total Requests",
      accessorKey: "totalRequests",
      cell: (row) => (
        <span className="font-semibold">{row.totalRequests.toLocaleString()}</span>
      )
    },
    {
      header: "Unique Users",
      accessorKey: "uniqueUsers",
    },
    {
      header: "Status",
      cell: () => (
        <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-700 dark:text-green-400">
          <span className="h-1.5 w-1.5 rounded-full bg-green-500"></span>
          Healthy
        </span>
      )
    }
  ];

  const totalRequests = aiEndpoints.reduce((acc, curr) => acc + curr.totalRequests, 0);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">AI Monitoring</h2>
          <p className="text-muted-foreground mt-1">
            Track AI token usage, endpoint performance, and costs.
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          title="Total AI Requests"
          value={totalRequests.toLocaleString()}
          icon={Zap}
          className="bg-primary/5 border-primary/20"
        />
        <StatCard
          title="Active Endpoints"
          value={aiEndpoints.length}
          icon={Cpu}
        />
        <StatCard
          title="System Status"
          value="Operational"
          icon={Activity}
          className="text-green-500"
        />
      </div>

      <h3 className="text-xl font-semibold tracking-tight mt-8 mb-4">Endpoint Usage</h3>
      <DataTable 
        columns={columns} 
        data={aiEndpoints} 
        searchPlaceholder="Search endpoints..." 
      />
    </div>
  );
}

import { useQuery } from "@tanstack/react-query";
import { ShieldAlert, Activity } from "lucide-react";
import { DataTable } from "../components/ui/DataTable";
import { Badge } from "../components/ui/Badge";
import api from "../lib/axios";

export function Security() {
  const { data: logs = [], isLoading } = useQuery({
    queryKey: ['admin-security-logs'],
    queryFn: async () => {
      const res = await api.get('/admin/security-logs');
      return res.data;
    }
  });

  const columns = [
    {
      header: "Admin",
      accessorKey: "adminName"
    },
    {
      header: "Action",
      cell: (row) => (
        <Badge variant="outline" className="font-mono text-xs">
          {row.action}
        </Badge>
      )
    },
    {
      header: "Resource",
      cell: (row) => (
        <span>{row.resource} ({row.resourceId?.substring(0,8) || 'N/A'})</span>
      )
    },
    {
      header: "Timestamp",
      cell: (row) => (
        <span className="text-sm text-muted-foreground">
          {new Date(row.createdAt).toLocaleString()}
        </span>
      )
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Security Logs</h2>
        <p className="text-muted-foreground mt-1">
          Audit trail of all administrative actions.
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-8"><Activity className="animate-spin h-8 w-8 text-primary"/></div>
      ) : (
        <DataTable columns={columns} data={logs} searchPlaceholder="Search logs..." />
      )}
    </div>
  );
}

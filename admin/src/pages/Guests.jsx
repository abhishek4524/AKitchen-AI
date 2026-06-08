import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { UserSquare2, RefreshCcw } from "lucide-react";
import { DataTable } from "../components/ui/DataTable";
import { Button } from "../components/ui/Button";
import api from "../lib/axios";

export function Guests() {
  const queryClient = useQueryClient();

  const { data: guests = [], isLoading } = useQuery({
    queryKey: ['admin-guests'],
    queryFn: async () => {
      const res = await api.get('/admin/guests');
      return res.data;
    }
  });

  const resetMutation = useMutation({
    mutationFn: (id) => api.put(`/admin/guests/${id}/reset`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-guests'] })
  });

  const handleReset = (id) => {
    if (window.confirm("Reset usage for this guest?")) {
      resetMutation.mutate(id);
    }
  };

  const columns = [
    {
      header: "Guest ID",
      accessorKey: "guestId",
      cell: (row) => (
        <div className="font-mono text-sm">{row.guestId}</div>
      )
    },
    {
      header: "Total Usage",
      accessorKey: "usageCount",
      cell: (row) => (
        <span className="font-medium text-primary">{row.usageCount} requests</span>
      )
    },
    {
      header: "Last Active",
      cell: (row) => (
        <span className="text-sm text-muted-foreground">
          {new Date(row.lastUsed).toLocaleString()}
        </span>
      )
    },
    {
      header: "Actions",
      cell: (row) => (
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" title="Reset Usage" onClick={() => handleReset(row._id)} disabled={resetMutation.isPending}>
            <RefreshCcw className="h-4 w-4" />
          </Button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Guest Management</h2>
          <p className="text-muted-foreground mt-1">
            Monitor anonymous guest usage across AI endpoints.
          </p>
        </div>
      </div>

      <DataTable 
        columns={columns} 
        data={guests} 
        searchPlaceholder="Search guests by ID..." 
      />
    </div>
  );
}

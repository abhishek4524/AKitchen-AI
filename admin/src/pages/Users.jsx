import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Users as UsersIcon, UserCog, Ban } from "lucide-react";
import { DataTable } from "../components/ui/DataTable";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import api from "../lib/axios";

export function Users() {
  const queryClient = useQueryClient();

  const { data: users = [], isLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      const res = await api.get('/admin/users');
      return res.data;
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (userId) => api.delete(`/admin/users/${userId}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-users'] })
  });

  const roleMutation = useMutation({
    mutationFn: ({ userId, role }) => api.put(`/admin/users/${userId}`, { role }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-users'] })
  });

  const handleDelete = (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      deleteMutation.mutate(userId);
    }
  };

  const handleRoleChange = (userId, currentRole) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    if (window.confirm(`Change role to ${newRole}?`)) {
      roleMutation.mutate({ userId, role: newRole });
    }
  };

  const columns = [
    {
      header: "User",
      cell: (row) => (
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center overflow-hidden">
            {row.picture ? (
              <img src={row.picture} alt="" className="h-full w-full object-cover" />
            ) : (
              <span className="text-xs font-medium text-primary">{row.name?.[0] || 'U'}</span>
            )}
          </div>
          <div>
            <div className="font-medium">{row.name}</div>
            <div className="text-xs text-muted-foreground">{row.email}</div>
          </div>
        </div>
      )
    },
    {
      header: "Role",
      cell: (row) => (
        <Badge variant={row.role === 'admin' ? 'default' : 'secondary'} className="capitalize">
          {row.role || 'user'}
        </Badge>
      )
    },
    {
      header: "Auth Type",
      cell: (row) => (
        <span className="text-xs">
          {row.googleId ? "Google" : "Email"}
        </span>
      )
    },
    {
      header: "Joined",
      cell: (row) => (
        <span className="text-sm text-muted-foreground">
          {new Date(row.createdAt).toLocaleDateString()}
        </span>
      )
    },
    {
      header: "Actions",
      cell: (row) => (
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" title="Change Role" onClick={() => handleRoleChange(row._id, row.role)} disabled={roleMutation.isPending}>
            <UserCog className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50" title="Delete User" onClick={() => handleDelete(row._id)} disabled={deleteMutation.isPending}>
            <Ban className="h-4 w-4" />
          </Button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">User Management</h2>
          <p className="text-muted-foreground mt-1">
            Manage your registered users, roles, and access.
          </p>
        </div>
      </div>

      <DataTable 
        columns={columns} 
        data={users} 
        searchPlaceholder="Search users by name or email..." 
      />
    </div>
  );
}

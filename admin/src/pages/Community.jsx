import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { MessageSquare, Trash2, Star } from "lucide-react";
import { DataTable } from "../components/ui/DataTable";
import { Button } from "../components/ui/Button";
import api from "../lib/axios";

export function Community() {
  const queryClient = useQueryClient();

  const { data: reviews = [], isLoading } = useQuery({
    queryKey: ['admin-reviews'],
    queryFn: async () => {
      const res = await api.get('/admin/reviews');
      return res.data;
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/admin/reviews/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-reviews'] })
  });

  const handleDelete = (id) => {
    if (window.confirm("Delete this review?")) {
      deleteMutation.mutate(id);
    }
  };

  const columns = [
    {
      header: "Author",
      cell: (row) => (
        <div>
          <div className="font-medium">{row.name}</div>
          {row.user?.email && <div className="text-xs text-muted-foreground">{row.user.email}</div>}
        </div>
      )
    },
    {
      header: "Rating",
      cell: (row) => (
        <div className="flex items-center text-yellow-500">
          <Star className="h-4 w-4 fill-current" />
          <span className="ml-1 text-sm font-medium">{row.rating}</span>
        </div>
      )
    },
    {
      header: "Comment",
      cell: (row) => (
        <div className="max-w-md truncate text-sm" title={row.comment}>
          {row.comment}
        </div>
      )
    },
    {
      header: "Date",
      cell: (row) => (
        <span className="text-sm text-muted-foreground">
          {new Date(row.createdAt).toLocaleDateString()}
        </span>
      )
    },
    {
      header: "Actions",
      cell: (row) => (
        <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50" onClick={() => handleDelete(row._id)} disabled={deleteMutation.isPending}>
          <Trash2 className="h-4 w-4" />
        </Button>
      )
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Community Moderation</h2>
          <p className="text-muted-foreground mt-1">
            Review and moderate user feedback and testimonials.
          </p>
        </div>
      </div>

      <DataTable columns={columns} data={reviews} searchPlaceholder="Search reviews..." />
    </div>
  );
}

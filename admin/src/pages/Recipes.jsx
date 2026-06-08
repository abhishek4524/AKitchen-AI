import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ChefHat, ExternalLink, Trash2 } from "lucide-react";
import { DataTable } from "../components/ui/DataTable";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import api from "../lib/axios";

export function Recipes() {
  const queryClient = useQueryClient();

  const { data: recipes = [], isLoading } = useQuery({
    queryKey: ['admin-recipes'],
    queryFn: async () => {
      const res = await api.get('/admin/recipes');
      return res.data;
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/admin/recipes/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-recipes'] })
  });

  const handleDelete = (id) => {
    if (window.confirm("Delete this recipe permanently?")) {
      deleteMutation.mutate(id);
    }
  };

  const columns = [
    {
      header: "Recipe",
      cell: (row) => (
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center overflow-hidden border">
            {row.image ? (
              <img src={row.image} alt={row.title} className="h-full w-full object-cover" />
            ) : (
              <ChefHat className="h-5 w-5 text-muted-foreground" />
            )}
          </div>
          <div>
            <div className="font-medium max-w-[200px] truncate">{row.title || 'Untitled Recipe'}</div>
            <div className="text-xs text-muted-foreground">{row.cuisine || 'Global'} • {row.diet || 'Any'}</div>
          </div>
        </div>
      )
    },
    {
      header: "Type",
      cell: (row) => (
        <Badge variant={row.aiGenerated ? 'secondary' : 'default'}>
          {row.aiGenerated ? 'AI Generated' : 'User Created'}
        </Badge>
      )
    },
    {
      header: "Created Date",
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
          <Button variant="ghost" size="icon" title="View Recipe">
            <ExternalLink className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50" title="Delete Recipe" onClick={() => handleDelete(row._id)} disabled={deleteMutation.isPending}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Recipe Moderation</h2>
          <p className="text-muted-foreground mt-1">
            Manage all platform recipes and review generations.
          </p>
        </div>
      </div>

      <DataTable 
        columns={columns} 
        data={recipes} 
        searchPlaceholder="Search recipes by title..." 
      />
    </div>
  );
}

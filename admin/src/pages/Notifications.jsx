import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Bell, Send } from "lucide-react";
import { DataTable } from "../components/ui/DataTable";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Badge } from "../components/ui/Badge";
import api from "../lib/axios";

export function Notifications() {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [type, setType] = useState("in-app");
  
  const queryClient = useQueryClient();

  const { data: notifications = [], isLoading } = useQuery({
    queryKey: ['admin-notifications'],
    queryFn: async () => {
      const res = await api.get('/admin/notifications');
      return res.data;
    }
  });

  const notifyMutation = useMutation({
    mutationFn: (newNote) => api.post('/admin/notifications', newNote),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-notifications'] });
      setTitle("");
      setMessage("");
    }
  });

  const handleSend = (e) => {
    e.preventDefault();
    if (!title || !message) return;
    notifyMutation.mutate({ title, message, type, audience: "all" });
  };

  const columns = [
    {
      header: "Title",
      accessorKey: "title",
      cell: (row) => <div className="font-medium">{row.title}</div>
    },
    {
      header: "Message",
      cell: (row) => <div className="text-sm truncate max-w-sm">{row.message}</div>
    },
    {
      header: "Type",
      cell: (row) => <Badge variant="outline">{row.type}</Badge>
    },
    {
      header: "Sent By",
      cell: (row) => <div className="text-sm">{row.sentBy?.name || "System"}</div>
    },
    {
      header: "Date",
      cell: (row) => <span className="text-sm text-muted-foreground">{new Date(row.createdAt).toLocaleString()}</span>
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Notification Center</h2>
        <p className="text-muted-foreground mt-1">
          Broadcast messages to users and view notification history.
        </p>
      </div>

      <Card className="glass-panel">
        <CardHeader>
          <CardTitle>Send Broadcast</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSend} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">Title</label>
                <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="System Update..." required />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Type</label>
                <select 
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
                  value={type} onChange={(e) => setType(e.target.value)}
                >
                  <option value="in-app">In-App Notification</option>
                  <option value="email">Email Blast</option>
                  <option value="push">Push Notification</option>
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Message</label>
              <Input value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Enter the broadcast message..." required />
            </div>
            <Button type="submit" disabled={notifyMutation.isPending}>
              <Send className="w-4 h-4 mr-2" />
              Send Notification
            </Button>
          </form>
        </CardContent>
      </Card>

      <h3 className="text-xl font-semibold tracking-tight mt-8 mb-4">Notification History</h3>
      <DataTable columns={columns} data={notifications} searchPlaceholder="Search broadcasts..." />
    </div>
  );
}

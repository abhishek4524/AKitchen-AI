import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Settings as SettingsIcon, Save } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import api from "../lib/axios";

export function Settings() {
  const queryClient = useQueryClient();

  const { data: settings = [], isLoading } = useQuery({
    queryKey: ['admin-settings'],
    queryFn: async () => {
      const res = await api.get('/admin/settings');
      return res.data;
    }
  });

  const updateMutation = useMutation({
    mutationFn: (setting) => api.put('/admin/settings', setting),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-settings'] })
  });

  const getSettingValue = (key, defaultVal) => {
    const s = settings.find(s => s.key === key);
    return s ? s.value : defaultVal;
  };

  const handleSave = (key, value, description) => {
    updateMutation.mutate({ key, value, description });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Platform Settings</h2>
        <p className="text-muted-foreground mt-1">
          Configure global platform parameters.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="glass-panel">
          <CardHeader>
            <CardTitle>AI Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Default Model</label>
              <div className="flex gap-2">
                <Input defaultValue={getSettingValue('ai_model', 'gemini-1.5-pro')} id="ai_model" />
                <Button variant="outline" onClick={() => handleSave('ai_model', document.getElementById('ai_model').value, 'Default AI Model')}>Save</Button>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Guest Daily Limit (Requests)</label>
              <div className="flex gap-2">
                <Input type="number" defaultValue={getSettingValue('guest_limit', 5)} id="guest_limit" />
                <Button variant="outline" onClick={() => handleSave('guest_limit', document.getElementById('guest_limit').value, 'Free Guest Limit')}>Save</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-panel">
          <CardHeader>
            <CardTitle>Platform Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Contact Email</label>
              <div className="flex gap-2">
                <Input defaultValue={getSettingValue('contact_email', 'support@akitchenai.in')} id="contact_email" />
                <Button variant="outline" onClick={() => handleSave('contact_email', document.getElementById('contact_email').value, 'Support Email')}>Save</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

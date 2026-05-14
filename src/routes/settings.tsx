import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { AuthGate } from "@/components/AuthGate";
import { getApiUrl, setApiUrl } from "@/lib/api";
import { toast } from "sonner";

export const Route = createFileRoute("/settings")({
  component: () => (
    <AuthGate>
      <AppShell>
        <SettingsPage />
      </AppShell>
    </AuthGate>
  ),
});

function SettingsPage() {
  const [url, setUrl] = useState("");
  useEffect(() => setUrl(getApiUrl()), []);

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    setApiUrl(url);
    toast.success("API URL saved");
  };

  return (
    <div className="p-6 md:p-12 max-w-2xl">
      <div className="text-xs font-mono uppercase tracking-[0.3em] text-primary mb-2">// settings</div>
      <h1 className="display text-5xl md:text-7xl mb-10">CONFIG</h1>

      <form onSubmit={save} className="space-y-6 border border-border rounded-sm bg-card p-6">
        <div>
          <label className="block text-[10px] font-mono uppercase tracking-[0.25em] text-muted-foreground mb-2">
            Backend URL
          </label>
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="http://localhost:8000"
            className="w-full bg-input border border-border rounded-sm px-4 py-3 text-sm font-mono focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
          />
          <p className="text-xs text-muted-foreground mt-2">
            Where your FitBrain FastAPI server is running. Stored locally in your browser.
          </p>
        </div>
        <button className="bg-primary text-primary-foreground px-6 py-3 rounded-sm text-xs font-bold uppercase tracking-widest hover:opacity-90">
          Save
        </button>
      </form>
    </div>
  );
}

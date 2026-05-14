import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { Workouts } from "@/lib/api";
import { AppShell } from "@/components/AppShell";
import { AuthGate } from "@/components/AuthGate";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { Search } from "lucide-react";
import { format } from "date-fns";

const searchSchema = z.object({
  name: z.string().optional().catch(undefined),
});

export const Route = createFileRoute("/progression")({
  validateSearch: (s) => searchSchema.parse(s),
  component: () => (
    <AuthGate>
      <AppShell>
        <ProgressionPage />
      </AppShell>
    </AuthGate>
  ),
});

function ProgressionPage() {
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  const [input, setInput] = useState(search.name ?? "");

  const exerciseName = search.name?.trim();

  const { data, isLoading, error } = useQuery({
    queryKey: ["progression", exerciseName],
    queryFn: () => Workouts.progression(exerciseName!),
    enabled: !!exerciseName,
    retry: false,
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate({ search: { name: input.trim() || undefined } });
  };

  // Build chart data: top set per session
  const chartData = (data || []).map((p) => {
    const top = p.sets.reduce((best, s) => {
      const w = s.weight ?? 0;
      return w > (best?.weight ?? 0) ? s : best;
    }, p.sets[0]);
    return {
      date: format(new Date(p.logged_at), "MMM d"),
      weight: top?.weight ?? 0,
      reps: top?.reps ?? 0,
      sets: p.sets.length,
    };
  });

  return (
    <div className="p-6 md:p-12 max-w-6xl">
      <div className="text-xs font-mono uppercase tracking-[0.3em] text-primary mb-2">// progression</div>
      <h1 className="display text-5xl md:text-7xl mb-10">CLIMB THE BAR</h1>

      <form onSubmit={submit} className="flex gap-2 mb-10">
        <div className="relative flex-1 max-w-lg">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Barbell Bench Press"
            className="w-full bg-input border border-border rounded-sm pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
          />
        </div>
        <button className="bg-primary text-primary-foreground px-6 py-3 rounded-sm text-xs font-bold uppercase tracking-widest hover:opacity-90">
          Plot
        </button>
      </form>

      {!exerciseName && (
        <div className="border border-dashed border-border rounded-sm p-12 text-center">
          <p className="text-sm text-muted-foreground">
            Search any exercise you've logged to see your progression over time.
          </p>
        </div>
      )}

      {exerciseName && isLoading && (
        <div className="text-sm text-muted-foreground">Loading…</div>
      )}

      {exerciseName && error && (
        <div className="border border-destructive/50 bg-destructive/10 text-destructive p-4 rounded-sm text-sm font-mono">
          {(error as Error).message}
        </div>
      )}

      {data && data.length > 0 && (
        <>
          <div className="border border-border rounded-sm bg-card p-6 mb-6">
            <div className="flex items-baseline justify-between mb-6">
              <h2 className="display text-3xl">{exerciseName}</h2>
              <div className="text-xs font-mono text-muted-foreground">
                {data.length} sessions
              </div>
            </div>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.28 0.014 250)" />
                  <XAxis dataKey="date" stroke="oklch(0.65 0.02 250)" fontSize={11} />
                  <YAxis stroke="oklch(0.65 0.02 250)" fontSize={11} />
                  <Tooltip
                    contentStyle={{
                      background: "oklch(0.18 0.014 250)",
                      border: "1px solid oklch(0.28 0.014 250)",
                      borderRadius: 4,
                      fontSize: 12,
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="weight"
                    stroke="oklch(0.92 0.22 125)"
                    strokeWidth={2.5}
                    dot={{ r: 4, fill: "oklch(0.92 0.22 125)" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="border border-border rounded-sm bg-card divide-y divide-border">
            {data.slice().reverse().map((p) => (
              <div key={p.session_id} className="p-5">
                <div className="flex items-baseline justify-between mb-3">
                  <div className="text-sm font-semibold">
                    {format(new Date(p.logged_at), "EEE, MMM d, yyyy")}
                  </div>
                  <div className="text-xs font-mono text-muted-foreground">{p.sets.length} sets</div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {p.sets.map((s, i) => (
                    <div key={i} className="border border-border rounded-sm px-3 py-1.5 text-xs font-mono">
                      <span className="text-primary font-bold">{s.weight ?? "—"}</span>
                      <span className="text-muted-foreground"> {s.unit || ""} × </span>
                      <span>{s.reps ?? "—"}</span>
                      {s.rir != null && s.rir > 0 && (
                        <span className="text-muted-foreground"> @ RIR {s.rir}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

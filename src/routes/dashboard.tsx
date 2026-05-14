import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Workouts } from "@/lib/api";
import { AppShell } from "@/components/AppShell";
import { AuthGate } from "@/components/AuthGate";
import { format, formatDistanceToNow } from "date-fns";
import { Activity, Flame, Dumbbell, ArrowUpRight, PlusCircle } from "lucide-react";

export const Route = createFileRoute("/dashboard")({
  component: () => (
    <AuthGate>
      <AppShell>
        <Dashboard />
      </AppShell>
    </AuthGate>
  ),
});

function Dashboard() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["sessions", { page: 1, page_size: 10 }],
    queryFn: () => Workouts.list(1, 10),
  });

  const total = data?.total ?? 0;
  const recent = data?.sessions ?? [];

  const last7 = recent.filter((s) => {
    const d = new Date(s.logged_at);
    return Date.now() - d.getTime() < 7 * 24 * 3600 * 1000;
  }).length;

  const avgEffort = recent.length
    ? (recent.reduce((a, s) => a + (s.perceived_effort || 0), 0) / recent.length).toFixed(1)
    : "—";

  return (
    <div className="p-6 md:p-12 max-w-6xl">
      <div className="flex items-end justify-between flex-wrap gap-4 mb-10">
        <div>
          <div className="text-xs font-mono uppercase tracking-[0.3em] text-primary mb-2">// dashboard</div>
          <h1 className="display text-5xl md:text-7xl">YOUR LOG</h1>
        </div>
        <Link
          to="/log"
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-3 rounded-sm text-xs font-bold uppercase tracking-widest hover:opacity-90"
        >
          <PlusCircle className="h-4 w-4" /> Log workout
        </Link>
      </div>

      {error && (
        <div className="mb-6 border border-destructive/50 bg-destructive/10 text-destructive p-4 rounded-sm text-sm font-mono">
          {(error as Error).message}
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 gap-px bg-border mb-10 rounded-sm overflow-hidden">
        <Stat icon={Activity} label="Total sessions" value={total.toString()} />
        <Stat icon={Flame} label="Last 7 days" value={last7.toString()} />
        <Stat icon={Dumbbell} label="Avg effort" value={String(avgEffort)} />
      </div>

      <div className="flex items-center justify-between mb-4">
        <h2 className="display text-2xl">Recent sessions</h2>
        <Link to="/sessions" className="text-xs font-mono uppercase tracking-[0.2em] text-muted-foreground hover:text-primary">
          See all →
        </Link>
      </div>

      {isLoading ? (
        <SkeletonList />
      ) : recent.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="border border-border rounded-sm divide-y divide-border bg-card">
          {recent.map((s) => (
            <Link
              key={s.id}
              to="/sessions/$id"
              params={{ id: String(s.id) }}
              className="group flex items-center justify-between p-5 hover:bg-secondary transition-colors"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-3">
                  <div className="display text-2xl">#{s.id}</div>
                  <div className="text-xs font-mono text-muted-foreground">
                    {format(new Date(s.logged_at), "MMM d, HH:mm")}
                  </div>
                </div>
                <div className="text-sm text-muted-foreground truncate mt-1 max-w-md">
                  {s.notes || formatDistanceToNow(new Date(s.logged_at), { addSuffix: true })}
                </div>
              </div>
              <div className="flex items-center gap-4">
                {s.perceived_effort != null && (
                  <div className="text-right">
                    <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">RPE</div>
                    <div className="display text-2xl text-primary">{s.perceived_effort}</div>
                  </div>
                )}
                <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function Stat({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="bg-card p-6 flex items-start justify-between">
      <div>
        <div className="text-[10px] font-mono uppercase tracking-[0.25em] text-muted-foreground mb-3">{label}</div>
        <div className="display text-5xl text-primary">{value}</div>
      </div>
      <Icon className="h-5 w-5 text-muted-foreground" />
    </div>
  );
}

function SkeletonList() {
  return (
    <div className="space-y-2">
      {[0, 1, 2].map((i) => (
        <div key={i} className="h-20 bg-card border border-border rounded-sm animate-pulse" />
      ))}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="border border-dashed border-border rounded-sm p-12 text-center">
      <Dumbbell className="h-10 w-10 mx-auto text-muted-foreground mb-4" />
      <h3 className="display text-2xl mb-2">No sessions yet</h3>
      <p className="text-sm text-muted-foreground mb-6">
        Log your first workout — type it however you'd say it.
      </p>
      <Link
        to="/log"
        className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-3 rounded-sm text-xs font-bold uppercase tracking-widest"
      >
        <PlusCircle className="h-4 w-4" /> Log workout
      </Link>
    </div>
  );
}

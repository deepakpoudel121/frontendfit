import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Workouts } from "@/lib/api";
import { AppShell } from "@/components/AppShell";
import { AuthGate } from "@/components/AuthGate";
import { format } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";

export const Route = createFileRoute("/sessions/")({
  component: () => (
    <AuthGate>
      <AppShell>
        <SessionsList />
      </AppShell>
    </AuthGate>
  ),
});

function SessionsList() {
  const [page, setPage] = useState(1);
  const pageSize = 20;
  const { data, isLoading } = useQuery({
    queryKey: ["sessions", { page, page_size: pageSize }],
    queryFn: () => Workouts.list(page, pageSize),
  });

  const total = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <div className="p-6 md:p-12 max-w-6xl">
      <div className="text-xs font-mono uppercase tracking-[0.3em] text-primary mb-2">// archive</div>
      <h1 className="display text-5xl md:text-7xl mb-10">SESSIONS</h1>

      <div className="border border-border rounded-sm bg-card divide-y divide-border min-h-[200px]">
        {isLoading && <div className="p-12 text-center text-sm text-muted-foreground">Loading…</div>}
        {!isLoading && data?.sessions.length === 0 && (
          <div className="p-12 text-center text-sm text-muted-foreground">No sessions logged yet.</div>
        )}
        {data?.sessions.map((s) => (
          <Link
            key={s.id}
            to="/sessions/$id"
            params={{ id: String(s.id) }}
            className="flex items-center justify-between p-5 hover:bg-secondary transition-colors"
          >
            <div className="flex items-center gap-6 min-w-0">
              <div className="display text-3xl text-muted-foreground w-16">#{s.id}</div>
              <div className="min-w-0">
                <div className="text-sm font-semibold">
                  {format(new Date(s.logged_at), "EEEE, MMM d, yyyy")}
                </div>
                <div className="text-xs text-muted-foreground truncate max-w-md mt-1">
                  {s.notes || format(new Date(s.logged_at), "HH:mm")}
                </div>
              </div>
            </div>
            {s.perceived_effort != null && (
              <div className="text-right">
                <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">RPE</div>
                <div className="display text-xl text-primary">{s.perceived_effort}</div>
              </div>
            )}
          </Link>
        ))}
      </div>

      <div className="flex items-center justify-between mt-6 text-xs font-mono">
        <span className="text-muted-foreground">
          {total} total · page {page} / {totalPages}
        </span>
        <div className="flex gap-2">
          <button
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="border border-border rounded-sm p-2 hover:bg-secondary disabled:opacity-30"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="border border-border rounded-sm p-2 hover:bg-secondary disabled:opacity-30"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

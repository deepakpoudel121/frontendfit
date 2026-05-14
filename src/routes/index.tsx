import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { ArrowRight, Activity, Brain, BarChart3 } from "lucide-react";

export const Route = createFileRoute("/")({
  component: Landing,
});

function Landing() {
  const { isAuthed } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (isAuthed) navigate({ to: "/dashboard" });
  }, [isAuthed, navigate]);

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-50 pointer-events-none" />
      <div className="absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full bg-primary/20 blur-[120px] pointer-events-none" />

      {/* Nav */}
      <header className="relative z-10 flex items-center justify-between px-6 md:px-12 py-6">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-sm bg-primary flex items-center justify-center">
            <Activity className="h-4 w-4 text-primary-foreground" strokeWidth={3} />
          </div>
          <span className="display text-2xl">FITBRAIN</span>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/login" className="text-xs font-semibold uppercase tracking-widest text-muted-foreground hover:text-foreground px-4 py-2">
            Sign in
          </Link>
          <Link
            to="/register"
            className="text-xs font-bold uppercase tracking-widest bg-primary text-primary-foreground px-4 py-2 rounded-sm hover:opacity-90"
          >
            Get started
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative z-10 px-6 md:px-12 pt-12 pb-24">
        <div className="max-w-6xl mx-auto">
          <div className="text-xs font-mono uppercase tracking-[0.3em] text-primary mb-6">
            // workout logging, reimagined
          </div>
          <h1 className="display text-[clamp(3.5rem,11vw,10rem)] leading-[0.85] mb-8">
            TALK LIKE<br />
            A LIFTER.<br />
            <span className="text-stroke">TRAIN LIKE</span> <span className="text-primary">A SCIENTIST.</span>
          </h1>
          <p className="max-w-xl text-lg text-muted-foreground mb-10">
            Type "bench 5x5 80kg, then curls 3x12 felt easy" — FitBrain parses it into clean,
            structured sets with an LLM. Track every rep. See every PR.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/register"
              className="group inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-4 rounded-sm text-sm font-bold uppercase tracking-widest hover:opacity-90"
            >
              Start logging
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 border border-border px-6 py-4 rounded-sm text-sm font-bold uppercase tracking-widest hover:bg-secondary"
            >
              I have an account
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="relative z-10 px-6 md:px-12 py-20 border-t border-border">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-px bg-border">
          {[
            { icon: Brain, title: "AI Parser", body: "Slang, typos, abbreviations — handled. The LLM extracts exercises, sets, reps, RPE, and notes from your messy log." },
            { icon: Activity, title: "Every Set Counted", body: "Sets are expanded individually so you never lose a rep. Top sets, backoffs, dropsets, supersets — all preserved." },
            { icon: BarChart3, title: "Progression Charts", body: "Pick any lift and watch the numbers climb session by session. Real progress, not vibes." },
          ].map((f) => (
            <div key={f.title} className="bg-background p-8">
              <f.icon className="h-6 w-6 text-primary mb-6" />
              <h3 className="display text-2xl mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="relative z-10 px-6 md:px-12 py-8 border-t border-border text-xs font-mono text-muted-foreground flex justify-between">
        <span>© FITBRAIN</span>
        <span>v1.0 — built for the iron</span>
      </footer>
    </div>
  );
}

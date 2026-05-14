import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Auth } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";
import { Activity } from "lucide-react";

export const Route = createFileRoute("/login")({ component: LoginPage });

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { setToken } = useAuth();
  const navigate = useNavigate();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await Auth.login({ email, password });
      setToken(res["access token"]);
      toast.success("Welcome back. Time to lift.");
      navigate({ to: "/dashboard" });
    } catch (err: any) {
      toast.error(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return <AuthLayout title="Sign in" subtitle="Pick up where you left off.">
    <form onSubmit={submit} className="space-y-4">
      <Field label="Email" type="email" value={email} onChange={setEmail} required />
      <Field label="Password" type="password" value={password} onChange={setPassword} required />
      <button
        disabled={loading}
        className="w-full bg-primary text-primary-foreground py-4 rounded-sm text-xs font-bold uppercase tracking-widest hover:opacity-90 disabled:opacity-50"
      >
        {loading ? "Signing in…" : "Sign in"}
      </button>
    </form>
    <p className="mt-6 text-sm text-muted-foreground text-center">
      No account?{" "}
      <Link to="/register" className="text-primary hover:underline font-semibold">Create one</Link>
    </p>
  </AuthLayout>;
}

export function AuthLayout({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex bg-background relative overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 h-[500px] w-[500px] rounded-full bg-primary/15 blur-[120px] pointer-events-none" />

      <div className="hidden lg:flex flex-col justify-between p-12 w-1/2 relative z-10 border-r border-border">
        <Link to="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-sm bg-primary flex items-center justify-center">
            <Activity className="h-4 w-4 text-primary-foreground" strokeWidth={3} />
          </div>
          <span className="display text-2xl">FITBRAIN</span>
        </Link>
        <div>
          <div className="text-xs font-mono uppercase tracking-[0.3em] text-primary mb-4">// the log</div>
          <p className="display text-5xl leading-tight">
            "Bench 5x5 80kg.<br />Felt strong.<br /><span className="text-primary">PR on the last set.</span>"
          </p>
          <p className="mt-6 text-sm text-muted-foreground max-w-sm">
            That's all you type. We turn it into clean structured data — sets, reps, RPE, notes.
          </p>
        </div>
        <div className="text-xs font-mono text-muted-foreground">v1.0 / 2026</div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 relative z-10">
        <div className="w-full max-w-sm">
          <h1 className="display text-5xl mb-2">{title}</h1>
          <p className="text-sm text-muted-foreground mb-8">{subtitle}</p>
          {children}
        </div>
      </div>
    </div>
  );
}

export function Field({
  label, type = "text", value, onChange, required, minLength,
}: {
  label: string; type?: string; value: string; onChange: (v: string) => void; required?: boolean; minLength?: number;
}) {
  return (
    <label className="block">
      <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-muted-foreground">{label}</span>
      <input
        type={type}
        required={required}
        minLength={minLength}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full bg-input border border-border rounded-sm px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
      />
    </label>
  );
}

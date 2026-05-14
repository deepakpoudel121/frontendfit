import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Auth } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";
import { AuthLayout, Field } from "./login";

export const Route = createFileRoute("/register")({ component: RegisterPage });

function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { setToken } = useAuth();
  const navigate = useNavigate();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await Auth.register({ name, email, password });
      setToken(res["access token"]);
      toast.success("Account created. Let's lift.");
      navigate({ to: "/dashboard" });
    } catch (err: any) {
      toast.error(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Create account" subtitle="Start logging in 30 seconds.">
      <form onSubmit={submit} className="space-y-4">
        <Field label="Name" value={name} onChange={setName} required minLength={2} />
        <Field label="Email" type="email" value={email} onChange={setEmail} required />
        <Field label="Password" type="password" value={password} onChange={setPassword} required minLength={8} />
        <button
          disabled={loading}
          className="w-full bg-primary text-primary-foreground py-4 rounded-sm text-xs font-bold uppercase tracking-widest hover:opacity-90 disabled:opacity-50"
        >
          {loading ? "Creating…" : "Create account"}
        </button>
      </form>
      <p className="mt-6 text-sm text-muted-foreground text-center">
        Already lifting?{" "}
        <Link to="/login" className="text-primary hover:underline font-semibold">Sign in</Link>
      </p>
    </AuthLayout>
  );
}

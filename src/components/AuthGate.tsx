import { useEffect, type ReactNode } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth";

export function AuthGate({ children }: { children: ReactNode }) {
  const { isAuthed, token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // token state hydrates after mount; only redirect once we know there is none
    if (token === null && !isAuthed) {
      const stored = typeof window !== "undefined"
        ? window.localStorage.getItem("fitbrain.token")
        : null;
      if (!stored) navigate({ to: "/login" });
    }
  }, [isAuthed, token, navigate]);

  if (!isAuthed) {
    return (
      <div className="min-h-screen flex items-center justify-center text-muted-foreground text-sm">
        Loading…
      </div>
    );
  }
  return <>{children}</>;
}

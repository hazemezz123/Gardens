import { useState } from "react";
import type { ReactNode } from "react";
import { useAuth } from "../../hooks/useAuth";

export function AuthGuard({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="animate-pulse text-muted-foreground">Loading...</div>
    </div>
  );
  if (!user || user.profile?.role !== "admin") {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-foreground mb-2">Admin Access Required</h2>
          <p className="text-muted-foreground mb-4">Please log in with an admin account to access this page.</p>
          <LoginFormInline />
        </div>
      </div>
    );
  }
  return <>{children}</>;
}

function LoginFormInline() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signIn(email, password);
    } catch (err: any) {
      setError(err.message || "Failed to sign in");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 max-w-sm mx-auto">
      {error && <p className="text-sm text-red-500 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}
      <input required type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)}
        className="w-full px-4 py-3 rounded-xl border border-border bg-input-background outline-none focus:border-primary/50 text-sm transition-colors" />
      <input required type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)}
        className="w-full px-4 py-3 rounded-xl border border-border bg-input-background outline-none focus:border-primary/50 text-sm transition-colors" />
      <button type="submit" disabled={loading}
        className="w-full bg-primary text-primary-foreground font-semibold py-3 rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50">
        {loading ? "Signing in..." : "Sign In"}
      </button>
    </form>
  );
}

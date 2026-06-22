import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";

export function LoginForm({ onSuccess }: { onSuccess?: () => void }) {
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
      onSuccess?.();
    } catch (err: any) {
      setError(err.message || "Failed to sign in");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-sm mx-auto">
      <h2 className="text-xl font-semibold text-foreground text-center" style={{ fontFamily: "'Playfair Display', serif" }}>Sign In</h2>
      {error && <p className="text-sm text-red-500 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}
      <div>
        <input required type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)}
          className="w-full px-4 py-3 rounded-xl border border-border bg-input-background outline-none focus:border-primary/50 text-sm transition-colors" />
      </div>
      <div>
        <input required type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)}
          className="w-full px-4 py-3 rounded-xl border border-border bg-input-background outline-none focus:border-primary/50 text-sm transition-colors" />
      </div>
      <button type="submit" disabled={loading}
        className="w-full bg-primary text-primary-foreground font-semibold py-3 rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50">
        {loading ? "Signing in..." : "Sign In"}
      </button>
    </form>
  );
}

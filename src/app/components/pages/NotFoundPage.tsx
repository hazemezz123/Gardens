import { Leaf, Home, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router";

export function NotFoundPage() {
  const navigate = useNavigate();
  return (
    <main id="main-content" className="min-h-[calc(100vh-10rem)] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-6">
          <Leaf size={36} className="text-primary" />
        </div>
        <p className="text-sm font-semibold text-accent uppercase tracking-widest mb-2">404 Error</p>
        <h1 className="text-5xl font-semibold text-foreground mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>Page Not Found</h1>
        <p className="text-muted-foreground mb-8 leading-relaxed">
          Sorry, we could not find the page you are looking for. It may have been moved, renamed, or never existed. Let us help you find your way back to the garden.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button onClick={() => navigate("/")} className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-7 py-3.5 rounded-xl font-semibold text-sm hover:bg-primary/90 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
            <Home size={16} /> Back to Home
          </button>
          <button onClick={() => navigate(-1)} className="inline-flex items-center justify-center gap-2 bg-card border border-border px-7 py-3.5 rounded-xl font-medium text-sm hover:bg-muted transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
            <ArrowLeft size={16} /> Go Back
          </button>
        </div>
      </div>
    </main>
  );
}

import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { Activity, Github } from "lucide-react";

export function TopNav() {
  const location = useLocation();
  const navigate = useNavigate();

  const scrollTo = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    if (location.pathname !== "/") {
      navigate({ to: "/", hash: id });
      return;
    }
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const linkCls =
    "px-3.5 py-1.5 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/60 data-[status=active]:text-foreground data-[status=active]:bg-secondary";

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 backdrop-blur-xl bg-background/70">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-2.5 group hover:opacity-90">
          <div className="relative grid place-items-center w-9 h-9 rounded-xl bg-arctic shadow-glow group-hover:-translate-y-0.5 transition-transform">
            <Activity className="w-4.5 h-4.5 text-white" strokeWidth={2.5} />
            <span className="absolute inset-0 rounded-xl ring-1 ring-inset ring-white/30" />
          </div>
          <div className="leading-none">
            <div className="font-display font-semibold text-[15px] tracking-tight">PulseGrid</div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Medical Command</div>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          <Link to="/" className={linkCls} activeOptions={{ exact: true }}>Home</Link>
          <a href="/#pitch" onClick={scrollTo("pitch")} className={linkCls}>Pitch</a>
          <a href="/#how-it-works" onClick={scrollTo("how-it-works")} className={linkCls}>How It Works</a>
          <Link to="/live" className={linkCls} activeOptions={{ exact: true }}>Live Grid</Link>
          <Link to="/architecture" className={linkCls} activeOptions={{ exact: true }}>Architecture</Link>
        </nav>

        <a
          href="https://github.com/beko-1enkosi/pulse-grid"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/60"
        >
          <Github className="w-4 h-4" /> GitHub
        </a>
      </div>
    </header>
  );
}

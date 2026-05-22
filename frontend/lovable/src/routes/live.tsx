import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense, useMemo, useState } from "react";
import { Building2, Lock } from "lucide-react";
import { InflowColumn } from "@/components/InflowColumn";
import { OutflowColumn } from "@/components/OutflowColumn";
import { useLiveGrid } from "@/hooks/useLiveGrid";

const LeafletMap = lazy(() =>
  import("@/components/LeafletMap").then((m) => ({ default: m.LeafletMap }))
);

export const Route = createFileRoute("/live")({
  head: () => ({
    meta: [
      { title: "Live Grid — PulseGrid" },
      { name: "description", content: "Real-time inflow, network routing and hospital priority queues across Johannesburg." },
    ],
  }),
  component: LiveGrid,
});

function LiveGrid() {
  const { patients, hospitals, routes, conn } = useLiveGrid();
  const [showPrivate, setShowPrivate] = useState(false);

  const visibleHospitals = useMemo(
    () => hospitals.filter((h) => (showPrivate ? true : h.kind === "public")),
    [hospitals, showPrivate]
  );
  const visibleIds = useMemo(() => new Set(visibleHospitals.map((h) => h.id)), [visibleHospitals]);
  const visibleRoutes = useMemo(() => routes.filter((r) => visibleIds.has(r.hospitalId)), [routes, visibleIds]);

  return (
    <main className="flex-1 px-4 md:px-6 py-6">
      <div className="mx-auto max-w-[1600px]">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">Operations · Johannesburg</div>
            <h1 className="font-display text-2xl md:text-3xl font-semibold tracking-tight">Live Grid</h1>
          </div>
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-border bg-card text-[11px] font-medium uppercase tracking-wider">
            <span className={`w-1.5 h-1.5 rounded-full ${conn === "live" ? "bg-emerald-500" : conn === "mock" ? "bg-[color:var(--warn)]" : "bg-muted-foreground"}`} />
            {conn === "live" ? "WebSocket Live" : conn === "mock" ? "Mock Feed" : "Connecting…"}
          </span>
        </div>

        <div className="flex flex-col gap-4">
          {/* TOP — Panoramic JHB dispatch map */}
          <section className="relative h-[62vh] min-h-[480px] rounded-2xl border border-border bg-card shadow-card overflow-hidden">
            <div className="absolute top-3 left-4 z-[400] flex items-center gap-2">
              <div className="px-2.5 py-1 rounded-md bg-white/90 backdrop-blur text-[10px] uppercase tracking-[0.22em] text-muted-foreground border border-border">
                Dispatch · Johannesburg
              </div>
              <div className="px-2.5 py-1 rounded-md bg-white/90 backdrop-blur text-[10px] font-medium text-foreground border border-border">
                {visibleRoutes.length} active routes · {visibleHospitals.length} units
              </div>
            </div>

            {/* Public / Private pill toggle */}
            <div className="absolute top-3 right-4 z-[400]">
              <div className="inline-flex items-center p-1 rounded-full bg-white/95 backdrop-blur border border-border shadow-card">
                <button
                  type="button"
                  aria-pressed={!showPrivate}
                  onClick={() => setShowPrivate(false)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-semibold uppercase tracking-wider transition-colors ${
                    !showPrivate
                      ? "bg-arctic text-white shadow-glow"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Building2 className="w-3.5 h-3.5" /> Public Units
                </button>
                <button
                  type="button"
                  aria-pressed={showPrivate}
                  onClick={() => setShowPrivate(true)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-semibold uppercase tracking-wider transition-colors ${
                    showPrivate
                      ? "bg-[#7C3AED] text-white shadow-glow"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Lock className="w-3.5 h-3.5" /> Private Units
                </button>
              </div>
            </div>

            <Suspense fallback={<div className="absolute inset-0 grid place-items-center text-sm text-muted-foreground">Loading map…</div>}>
              <LeafletMap hospitals={visibleHospitals} routes={visibleRoutes} />
            </Suspense>
          </section>

          {/* BOTTOM — 50/50 Inflow + Outflow */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-[420px]">
            <InflowColumn patients={patients} />
            <OutflowColumn hospitals={visibleHospitals} />
          </section>
        </div>
      </div>
    </main>
  );
}

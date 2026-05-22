import { AnimatePresence, motion } from "framer-motion";
import { Patient } from "@/lib/mockData";
import { UserRound } from "lucide-react";

function triageStyles(level: number) {
  if (level >= 4) return { dot: "bg-[color:var(--urgent)]", chip: "bg-[color:var(--urgent)]/10 text-[color:var(--urgent)] border-[color:var(--urgent)]/30", label: "Urgent" };
  if (level === 3) return { dot: "bg-[color:var(--warn)]", chip: "bg-[color:var(--warn)]/10 text-[color:var(--warn)] border-[color:var(--warn)]/30", label: "Watch" };
  return { dot: "bg-[color:var(--tech-blue-deep)]", chip: "bg-[color:var(--ice)] text-[color:var(--tech-blue-deep)] border-[color:var(--tech-blue)]/30", label: "Standard" };
}

export function InflowColumn({ patients }: { patients: Patient[] }) {
  return (
    <div className="flex flex-col h-full rounded-2xl border border-border bg-card shadow-card overflow-hidden">
      <header className="flex items-center justify-between px-4 py-3 border-b border-border">
        <div>
          <h3 className="font-display font-semibold text-sm">Inflow · Incoming Patients</h3>
        </div>
        <span className="text-xs tabular-nums text-muted-foreground">{patients.length}</span>
      </header>
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        <AnimatePresence initial={false}>
          {patients.map((p) => {
            const t = triageStyles(p.triage);
            return (
              <motion.article
                key={p.id}
                layout
                initial={{ opacity: 0, y: -24, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ type: "spring", stiffness: 320, damping: 30 }}
                className="rounded-xl border border-[color:var(--ice)] bg-white p-3 hover:border-[color:var(--tech-blue)]/40 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className="grid place-items-center w-9 h-9 rounded-lg bg-[color:var(--ice)] shrink-0">
                    <UserRound className="w-4 h-4 text-[color:var(--tech-blue-deep)]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-medium text-sm truncate">{p.name}</span>
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md border text-[10px] font-semibold uppercase tracking-wider ${t.chip}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${t.dot}`} />
                        L{p.triage} · {t.label}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5 truncate">{p.symptom}</p>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}

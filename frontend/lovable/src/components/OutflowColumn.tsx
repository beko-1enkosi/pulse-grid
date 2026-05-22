import { motion, AnimatePresence } from "framer-motion";
import { Hospital } from "@/lib/mockData";

function HospitalBlock({ h }: { h: Hospital }) {
  const used = h.queue.length;
  const pct = Math.min(100, Math.round((used / h.capacity) * 100));
  const atCap = pct >= 100;

  return (
    <div className="rounded-xl border border-border bg-white overflow-hidden">
      <div className="px-3 pt-3 pb-2">
        <div className="flex items-center justify-between">
          <h4 className="font-display font-semibold text-[13px]">{h.name}</h4>
          <span className={`text-[10px] font-semibold uppercase tracking-wider ${atCap ? "text-[color:var(--urgent)]" : "text-muted-foreground"}`}>
            {used}/{h.capacity}
          </span>
        </div>
        <div className="mt-2 h-1.5 rounded-full bg-secondary overflow-hidden">
          <motion.div
            className={`h-full rounded-full ${atCap ? "bg-[color:var(--urgent)]" : "bg-arctic"}`}
            initial={false}
            animate={{ width: `${pct}%` }}
            transition={{ type: "spring", stiffness: 120, damping: 20 }}
          />
        </div>
      </div>
      <ul className="px-2 pb-2 space-y-1 max-h-[260px] overflow-y-auto">
        <AnimatePresence initial={false}>
          {h.queue.map((p) => (
            <motion.li
              key={p.id}
              layout
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 380, damping: 32 }}
              className="flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-md hover:bg-[color:var(--ice)]/50 transition-colors"
            >
              <span className="text-xs truncate">{p.name}</span>
              <span className="text-[11px] font-semibold tabular-nums text-[color:var(--tech-blue-deep)]">
                {p.score}
              </span>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </div>
  );
}

export function OutflowColumn({ hospitals }: { hospitals: Hospital[] }) {
  return (
    <div className="flex flex-col h-full rounded-2xl border border-border bg-card shadow-card overflow-hidden">
      <header className="flex items-center justify-between px-4 py-3 border-b border-border">
        <div>
          <h3 className="font-display font-semibold text-sm">Outflow · Priority Queues</h3>
        </div>
      </header>
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {hospitals.map((h) => (
          <HospitalBlock key={h.id} h={h} />
        ))}
      </div>
    </div>
  );
}

import { motion } from "framer-motion";
import { useCountUp } from "@/hooks/useCountUp";

interface Props {
  label: string;
  value: number;
  suffix?: string;
  accent?: string;
  delay?: number;
}

export function MetricCounter({ label, value, suffix, accent, delay = 0 }: Props) {
  const v = useCountUp(value, 1500);
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="relative overflow-hidden rounded-2xl border border-border bg-card/80 backdrop-blur p-4 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="absolute -top-px left-6 right-6 h-px bg-arctic opacity-70" />
      <div className="flex items-baseline justify-between">
        <span className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground font-medium">
          {label}
        </span>
        {accent && (
          <span className="text-[10px] uppercase tracking-wider text-[color:var(--tech-blue-deep)] font-semibold">
            {accent}
          </span>
        )}
      </div>
      <div className="mt-2 flex items-end gap-1.5">
        <span className="font-display text-3xl md:text-4xl font-semibold tracking-tight tabular-nums text-foreground">
          {v.toLocaleString()}
        </span>
        {suffix && <span className="text-lg text-muted-foreground pb-2">{suffix}</span>}
      </div>
    </motion.div>
  );
}

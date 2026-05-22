import { motion } from "framer-motion";
import { Ambulance, Building2, BedDouble } from "lucide-react";

// Smooth ECG-style path with three notable points where we drop icons
const PATH = "M0,140 L120,140 L150,140 L170,90 L195,180 L220,60 L250,140 L420,140 L450,140 L480,200 L520,40 L560,180 L590,140 L760,140 L790,140 L820,110 L850,170 L880,140 L1100,140 L1200,140";

const ICONS = [
  { x: 220, y: 60, Icon: Ambulance, label: "Dispatch" },
  { x: 520, y: 40, Icon: Building2, label: "Trauma Center" },
  { x: 480, y: 200, Icon: BedDouble, label: "Ward Intake" },
];

export function HeartbeatWave() {
  return (
    <div className="relative w-full h-[280px] md:h-[340px]">
      <div className="absolute inset-0 grid-bg grid-bg-fade opacity-70" />
      {/* gradient backdrop */}
      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-40 bg-gradient-to-r from-transparent via-[color:var(--ice)] to-transparent opacity-60" />

      <svg viewBox="0 0 1200 280" className="relative w-full h-full" preserveAspectRatio="none">
        <defs>
          <linearGradient id="pulse" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="oklch(0.97 0.025 240)" />
            <stop offset="50%" stopColor="oklch(0.55 0.22 257)" />
            <stop offset="100%" stopColor="oklch(0.42 0.22 260)" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* faint baseline */}
        <line x1="0" y1="140" x2="1200" y2="140" stroke="var(--grid-line)" strokeDasharray="4 6" />

        {/* base path */}
        <motion.path
          d={PATH}
          fill="none"
          stroke="oklch(0.85 0.05 245)"
          strokeWidth="1.5"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 4.5, ease: "easeInOut" }}
        />

        {/* glowing pulse traveling along */}
        <motion.path
          d={PATH}
          fill="none"
          stroke="url(#pulse)"
          strokeWidth="2.5"
          strokeLinecap="round"
          filter="url(#glow)"
          initial={{ pathLength: 0, pathOffset: 0 }}
          animate={{ pathLength: [0.05, 0.22, 0.05], pathOffset: [0, 1, 1] }}
          transition={{ duration: 10, ease: "linear", repeat: Infinity }}
        />
      </svg>

      {/* Icons positioned on key peaks (responsive via percentage) */}
      <div className="absolute inset-0 pointer-events-none">
        {ICONS.map(({ x, y, Icon, label }, i) => (
          <motion.div
            key={label}
            className="absolute"
            style={{ left: `${(x / 1200) * 100}%`, top: `${(y / 280) * 100}%` }}
            initial={{ opacity: 0, scale: 0.5, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.8 + i * 0.3, type: "spring", stiffness: 200, damping: 18 }}
          >
            <div className="-translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-1.5">
              <div className="relative grid place-items-center w-11 h-11 rounded-xl bg-white border border-border shadow-card">
                <Icon className="w-5 h-5 text-[color:var(--tech-blue-deep)]" strokeWidth={2} />
                <motion.span
                  className="absolute inset-0 rounded-xl ring-2 ring-[color:var(--tech-blue)]/40"
                  animate={{ scale: [1, 1.25, 1], opacity: [0.6, 0, 0.6] }}
                  transition={{ duration: 2.2, repeat: Infinity, delay: i * 0.6 }}
                />
              </div>
              <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground font-medium">
                {label}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

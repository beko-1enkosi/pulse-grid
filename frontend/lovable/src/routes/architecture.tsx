import { createFileRoute, Link } from "@tanstack/react-router";
import { Fragment } from "react";
import { motion } from "framer-motion";
import { Reveal } from "@/components/Reveal";
import { Radio, Cpu, MonitorPlay, ArrowRight, ArrowRightCircle, Layers, TrendingUp } from "lucide-react";

export const Route = createFileRoute("/architecture")({
  head: () => ({
    meta: [
      { title: "Architecture, PulseGrid" },
      { name: "description", content: "How PulseGrid's real time stack is wired together." },
    ],
  }),
  component: Architecture,
});

const NODES = [
  {
    icon: Radio,
    tag: "Edge",
    title: "Ambulance Telemetry",
    desc: "GPS, vitals and triage signals stream over MQTT from every vehicle in the field.",
  },
  {
    icon: Cpu,
    tag: "Core Backend",
    title: "FastAPI + AI Triage Engine",
    desc: "Predictive routing recalculates the network on every event with sub 100 ms latency.",
  },
  {
    icon: MonitorPlay,
    tag: "Client",
    title: "React Command Center",
    desc: "Operators see queues, capacity and routing decisions update live over WebSockets.",
  },
];

const STACK = [
  "Python",
  "FastAPI",
  "React",
  "Tailwind",
  "Framer Motion",
  "Leaflet",
  "WebSockets",
];

function PipelineConnector() {
  return (
    <div className="relative hidden md:block w-full h-px self-center">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "repeating-linear-gradient(to right, color-mix(in oklab, var(--tech-blue) 55%, transparent) 0 8px, transparent 8px 16px)",
        }}
      />
      <motion.div
        className="absolute -top-[5px] w-2.5 h-2.5 rounded-full"
        style={{
          background: "var(--tech-blue)",
          boxShadow:
            "0 0 12px color-mix(in oklab, var(--tech-blue) 80%, transparent), 0 0 24px color-mix(in oklab, var(--tech-blue) 60%, transparent)",
        }}
        initial={{ left: "0%" }}
        animate={{ left: ["0%", "100%"] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );
}

function Architecture() {
  return (
    <main className="flex-1">
      {/* SECTION A — Pipeline */}
      <section className="mx-auto max-w-6xl px-6 pt-16 pb-10">
        <Reveal>
          <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">System</div>
          <h1 className="mt-2 font-display text-4xl md:text-5xl font-semibold tracking-tight">
            The Real-Time Data Pipeline
          </h1>
          <p className="mt-4 text-muted-foreground max-w-2xl">
            An event-driven path from the road to the operator, in under one heartbeat.
          </p>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 md:grid-cols-[1fr_60px_1fr_60px_1fr] gap-6 md:gap-0 items-stretch">
          {NODES.map(({ icon: Icon, tag, title, desc }, i) => (
            <Fragment key={title}>
              <Reveal delay={i * 0.1}>
                <div className="glass-card rounded-2xl p-6 h-full hover:-translate-y-1 transition-transform">
                  <div className="flex items-center gap-3">
                    <div className="grid place-items-center w-10 h-10 rounded-xl bg-arctic-soft border border-border">
                      <Icon className="w-4.5 h-4.5 text-[color:var(--tech-blue-deep)]" />
                    </div>
                    <span className="text-[10px] uppercase tracking-[0.2em] text-[color:var(--tech-blue-deep)]">
                      {tag}
                    </span>
                  </div>
                  <h3 className="mt-4 font-display font-semibold text-lg">{title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{desc}</p>
                </div>
              </Reveal>
              {i < NODES.length - 1 && <PipelineConnector />}
            </Fragment>
          ))}
        </div>
      </section>

      {/* SECTION B — Routing Algorithm spotlight (centered, deep navy) */}
      <section className="relative w-full bg-deep-navy overflow-hidden" style={{ color: "#FFFFFF" }}>
        <div className="absolute inset-0 grid-bg-navy opacity-90" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_30%,rgba(0,80,216,0.45),transparent_60%),radial-gradient(ellipse_at_50%_90%,rgba(120,170,255,0.18),transparent_55%)]" />

        <div className="relative mx-auto max-w-4xl px-6 py-12 md:py-16 text-center">
          <Reveal>
            <div className="text-[11px] uppercase tracking-[0.28em]" style={{ color: "#FFFFFF" }}>
              Item Spotlight
            </div>
            <h2
              className="mt-4 font-display text-4xl md:text-5xl xl:text-6xl font-semibold tracking-tight leading-[1.05]"
              style={{ color: "#FFFFFF" }}
            >
              The Routing Algorithm
            </h2>
          </Reveal>

          <Reveal delay={0.1}>
            <div
              className="mt-10 mx-auto max-w-3xl rounded-xl border border-white/20 bg-white/[0.03] px-6 py-8 font-mono text-xl md:text-3xl tracking-tight"
              style={{ color: "#FFFFFF" }}
            >
              PTT = T_travel + T_queue + R_deterioration
            </div>
          </Reveal>

          <Reveal delay={0.2}>
            <dl className="mt-12 mx-auto max-w-3xl text-left space-y-5">
              {[
                { title: "T_travel", body: "Grid distance calculated via Manhattan heuristics." },
                { title: "T_queue", body: "Dynamic capacity tracking via APQ-h arrays." },
                { title: "R_deterioration", body: "Exponential time-decay penalty for critical triage levels." },
              ].map((f) => (
                <div key={f.title} className="grid grid-cols-[180px_1fr] md:grid-cols-[220px_1fr] gap-6 items-baseline">
                  <dt className="font-mono font-semibold text-base md:text-lg" style={{ color: "#FFFFFF", opacity: 1 }}>
                    {f.title}
                  </dt>
                  <dd className="text-sm md:text-base leading-relaxed" style={{ color: "#FFFFFF", opacity: 1 }}>
                    {f.body}
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </section>


      {/* SECTION C — Stack Badges */}
      <section className="bg-arctic-soft">
        <div className="mx-auto max-w-5xl px-6 py-24 md:py-32">
          <Reveal>
            <div className="text-xs uppercase tracking-[0.28em] text-muted-foreground text-center">
              Built With
            </div>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              {STACK.map((s) => (
                <span
                  key={s}
                  className="px-7 py-3.5 rounded-full text-lg md:text-xl font-semibold bg-white border border-border text-[color:var(--deep-navy)] shadow-card hover:-translate-y-1 hover:shadow-lg hover:border-[color:var(--tech-blue)]/50 transition-all"
                >
                  {s}
                </span>
              ))}
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}

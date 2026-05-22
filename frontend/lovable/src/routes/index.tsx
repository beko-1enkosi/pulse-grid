import { createFileRoute, Link } from "@tanstack/react-router";
import { HeartbeatWave } from "@/components/HeartbeatWave";
import { MetricCounter } from "@/components/MetricCounter";
import { AuraAssistant } from "@/components/AuraAssistant";
import { Reveal } from "@/components/Reveal";
import { motion } from "framer-motion";
import { ArrowRight, Brain, Compass, ListOrdered, ShieldCheck, Cpu, Network, HeartPulse } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "PulseGrid, Real Time Medical Network" },
      { name: "description", content: "Cinematic emergency coordination dashboard for ambulances, triage and hospital capacity." },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <main className="relative flex-1">
      {/* SECTION A, HERO 50/50 */}
      <section className="mx-auto max-w-7xl px-6 pt-16 md:pt-24 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9 }}
          >
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-card/80 backdrop-blur text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
              <span className="w-1.5 h-1.5 rounded-full bg-[color:var(--tech-blue-deep)]" />
              Network Online, Johannesburg
            </span>
            <h1 className="mt-6 font-display text-5xl md:text-6xl xl:text-7xl font-semibold tracking-tight leading-[1.02]">
              The pulse of every <span className="text-arctic">emergency</span>,<br />
              coordinated in real time.
            </h1>
            <p className="mt-5 text-base md:text-lg text-muted-foreground max-w-lg">
              PulseGrid is a command surface for ambulance dispatch, triage flow and hospital capacity, built for the seconds that matter.
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Link
                to="/live"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-arctic text-white text-sm font-semibold shadow-glow hover:-translate-y-0.5 hover:shadow-lg hover:opacity-95"
              >
                Open Live Grid <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/architecture"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-border bg-card/80 backdrop-blur text-sm font-semibold text-foreground hover:-translate-y-0.5 hover:shadow-lg hover:bg-card"
              >
                See the Architecture
              </Link>
            </div>

            <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <MetricCounter label="Total Beds" value={1284} accent="Network wide" delay={0.1} />
              <MetricCounter label="Active Ambulances" value={47} accent="Dispatched" delay={0.2} />
              <MetricCounter label="Network Load" value={73} suffix="%" accent="Real time" delay={0.3} />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.1, delay: 0.15 }}
            className="relative"
          >
            <div className="relative rounded-3xl glass-card p-4 md:p-6 overflow-hidden hover:-translate-y-1 hover:shadow-lg">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Live ECG · Network Pulse
                </div>
                <span className="text-[10px] uppercase tracking-wider text-[color:var(--tech-blue-deep)] font-semibold">72 BPM</span>
              </div>
              <HeartbeatWave />
            </div>
          </motion.div>
        </div>
      </section>

      {/* SECTION PITCH */}
      <section id="pitch" className="mx-auto max-w-5xl px-6 py-20 scroll-mt-24">
        <Reveal>
          <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.28em] text-[color:var(--tech-blue-deep)]">
            <HeartPulse className="w-3.5 h-3.5" />
            The Pitch
          </div>
          <h2 className="mt-3 font-display text-4xl md:text-5xl font-semibold tracking-tight leading-[1.08]">
            In emergency medicine, time is tissue.
          </h2>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="mt-8 glass-card rounded-2xl p-8 md:p-10 hover:-translate-y-1 hover:shadow-lg">
            <p className="text-lg md:text-xl text-foreground/85 leading-relaxed">
              In emergency medicine, time is tissue. Every second an ambulance spends idling or a patient spends waiting reduces their chance of survival. PulseGrid eliminates the guesswork in metropolitan emergency response. We process patient vitals, predict hospital congestion, and dynamically route ambulances to the exact bed that is opening up. It is not just dispatching. It is real time life saving choreography.
            </p>
          </div>
        </Reveal>
      </section>

      {/* SECTION B, HOW IT WORKS */}
      <section id="how-it-works" className="mx-auto max-w-7xl px-6 py-20 scroll-mt-24">
        <Reveal>
          <div className="max-w-2xl">
            <div className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">How it works</div>
            <h2 className="mt-2 font-display text-4xl md:text-5xl font-semibold tracking-tight">
              Three steps to the right bed.
            </h2>
            <p className="mt-3 text-muted-foreground max-w-xl">
              From the first 112 call to the moment the patient is wheeled into the right ward, PulseGrid choreographs the network.
            </p>
          </div>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            {
              n: "01",
              Icon: Brain,
              title: "AI Triage",
              body: "Incoming patient vitals and symptoms are scored by a triage model in under 400 ms, assigning Levels 1 to 5 with a full audit trail.",
            },
            {
              n: "02",
              Icon: Compass,
              title: "Predictive Routing",
              body: "Routes weigh live capacity, ETA and specialty match. The grid keeps ambulances moving toward the bed that is actually opening.",
            },
            {
              n: "03",
              Icon: ListOrdered,
              title: "Dynamic Queues",
              body: "Hospital APQ h queues physically reorder as priority scores shift, so the right patient is always next, not just first in line.",
            },
          ].map((s, i) => (
            <Reveal key={s.n} delay={i * 0.08}>
              <div className="glass-card rounded-2xl p-6 relative overflow-hidden hover:-translate-y-1 hover:shadow-lg h-full">
                <div className="absolute -top-px left-6 right-6 h-px bg-arctic opacity-70" />
                <div className="flex items-center justify-between">
                  <div className="grid place-items-center w-11 h-11 rounded-xl bg-arctic-soft border border-[color:var(--tech-blue)]/20">
                    <s.Icon className="w-5 h-5 text-[color:var(--tech-blue-deep)]" />
                  </div>
                  <span className="font-display text-3xl font-semibold text-[color:var(--tech-blue)]/30 tabular-nums">{s.n}</span>
                </div>
                <h3 className="mt-5 font-display text-xl font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{s.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* SECTION C, DEEP NAVY FEATURE */}
      <section className="relative w-full bg-deep-navy text-white overflow-hidden">
        <div className="absolute inset-0 grid-bg-navy opacity-90" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_30%,rgba(0,80,216,0.45),transparent_60%),radial-gradient(ellipse_at_80%_80%,rgba(120,170,255,0.18),transparent_55%)]" />

        <div className="relative mx-auto max-w-7xl px-6 py-24 md:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <Reveal className="lg:col-span-7">
              <div className="text-[11px] uppercase tracking-[0.28em] text-[#7FB3FF]">Premium Accountability</div>
              <h2 className="mt-3 font-display text-4xl md:text-5xl xl:text-6xl font-semibold tracking-tight leading-[1.05]">
                An event sourced spine for<br />
                <span className="text-[#7FB3FF]">every clinical decision.</span>
              </h2>
              <p className="mt-5 text-white/70 max-w-xl text-base md:text-lg leading-relaxed">
                Every dispatch, every reroute, every priority change is written once and replayable. PulseGrid runs on an MQTT and WebSocket spine with a deterministic triage engine, so what your team sees is what actually happened.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link
                  to="/architecture"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-white text-[color:var(--deep-navy)] text-sm font-semibold hover:-translate-y-0.5 hover:shadow-lg hover:bg-white/90"
                >
                  Explore the architecture <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/live"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-white/20 text-white/90 text-sm font-semibold hover:-translate-y-0.5 hover:bg-white/5"
                >
                  See it live
                </Link>
              </div>
            </Reveal>

            <div className="lg:col-span-5 grid grid-cols-1 gap-3">
              {[
                { Icon: ShieldCheck, title: "Immutable audit trail", body: "Every event is hashed and append only." },
                { Icon: Cpu, title: "Sub second triage", body: "Deterministic scoring with explainable outputs." },
                { Icon: Network, title: "Resilient mesh", body: "Auto failover to mock feed if a node drops." },
              ].map((f, i) => (
                <Reveal key={f.title} delay={i * 0.08}>
                  <div className="flex items-start gap-4 rounded-xl border border-white/10 bg-white/[0.03] backdrop-blur p-4 hover:-translate-y-0.5 hover:bg-white/[0.06] hover:border-white/20">
                    <div className="grid place-items-center w-10 h-10 rounded-lg bg-[#0050D8]/30 border border-[#7FB3FF]/30">
                      <f.Icon className="w-4.5 h-4.5 text-[#A8CDFF]" />
                    </div>
                    <div>
                      <div className="font-display font-semibold text-[15px]">{f.title}</div>
                      <div className="text-sm text-white/60 mt-0.5">{f.body}</div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      <AuraAssistant />
    </main>
  );
}

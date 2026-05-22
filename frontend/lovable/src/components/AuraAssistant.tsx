import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Send, Sparkles, Volume2, VolumeX, X } from "lucide-react";

export function AuraAssistant() {
  const [open, setOpen] = useState(false);
  const [muted, setMuted] = useState(false);
  const [text, setText] = useState("");
  const [messages, setMessages] = useState<{ role: "user" | "bot"; text: string }[]>([
    { role: "bot", text: "Ask Aura… I'm monitoring 3 hospitals across Johannesburg." },
  ]);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, open]);

  const speak = (msg: string) => {
    if (muted || typeof window === "undefined" || !("speechSynthesis" in window)) return;
    const u = new SpeechSynthesisUtterance(msg);
    u.rate = 1.05;
    window.speechSynthesis.speak(u);
  };

  const send = () => {
    if (!text.trim()) return;
    const userMsg = text.trim();
    setMessages((m) => [...m, { role: "user", text: userMsg }]);
    setText("");
    setTimeout(() => {
      const reply = `Acknowledged: "${userMsg}". Rerouting to nearest available unit.`;
      setMessages((m) => [...m, { role: "bot", text: reply }]);
      speak(reply);
    }, 550);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      <AnimatePresence>
        {open && (
          <motion.div
            key="panel"
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 320, damping: 28 }}
            className="w-[320px] rounded-2xl border border-border bg-card/95 backdrop-blur-xl shadow-card overflow-hidden"
          >
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-border bg-secondary/50">
              <div className="flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-[color:var(--tech-blue-deep)]" />
                <span className="text-[11px] uppercase tracking-wider font-semibold">Ask Aura</span>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => setMuted((m) => !m)} className="p-1 rounded-md hover:bg-secondary" aria-label="Toggle voice">
                  {muted ? <VolumeX className="w-4 h-4 text-muted-foreground" /> : <Volume2 className="w-4 h-4 text-[color:var(--tech-blue-deep)]" />}
                </button>
                <button onClick={() => setOpen(false)} className="p-1 rounded-md hover:bg-secondary" aria-label="Close">
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>
            </div>
            <div className="h-56 overflow-y-auto p-3 space-y-2">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`max-w-[85%] rounded-lg px-3 py-1.5 text-[13px] leading-snug ${
                    m.role === "user" ? "ml-auto bg-arctic text-white" : "bg-secondary text-foreground"
                  }`}
                >
                  {m.text}
                </div>
              ))}
              <div ref={endRef} />
            </div>
            <div className="flex items-center gap-2 border-t border-border p-2">
              <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send()}
                placeholder="Ask Aura…"
                className="flex-1 bg-transparent text-sm px-2 py-1.5 outline-none placeholder:text-muted-foreground/70"
              />
              <button onClick={send} className="p-1.5 rounded-md bg-arctic text-white hover:opacity-90">
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => setOpen((o) => !o)}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        animate={{ y: [0, -4, 0] }}
        transition={{ y: { duration: 3, repeat: Infinity, ease: "easeInOut" } }}
        className="relative grid place-items-center w-14 h-14 rounded-full bg-arctic shadow-glow text-white"
        aria-label="Open Aura assistant"
      >
        <span className="absolute inset-0 rounded-full ring-1 ring-inset ring-white/30" />
        <span className="absolute -inset-1 rounded-full bg-[color:var(--tech-blue)]/30 blur-md -z-10" />
        <Sparkles className="w-5 h-5" />
      </motion.button>
    </div>
  );
}

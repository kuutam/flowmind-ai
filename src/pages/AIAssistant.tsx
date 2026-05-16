import { useEffect, useRef, useState, KeyboardEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  Sparkles,
  Brain,
  Zap,
  Target,
  Calendar,
  Wand2,
  Copy,
  ThumbsUp,
  ThumbsDown,
  Check,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import PageHeader from "@/components/shared/PageHeader";
import GlassCard from "@/components/shared/GlassCard";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Msg {
  id: string;
  role: "user" | "assistant";
  content: string;
  feedback?: "up" | "down";
}

const STARTERS = [
  { label: "Plan my week", prompt: "Plan my week", icon: Calendar },
  { label: "Prioritize my tasks", prompt: "Prioritize my tasks", icon: Target },
  { label: "Generate focus schedule", prompt: "Generate a focus schedule for today", icon: Zap },
  { label: "Optimize my productivity", prompt: "Optimize my productivity", icon: Wand2 },
];

// --- Simulated FlowMind brain ---------------------------------------------
const RESPONSES: { match: RegExp; reply: string }[] = [
  {
    match: /(plan).*(week|7 days)|weekly plan/i,
    reply: `### Your optimized week, Maddie

**Monday — Momentum**
- 09:00 · Deep work block (90 min) — top priority project
- 11:00 · Inbox & async catch-up
- 14:00 · Strategy / planning session

**Tuesday — Build**
- Two 90-min deep work blocks
- Light meetings only after 15:00

**Wednesday — Collaborate**
- Cluster all meetings here to protect Mon/Tue/Thu

**Thursday — Deep work day**
- No meetings before 14:00. Ship something meaningful.

**Friday — Reflect & reset**
- Weekly review (30 min)
- Plan next week's 3 MITs (Most Important Tasks)
- Finish by 16:00 — protect your weekend

> Tiny nudge: pick **one** MIT per day. That's the win.`,
  },
  {
    match: /(prioriti[sz]e|eisenhower|important|urgent)/i,
    reply: `### Let's prioritize using the **Eisenhower Matrix**

|              | **Urgent**           | **Not Urgent**         |
|--------------|----------------------|------------------------|
| **Important**    | Do now               | Schedule deep work     |
| **Not Important**| Delegate / shorten   | Delete or batch later  |

**Your move today:**
1. Pick your **3 MITs** — important, not urgent items that move the needle.
2. Box urgent-but-not-important work into a single 30-min batch.
3. Ruthlessly delete anything in the bottom-right.

> Productivity isn't doing more — it's doing what matters first.`,
  },
  {
    match: /(focus|schedule|today|deep work)/i,
    reply: `### Today's focus schedule

- **09:00 – 10:30** · 🧠 Deep Work #1 — hardest task first
- **10:30 – 10:45** · Walk / hydrate
- **10:45 – 12:00** · 🧠 Deep Work #2
- **12:00 – 13:00** · Lunch away from screen
- **13:00 – 14:00** · Shallow work & messages
- **14:00 – 15:30** · 🎯 Creative block
- **15:30 – 16:00** · Daily review + tomorrow's MITs

**Rules of the day**
- Phone in another room during deep work
- One tab. One task. One timer.
- Celebrate small wins out loud.`,
  },
  {
    match: /(optimi[sz]e|productivity|habit|boost)/i,
    reply: `### 5 high-leverage productivity upgrades

1. **One MIT per day** — pick the single task that would make today a win.
2. **Time-box everything** — work expands to fill the space; shrink the space.
3. **Theme your days** — Build / Collaborate / Plan. Context-switching is the silent killer.
4. **Energy > time** — schedule hard work for your peak hours.
5. **Friday reset ritual** — 20 minutes to review, archive, and pre-decide next week.

> You don't need more hours, Maddie — you need fewer, better decisions.`,
  },
  {
    match: /(morning|ritual|routine)/i,
    reply: `### A focus ritual for peak output

- ☀️ **Light** within 10 min of waking
- 💧 **Water** before caffeine
- 📓 **3-line journal**: feeling · intention · one MIT
- 🎧 **Same focus playlist** — anchor your brain
- ⏱️ **First 90 minutes** = deep work, no inputs

Repeat for 14 days. Watch your output compound.`,
  },
];

const FALLBACK = `Got it, Maddie. Here's how I'd approach that:

1. **Clarify the outcome** — what does "done" look like?
2. **Break it down** — list the next 3 concrete actions.
3. **Time-box the first one** for the next 25 minutes.
4. **Review** what worked, then iterate.

> Small, focused reps beat big, scattered effort. Want me to turn this into a schedule?`;

function generateReply(prompt: string): string {
  for (const r of RESPONSES) if (r.match.test(prompt)) return r.reply;
  return FALLBACK;
}
// --------------------------------------------------------------------------

export default function AIAssistant() {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const taRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, streaming]);

  useEffect(() => {
    const ta = taRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = Math.min(ta.scrollHeight, 200) + "px";
  }, [input]);

  const send = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || streaming) return;

    const userMsg: Msg = { id: crypto.randomUUID(), role: "user", content: trimmed };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setStreaming(true);

    // Simulated thinking delay
    await new Promise((r) => setTimeout(r, 550 + Math.random() * 450));

    const full = generateReply(trimmed);
    const assistantId = crypto.randomUUID();
    setMessages((prev) => [...prev, { id: assistantId, role: "assistant", content: "" }]);

    // Stream the reply chunk-by-chunk for a realistic typing feel
    const tokens = full.match(/\s+|\S+/g) ?? [full];
    let acc = "";
    for (const t of tokens) {
      acc += t;
      setMessages((prev) =>
        prev.map((m) => (m.id === assistantId ? { ...m, content: acc } : m)),
      );
      await new Promise((r) => setTimeout(r, 14 + Math.random() * 26));
    }

    setStreaming(false);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send(input);
    }
  };

  const copyMsg = async (m: Msg) => {
    await navigator.clipboard.writeText(m.content);
    setCopiedId(m.id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const setFeedback = (id: string, fb: "up" | "down") => {
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, feedback: m.feedback === fb ? undefined : fb } : m)),
    );
  };

  const empty = messages.length === 0;

  return (
    <div className="flex flex-col h-[calc(100vh-9rem)] md:h-[calc(100vh-12rem)]">
      <PageHeader title="AI Assistant" subtitle="Your futuristic productivity copilot" />

      <GlassCard hover={false} className="flex-1 flex flex-col !p-0 overflow-hidden">
        {/* Messages area */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto">
          <div className="max-w-3xl mx-auto w-full px-4 md:px-8 py-6 space-y-5">
            {empty && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center pt-8 pb-4"
              >
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-primary shadow-glow-purple mb-4">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">
                  Hey Maddie 👋
                </h2>
                <p className="text-muted-foreground mt-2 text-sm md:text-base">
                  I'm FlowMind. What should we optimize today?
                </p>
              </motion.div>
            )}

            <AnimatePresence initial={false}>
              {messages.map((m) => (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  className={cn("flex gap-3", m.role === "user" ? "justify-end" : "justify-start")}
                >
                  {m.role === "assistant" && (
                    <div className="w-9 h-9 rounded-2xl bg-gradient-primary shrink-0 flex items-center justify-center shadow-glow-purple">
                      <Brain className="w-4 h-4 text-white" />
                    </div>
                  )}
                  <div
                    className={cn(
                      "max-w-[85%] md:max-w-[75%] px-4 md:px-5 py-3 rounded-3xl text-sm leading-relaxed",
                      m.role === "user"
                        ? "bg-gradient-primary text-white rounded-tr-md"
                        : "glass border-primary/20 rounded-tl-md",
                    )}
                  >
                    {m.role === "assistant" ? (
                      <>
                        <div className="prose prose-invert prose-sm max-w-none prose-p:my-2 prose-headings:mt-3 prose-headings:mb-2 prose-ul:my-2 prose-ol:my-2 prose-li:my-0.5 prose-pre:bg-background/60 prose-pre:rounded-xl prose-code:text-primary">
                          <ReactMarkdown>{m.content || "…"}</ReactMarkdown>
                        </div>
                        <div className="flex items-center gap-1 mt-2 -mb-1 opacity-60 hover:opacity-100 transition">
                          <button
                            onClick={() => copyMsg(m)}
                            className="p-1.5 rounded-lg hover:bg-primary/10 transition"
                            aria-label="Copy"
                          >
                            {copiedId === m.id ? (
                              <Check className="w-3.5 h-3.5 text-primary" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                          <button
                            onClick={() => setFeedback(m.id, "up")}
                            className={cn(
                              "p-1.5 rounded-lg hover:bg-primary/10 transition",
                              m.feedback === "up" && "text-primary bg-primary/10",
                            )}
                            aria-label="Good response"
                          >
                            <ThumbsUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setFeedback(m.id, "down")}
                            className={cn(
                              "p-1.5 rounded-lg hover:bg-primary/10 transition",
                              m.feedback === "down" && "text-destructive bg-destructive/10",
                            )}
                            aria-label="Bad response"
                          >
                            <ThumbsDown className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </>
                    ) : (
                      <p className="whitespace-pre-wrap">{m.content}</p>
                    )}
                  </div>
                  {m.role === "user" && (
                    <div className="w-9 h-9 rounded-2xl bg-secondary shrink-0 flex items-center justify-center font-semibold text-sm">
                      M
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>

            {streaming && messages[messages.length - 1]?.role !== "assistant" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
                <div className="w-9 h-9 rounded-2xl bg-gradient-primary shrink-0 flex items-center justify-center animate-glow-pulse">
                  <Brain className="w-4 h-4 text-white" />
                </div>
                <div className="glass rounded-3xl rounded-tl-md px-5 py-4 flex gap-1.5">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      animate={{ y: [0, -6, 0], opacity: [0.4, 1, 0.4] }}
                      transition={{ duration: 1, repeat: Infinity, delay: i * 0.15 }}
                      className="w-2 h-2 rounded-full bg-primary"
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Starter prompts */}
        <AnimatePresence>
          {empty && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="px-4 md:px-8 pb-3"
            >
              <div className="max-w-3xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-2">
                {STARTERS.map((p) => (
                  <motion.button
                    key={p.label}
                    whileHover={{ y: -2 }}
                    onClick={() => send(p.prompt)}
                    className="glass rounded-2xl p-3 text-left hover:border-primary/40 transition group"
                  >
                    <p.icon className="w-4 h-4 text-primary mb-2 group-hover:scale-110 transition" />
                    <p className="text-xs font-medium leading-snug">{p.label}</p>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Sticky input */}
        <div className="sticky bottom-0 p-3 md:p-4 border-t border-border/50 bg-background/40 backdrop-blur-xl">
          <div className="max-w-3xl mx-auto flex items-end gap-2 glass rounded-2xl p-2 pl-4">
            <Sparkles className="w-4 h-4 text-primary mb-2.5 shrink-0" />
            <textarea
              ref={taRef}
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder="Ask FlowMind anything…"
              disabled={streaming}
              className="flex-1 bg-transparent outline-none text-sm placeholder:text-muted-foreground resize-none py-2 max-h-[200px]"
            />
            <Button
              onClick={() => send(input)}
              disabled={streaming || !input.trim()}
              size="icon"
              className="rounded-xl bg-gradient-primary hover:shadow-glow-purple shrink-0"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-[10px] text-muted-foreground text-center mt-2 hidden md:block">
            Enter to send · Shift + Enter for new line
          </p>
        </div>
      </GlassCard>
    </div>
  );
}

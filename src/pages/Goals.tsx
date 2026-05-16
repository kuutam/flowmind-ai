import { motion } from "framer-motion";
import { Flame, Plus, Trophy } from "lucide-react";
import PageHeader from "@/components/shared/PageHeader";
import GlassCard from "@/components/shared/GlassCard";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

interface Goal { id: number; title: string; category: string; progress: number; deadline: string; milestones: { name: string; done: boolean }[]; color: string; }

const goals: Goal[] = [
  { id: 1, title: "Ship FlowMind v2", category: "Product", progress: 78, deadline: "Jun 15", color: "hsl(var(--primary))",
    milestones: [{ name: "Design system v2", done: true }, { name: "Beta testing", done: true }, { name: "Marketing site", done: false }, { name: "Launch", done: false }] },
  { id: 2, title: "Read 24 books in 2026", category: "Personal", progress: 45, deadline: "Dec 31", color: "hsl(var(--accent))",
    milestones: [{ name: "Q1: 6 books", done: true }, { name: "Q2: 6 books", done: false }, { name: "Q3: 6 books", done: false }, { name: "Q4: 6 books", done: false }] },
  { id: 3, title: "Run a half marathon", category: "Health", progress: 62, deadline: "Aug 12", color: "hsl(var(--success))",
    milestones: [{ name: "5K under 25min", done: true }, { name: "10K under 55min", done: true }, { name: "15K training", done: false }] },
  { id: 4, title: "Launch personal blog", category: "Personal", progress: 30, deadline: "Jul 1", color: "hsl(var(--warning))",
    milestones: [{ name: "Domain + setup", done: true }, { name: "Write 5 posts", done: false }, { name: "Launch", done: false }] },
];

function ProgressRing({ progress, color }: { progress: number; color: string }) {
  const r = 36, c = 2 * Math.PI * r;
  return (
    <div className="relative w-24 h-24">
      <svg className="w-full h-full -rotate-90">
        <circle cx="48" cy="48" r={r} stroke="hsl(var(--border))" strokeWidth="6" fill="none" />
        <motion.circle
          cx="48" cy="48" r={r} stroke={color} strokeWidth="6" fill="none" strokeLinecap="round"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: c - (c * progress) / 100 }}
          transition={{ duration: 1.4, ease: "easeOut" }}
          style={{ filter: `drop-shadow(0 0 8px ${color})` }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center font-bold text-lg">{progress}%</div>
    </div>
  );
}

export default function Goals() {
  return (
    <div>
      <PageHeader title="Goals" subtitle="Track milestones, build streaks, ship dreams"
        action={<Button className="rounded-2xl bg-gradient-primary hover:shadow-glow-purple"><Plus className="w-4 h-4 mr-2" />New Goal</Button>} />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
        <GlassCard className="text-center">
          <Trophy className="w-8 h-8 mx-auto mb-2 text-warning" />
          <p className="text-3xl font-bold">12</p>
          <p className="text-sm text-muted-foreground mt-1">Goals achieved</p>
        </GlassCard>
        <GlassCard className="text-center">
          <Flame className="w-8 h-8 mx-auto mb-2 text-destructive animate-glow-pulse" />
          <p className="text-3xl font-bold">14</p>
          <p className="text-sm text-muted-foreground mt-1">Day streak 🔥</p>
        </GlassCard>
        <GlassCard className="text-center" glow="cyan">
          <div className="w-8 h-8 mx-auto mb-2 rounded-2xl bg-gradient-primary flex items-center justify-center">
            <span className="text-white text-sm font-bold">%</span>
          </div>
          <p className="text-3xl font-bold gradient-text">68%</p>
          <p className="text-sm text-muted-foreground mt-1">Avg completion</p>
        </GlassCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {goals.map((g, i) => (
          <motion.div key={g.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
            <GlassCard glow="purple" className="h-full">
              <div className="flex items-start gap-5">
                <ProgressRing progress={g.progress} color={g.color} />
                <div className="flex-1 min-w-0">
                  <Badge variant="outline" className="rounded-full text-[10px] mb-2">{g.category}</Badge>
                  <h3 className="font-semibold text-lg mb-1">{g.title}</h3>
                  <p className="text-xs text-muted-foreground mb-4">Deadline · {g.deadline}</p>
                  <Progress value={g.progress} className="h-1.5" />
                </div>
              </div>
              <div className="mt-5 pt-5 border-t border-border/50">
                <p className="text-xs font-semibold text-muted-foreground mb-3 uppercase tracking-wider">Milestones</p>
                <div className="space-y-2">
                  {g.milestones.map((m, j) => (
                    <div key={j} className="flex items-center gap-3 text-sm">
                      <div className={`w-4 h-4 rounded-md flex items-center justify-center transition ${
                        m.done ? "bg-gradient-primary" : "border border-border"
                      }`}>
                        {m.done && <span className="text-white text-[10px]">✓</span>}
                      </div>
                      <span className={m.done ? "text-muted-foreground line-through" : ""}>{m.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

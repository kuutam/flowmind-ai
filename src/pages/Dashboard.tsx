import { motion } from "framer-motion";
import { CheckCircle2, Clock, Sparkles, TrendingUp, ArrowRight, Plus, Zap, Target, MessageSquare, Send } from "lucide-react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import StatCard from "@/components/shared/StatCard";
import GlassCard from "@/components/shared/GlassCard";
import PageHeader from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const spark = (n: number, base = 50) => Array.from({ length: 12 }, (_, i) => ({ v: base + Math.sin(i * 0.7) * 15 + (i / 12) * n + Math.random() * 8 }));

const productivity = [
  { day: "Mon", focus: 4.2, tasks: 8 },
  { day: "Tue", focus: 5.1, tasks: 11 },
  { day: "Wed", focus: 3.8, tasks: 7 },
  { day: "Thu", focus: 6.2, tasks: 14 },
  { day: "Fri", focus: 5.7, tasks: 12 },
  { day: "Sat", focus: 2.1, tasks: 4 },
  { day: "Sun", focus: 3.4, tasks: 6 },
];

const kanban = {
  todo: [
    { id: 1, title: "Design system audit", tag: "Design", priority: "High" },
    { id: 2, title: "Refactor auth flow", tag: "Engineering", priority: "Medium" },
  ],
  doing: [
    { id: 3, title: "Onboarding revamp", tag: "Product", priority: "High" },
  ],
  done: [
    { id: 4, title: "Q2 OKR review", tag: "Strategy", priority: "Low" },
    { id: 5, title: "Ship v2.4 release", tag: "Engineering", priority: "Medium" },
  ],
};

const priorityColor: Record<string, string> = {
  High: "bg-destructive/15 text-destructive border-destructive/20",
  Medium: "bg-warning/15 text-warning border-warning/20",
  Low: "bg-success/15 text-success border-success/20",
};

const days = ["S", "M", "T", "W", "T", "F", "S"];
const dates = Array.from({ length: 35 }, (_, i) => i - 2);
const events = [4, 9, 15, 22, 27];

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        subtitle="Your AI-powered productivity command center"
        action={
          <Button size="lg" className="rounded-2xl bg-gradient-primary hover:shadow-glow-purple transition-all">
            <Plus className="w-4 h-4 mr-2" /> New Task
          </Button>
        }
      />

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6">
        <StatCard title="Tasks Completed" value="284" change={12} icon={CheckCircle2} data={spark(20)} accent="purple" />
        <StatCard title="Focus Hours" value="48.2h" change={8} icon={Clock} data={spark(15, 40)} accent="cyan" />
        <StatCard title="Weekly Progress" value="92%" change={5} icon={TrendingUp} data={spark(25, 30)} accent="success" />
        <StatCard title="AI Productivity Score" value="9.4" change={-2} icon={Sparkles} data={spark(10, 60)} accent="warning" />
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Productivity chart */}
        <GlassCard className="lg:col-span-2 p-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold">Weekly Productivity</h3>
              <p className="text-sm text-muted-foreground mt-1">Focus hours & completed tasks</p>
            </div>
            <Badge variant="outline" className="rounded-full">This Week</Badge>
          </div>
          <div className="h-72 -mx-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={productivity}>
                <defs>
                  <linearGradient id="purple" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="cyan" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--accent))" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="hsl(var(--accent))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    background: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "12px",
                  }}
                />
                <Area type="monotone" dataKey="focus" stroke="hsl(var(--primary))" strokeWidth={3} fill="url(#purple)" />
                <Area type="monotone" dataKey="tasks" stroke="hsl(var(--accent))" strokeWidth={3} fill="url(#cyan)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        {/* AI Insights */}
        <GlassCard className="relative overflow-hidden gradient-border" glow="purple">
          <div className="absolute -top-20 -right-20 w-48 h-48 bg-primary/30 rounded-full blur-3xl" />
          <div className="relative">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-gradient-primary flex items-center justify-center animate-glow-pulse">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold">AI Insights</h3>
                <p className="text-xs text-muted-foreground">Powered by FlowMind</p>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-foreground/90 mb-6">
              You're <span className="text-primary font-semibold">23% more focused</span> in the morning. Schedule deep work between
              <span className="text-accent font-semibold"> 9–11 AM</span> for peak output today.
            </p>
            <div className="space-y-2">
              <Button className="w-full rounded-2xl bg-gradient-primary hover:shadow-glow-purple group">
                <Zap className="w-4 h-4 mr-2" /> Optimize My Day
                <ArrowRight className="w-4 h-4 ml-auto group-hover:translate-x-1 transition" />
              </Button>
              <Button variant="outline" className="w-full rounded-2xl border-primary/30 hover:bg-primary/10">
                <Target className="w-4 h-4 mr-2" /> Generate Plan
              </Button>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Kanban + Calendar + AI chat */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <GlassCard className="lg:col-span-2" hover={false}>
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-lg font-semibold">Active Board</h3>
            <Button variant="ghost" size="sm" className="rounded-xl">View all <ArrowRight className="w-4 h-4 ml-1" /></Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { name: "To Do", items: kanban.todo, color: "bg-muted-foreground" },
              { name: "In Progress", items: kanban.doing, color: "bg-primary" },
              { name: "Done", items: kanban.done, color: "bg-success" },
            ].map((col) => (
              <div key={col.name} className="space-y-3">
                <div className="flex items-center gap-2 px-1">
                  <div className={`w-2 h-2 rounded-full ${col.color}`} />
                  <h4 className="text-sm font-semibold">{col.name}</h4>
                  <span className="text-xs text-muted-foreground ml-auto">{col.items.length}</span>
                </div>
                {col.items.map((t) => (
                  <motion.div
                    key={t.id}
                    whileHover={{ y: -2, scale: 1.02 }}
                    className="p-4 rounded-2xl bg-secondary/40 border border-border/50 hover:border-primary/30 cursor-pointer transition"
                  >
                    <div className={`inline-flex text-[10px] font-semibold px-2 py-0.5 rounded-full border mb-2 ${priorityColor[t.priority]}`}>
                      {t.priority}
                    </div>
                    <p className="text-sm font-medium leading-snug">{t.title}</p>
                    <p className="text-xs text-muted-foreground mt-2">#{t.tag}</p>
                  </motion.div>
                ))}
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Calendar widget */}
        <GlassCard hover={false}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">May 2026</h3>
            <Badge className="bg-primary/15 text-primary border-0 rounded-full">5 events</Badge>
          </div>
          <div className="grid grid-cols-7 gap-1 text-center mb-2">
            {days.map((d, i) => <div key={i} className="text-[10px] text-muted-foreground font-semibold py-1">{d}</div>)}
          </div>
          <div className="grid grid-cols-7 gap-1 text-center">
            {dates.map((d, i) => {
              const valid = d > 0 && d <= 31;
              const isToday = d === 9;
              const hasEvent = events.includes(d);
              return (
                <div key={i} className={`relative aspect-square text-xs flex items-center justify-center rounded-xl transition cursor-pointer
                  ${valid ? "hover:bg-secondary" : "text-muted-foreground/30"}
                  ${isToday ? "bg-gradient-primary text-white font-bold shadow-glow-purple" : ""}
                `}>
                  {valid ? d : ""}
                  {hasEvent && !isToday && <div className="absolute bottom-1 w-1 h-1 rounded-full bg-accent" />}
                </div>
              );
            })}
          </div>
        </GlassCard>
      </div>

      {/* AI Assistant Widget */}
      <GlassCard className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 pointer-events-none" />
        <div className="relative">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-primary flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold">AI Assistant</h3>
              <p className="text-xs text-muted-foreground">Ask anything to boost your day</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mb-4">
            {["Plan my week", "Prioritize tasks", "Summarize notes", "Focus playlist"].map((p) => (
              <button key={p} className="text-xs px-3 py-1.5 rounded-full glass border-border/50 hover:border-primary/40 hover:text-primary transition">
                {p}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 glass rounded-2xl p-2 pl-4">
            <input placeholder="Message FlowMind AI..." className="flex-1 bg-transparent outline-none text-sm placeholder:text-muted-foreground" />
            <Button size="icon" className="rounded-xl bg-gradient-primary hover:shadow-glow-purple">
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}

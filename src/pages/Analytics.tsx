import { Bar, BarChart, CartesianGrid, Cell, Legend, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Sparkles, TrendingUp } from "lucide-react";
import PageHeader from "@/components/shared/PageHeader";
import GlassCard from "@/components/shared/GlassCard";
import StatCard from "@/components/shared/StatCard";
import { Clock, Target, Zap, Award } from "lucide-react";

const weekly = [
  { day: "Mon", focus: 4.2, tasks: 8, score: 78 },
  { day: "Tue", focus: 5.1, tasks: 11, score: 85 },
  { day: "Wed", focus: 3.8, tasks: 7, score: 72 },
  { day: "Thu", focus: 6.2, tasks: 14, score: 92 },
  { day: "Fri", focus: 5.7, tasks: 12, score: 88 },
  { day: "Sat", focus: 2.1, tasks: 4, score: 60 },
  { day: "Sun", focus: 3.4, tasks: 6, score: 70 },
];
const dist = [
  { name: "Deep Work", value: 42, color: "hsl(var(--primary))" },
  { name: "Meetings", value: 18, color: "hsl(var(--accent))" },
  { name: "Email", value: 12, color: "hsl(var(--warning))" },
  { name: "Breaks", value: 28, color: "hsl(var(--success))" },
];
const sp = (n: number, b = 50) => Array.from({ length: 12 }, (_, i) => ({ v: b + Math.sin(i * 0.6) * 10 + (i / 12) * n }));

export default function Analytics() {
  return (
    <div>
      <PageHeader title="Analytics" subtitle="Deep insights into your productivity rhythms" />

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-6">
        <StatCard title="Avg Focus / Day" value="4.6h" change={14} icon={Clock} data={sp(20)} accent="purple" />
        <StatCard title="Tasks per Week" value="62" change={9} icon={Target} data={sp(15, 40)} accent="cyan" />
        <StatCard title="Streak" value="14 days" change={3} icon={Zap} data={sp(10, 60)} accent="warning" />
        <StatCard title="Productivity Score" value="9.4/10" change={5} icon={Award} data={sp(25)} accent="success" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <GlassCard className="lg:col-span-2">
          <h3 className="font-semibold mb-1">Weekly Performance</h3>
          <p className="text-xs text-muted-foreground mb-4">Tasks completed and productivity score</p>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weekly}>
                <defs>
                  <linearGradient id="b1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={1} />
                    <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                  </linearGradient>
                  <linearGradient id="b2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--accent))" stopOpacity={1} />
                    <stop offset="100%" stopColor="hsl(var(--accent))" stopOpacity={0.3} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 12 }} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="tasks" fill="url(#b1)" radius={[8, 8, 0, 0]} />
                <Bar dataKey="score" fill="url(#b2)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        <GlassCard>
          <h3 className="font-semibold mb-1">Time Distribution</h3>
          <p className="text-xs text-muted-foreground mb-4">How you spent this week</p>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={dist} dataKey="value" innerRadius={50} outerRadius={80} paddingAngle={4}>
                  {dist.map((d, i) => <Cell key={i} fill={d.color} />)}
                </Pie>
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2 mt-2">
            {dist.map((d) => (
              <div key={d.name} className="flex items-center gap-2 text-xs">
                <div className="w-2 h-2 rounded-full" style={{ background: d.color }} />
                <span className="flex-1">{d.name}</span>
                <span className="font-semibold">{d.value}%</span>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <GlassCard className="lg:col-span-2">
          <h3 className="font-semibold mb-1">Focus Hours Trend</h3>
          <p className="text-xs text-muted-foreground mb-4">Last 7 days</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weekly}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 12 }} />
                <Line type="monotone" dataKey="focus" stroke="hsl(var(--accent))" strokeWidth={3} dot={{ r: 5, fill: "hsl(var(--accent))" }} activeDot={{ r: 7 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        <GlassCard glow="purple" className="gradient-border relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/30 rounded-full blur-3xl" />
          <div className="relative">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-gradient-primary flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-semibold">AI Insights</h3>
            </div>
            <ul className="space-y-3 text-sm">
              {[
                "Thursday is your most productive day",
                "Deep work peaks between 9-11 AM",
                "Reduce Tuesday meetings by 20%",
                "Streak is 14 days — keep going!",
              ].map((s, i) => (
                <li key={i} className="flex gap-2 leading-relaxed">
                  <TrendingUp className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}

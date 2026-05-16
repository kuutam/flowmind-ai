import { motion } from "framer-motion";
import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";
import { Area, AreaChart, ResponsiveContainer } from "recharts";
import GlassCard from "./GlassCard";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string;
  change: number;
  icon: LucideIcon;
  data: { v: number }[];
  accent?: "purple" | "cyan" | "success" | "warning";
}

const accentMap = {
  purple:  { stroke: "hsl(var(--primary))",        glow: "",                  bg: "pastel-lavender", text: "text-foreground" },
  cyan:    { stroke: "hsl(165 50% 45%)",           glow: "",                  bg: "pastel-mint",     text: "text-foreground" },
  success: { stroke: "hsl(var(--success))",        glow: "",                  bg: "pastel-mint",     text: "text-foreground" },
  warning: { stroke: "hsl(var(--warning))",        glow: "",                  bg: "pastel-yellow",   text: "text-foreground" },
};

export default function StatCard({ title, value, change, icon: Icon, data, accent = "purple" }: StatCardProps) {
  const a = accentMap[accent];
  const positive = change >= 0;
  const id = `g-${accent}-${title.replace(/\s/g, "")}`;

  return (
    <GlassCard className="overflow-hidden">
      <div className="flex items-start justify-between mb-5">
        <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center", a.bg)}>
          <Icon className={cn("w-5 h-5", a.text)} />
        </div>
        <div className={cn("flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full",
          positive ? "bg-pastel-mint text-foreground" : "bg-pastel-pink text-foreground")}>
          {positive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          {positive ? "+" : ""}{change}%
        </div>
      </div>
      <p className="text-sm text-muted-foreground mb-1">{title}</p>
      <motion.h3
        initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
        className="font-display text-3xl md:text-4xl font-medium mb-3 tracking-tight"
      >{value}</motion.h3>
      <div className="h-12 -mx-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={a.stroke} stopOpacity={0.4} />
                <stop offset="100%" stopColor={a.stroke} stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area type="monotone" dataKey="v" stroke={a.stroke} strokeWidth={2} fill={`url(#${id})`} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </GlassCard>
  );
}

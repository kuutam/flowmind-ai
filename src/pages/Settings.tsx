import { useState } from "react";
import { motion } from "framer-motion";
import { Bell, Lock, Palette, Sparkles, User } from "lucide-react";
import PageHeader from "@/components/shared/PageHeader";
import GlassCard from "@/components/shared/GlassCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

const sections = [
  { id: "profile", label: "Profile", icon: User },
  { id: "appearance", label: "Appearance", icon: Palette },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "security", label: "Security", icon: Lock },
  { id: "ai", label: "AI Preferences", icon: Sparkles },
];

const accentColors = [
  { name: "Purple", v: "258 90% 66%" },
  { name: "Cyan", v: "187 85% 53%" },
  { name: "Pink", v: "330 85% 65%" },
  { name: "Emerald", v: "152 76% 50%" },
  { name: "Amber", v: "38 92% 60%" },
];

export default function Settings() {
  const [active, setActive] = useState("profile");
  const [accent, setAccent] = useState(0);
  const [dark, setDark] = useState(true);

  return (
    <div>
      <PageHeader title="Settings" subtitle="Customize FlowMind to fit your flow" />

      <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-6">
        <GlassCard hover={false} className="!p-3 h-fit">
          <nav className="space-y-1">
            {sections.map((s) => (
              <button key={s.id} onClick={() => setActive(s.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition",
                  active === s.id ? "bg-gradient-primary text-white shadow-glow-purple" : "text-muted-foreground hover:bg-secondary/40 hover:text-foreground"
                )}>
                <s.icon className="w-4 h-4" /> {s.label}
              </button>
            ))}
          </nav>
        </GlassCard>

        <motion.div key={active} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <GlassCard hover={false}>
            {active === "profile" && (
              <div className="space-y-5">
                <h3 className="text-xl font-bold">Profile</h3>
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-3xl bg-gradient-primary flex items-center justify-center text-3xl font-bold text-white shadow-glow-purple">M</div>
                  <Button variant="outline" className="rounded-2xl">Upload photo</Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div><Label>Name</Label><Input defaultValue="Maddie" className="rounded-xl mt-1.5" /></div>
                  <div><Label>Role</Label><Input defaultValue="Frontend Developer" className="rounded-xl mt-1.5" /></div>
                  <div className="md:col-span-2"><Label>Email</Label><Input defaultValue="maddie@flowmind.ai" className="rounded-xl mt-1.5" /></div>
                  <div className="md:col-span-2"><Label>Bio</Label><Input defaultValue="Building delightful interfaces with React, motion, and a lot of espresso." className="rounded-xl mt-1.5" /></div>
                </div>
                <Button className="rounded-2xl bg-gradient-primary hover:shadow-glow-purple">Save changes</Button>
              </div>
            )}

            {active === "appearance" && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold">Appearance</h3>
                <div className="flex items-center justify-between p-4 rounded-2xl bg-secondary/30">
                  <div><p className="font-medium">Dark mode</p><p className="text-xs text-muted-foreground">Easy on the eyes, big on focus.</p></div>
                  <Switch checked={dark} onCheckedChange={(v) => { setDark(v); document.documentElement.classList.toggle("dark"); document.documentElement.classList.toggle("light"); }} />
                </div>
                <div>
                  <Label className="mb-3 block">Accent color</Label>
                  <div className="flex flex-wrap gap-3">
                    {accentColors.map((c, i) => (
                      <button key={c.name} onClick={() => { setAccent(i); document.documentElement.style.setProperty('--primary', c.v); }}
                        className={cn("relative w-12 h-12 rounded-2xl transition-all hover:scale-110", accent === i && "ring-2 ring-offset-2 ring-offset-background ring-foreground")}
                        style={{ background: `hsl(${c.v})`, boxShadow: accent === i ? `0 0 20px hsl(${c.v} / 0.6)` : undefined }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {active === "notifications" && (
              <div className="space-y-4">
                <h3 className="text-xl font-bold">Notifications</h3>
                {[
                  { name: "Task reminders", desc: "Get notified when tasks are due" },
                  { name: "Daily summary", desc: "AI productivity recap each evening" },
                  { name: "Streak alerts", desc: "Don't break your momentum" },
                  { name: "Mentions & comments", desc: "When teammates tag you" },
                  { name: "Email digests", desc: "Weekly insights to your inbox" },
                ].map((n, i) => (
                  <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-secondary/30">
                    <div><p className="font-medium">{n.name}</p><p className="text-xs text-muted-foreground">{n.desc}</p></div>
                    <Switch defaultChecked={i < 3} />
                  </div>
                ))}
              </div>
            )}

            {active === "security" && (
              <div className="space-y-5">
                <h3 className="text-xl font-bold">Security</h3>
                <div className="space-y-3">
                  <div><Label>Current password</Label><Input type="password" className="rounded-xl mt-1.5" /></div>
                  <div><Label>New password</Label><Input type="password" className="rounded-xl mt-1.5" /></div>
                </div>
                <div className="flex items-center justify-between p-4 rounded-2xl bg-secondary/30">
                  <div><p className="font-medium">Two-factor authentication</p><p className="text-xs text-muted-foreground">Extra layer of security for your account.</p></div>
                  <Switch defaultChecked />
                </div>
                <Button className="rounded-2xl bg-gradient-primary">Update password</Button>
              </div>
            )}

            {active === "ai" && (
              <div className="space-y-4">
                <h3 className="text-xl font-bold">AI Preferences</h3>
                {[
                  { name: "Smart suggestions", desc: "AI proposes next best actions" },
                  { name: "Auto-prioritization", desc: "Let FlowMind reorder your tasks" },
                  { name: "Focus mode insights", desc: "Receive deep work tips daily" },
                  { name: "Voice commands", desc: "Hands-free with Whisper integration" },
                ].map((n, i) => (
                  <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-secondary/30">
                    <div><p className="font-medium">{n.name}</p><p className="text-xs text-muted-foreground">{n.desc}</p></div>
                    <Switch defaultChecked={i < 3} />
                  </div>
                ))}
              </div>
            )}
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
}

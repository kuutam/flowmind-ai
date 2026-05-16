import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Plus, MapPin, Clock, X, Bell, Sparkles, CalendarDays, Users } from "lucide-react";
import PageHeader from "@/components/shared/PageHeader";
import GlassCard from "@/components/shared/GlassCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

type ColorKey = "lavender" | "mint" | "cyan" | "amber" | "blue" | "pink";

const COLORS: Record<ColorKey, { dot: string; chip: string; bar: string; ring: string; label: string }> = {
  lavender: { dot: "bg-[hsl(257_70%_70%)]", chip: "bg-[hsl(257_87%_94%)] text-[hsl(257_45%_38%)]", bar: "bg-[hsl(257_70%_70%)]", ring: "ring-[hsl(257_70%_70%)]", label: "Lavender" },
  mint:     { dot: "bg-[hsl(158_45%_55%)]", chip: "bg-[hsl(158_55%_92%)] text-[hsl(158_45%_28%)]", bar: "bg-[hsl(158_45%_55%)]", ring: "ring-[hsl(158_45%_55%)]", label: "Mint" },
  cyan:     { dot: "bg-[hsl(190_70%_60%)]", chip: "bg-[hsl(190_80%_92%)] text-[hsl(190_55%_30%)]", bar: "bg-[hsl(190_70%_60%)]", ring: "ring-[hsl(190_70%_60%)]", label: "Cyan" },
  amber:    { dot: "bg-[hsl(38_90%_62%)]",  chip: "bg-[hsl(45_90%_90%)] text-[hsl(28_60%_35%)]",   bar: "bg-[hsl(38_90%_62%)]",  ring: "ring-[hsl(38_90%_62%)]",  label: "Amber" },
  blue:     { dot: "bg-[hsl(218_75%_62%)]", chip: "bg-[hsl(218_85%_93%)] text-[hsl(218_55%_35%)]", bar: "bg-[hsl(218_75%_62%)]", ring: "ring-[hsl(218_75%_62%)]", label: "Blue" },
  pink:     { dot: "bg-[hsl(337_75%_72%)]", chip: "bg-[hsl(337_78%_94%)] text-[hsl(337_45%_38%)]", bar: "bg-[hsl(337_75%_72%)]", ring: "ring-[hsl(337_75%_72%)]", label: "Pink" },
};

type Event = {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm 24h
  duration?: number; // hours
  location?: string;
  color: ColorKey;
};

const SEED: Event[] = [
  { id: "1", title: "Design review",         date: "2026-05-04", time: "10:00", duration: 1, location: "Studio A",       color: "lavender" },
  { id: "2", title: "Sprint kickoff",        date: "2026-05-09", time: "09:30", duration: 1, location: "Zoom",           color: "lavender" },
  { id: "3", title: "1:1 with PM",           date: "2026-05-09", time: "14:00", duration: 1, location: "Office · Rm 3",  color: "cyan" },
  { id: "4", title: "Customer interview",    date: "2026-05-12", time: "11:00", duration: 1, location: "Google Meet",    color: "mint" },
  { id: "5", title: "Launch FlowMind v2",    date: "2026-05-15", time: "16:00", duration: 2, location: "All hands",      color: "blue" },
  { id: "6", title: "Team offsite",          date: "2026-05-22", time: "09:00", duration: 8, location: "Lisbon",         color: "cyan" },
  { id: "7", title: "Quarterly review",      date: "2026-05-27", time: "15:00", duration: 1, location: "Boardroom",      color: "amber" },
];

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

function fmtDate(y: number, m: number, d: number) {
  return `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}
function parseISO(s: string) {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
}
function prettyDate(s: string) {
  const d = parseISO(s);
  return d.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" });
}

export default function Calendar() {
  const TODAY = "2026-05-09";
  const [view, setView] = useState<"Month" | "Week" | "Day">("Month");
  const [cursor, setCursor] = useState(() => new Date(2026, 4, 9)); // May 9 2026
  const [events, setEvents] = useState<Event[]>(SEED);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [reminders, setReminders] = useState([
    { id: "r1", text: "Submit timesheet", done: false },
    { id: "r2", text: "Review PR #247",   done: false },
    { id: "r3", text: "Prep design crit", done: true  },
    { id: "r4", text: "Send weekly recap", done: false },
  ]);

  // ---------- Month grid ----------
  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const firstDow = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = Array.from({ length: 42 }, (_, i) => {
    const d = i - firstDow + 1;
    return d > 0 && d <= daysInMonth ? d : null;
  });

  const eventsByDate = useMemo(() => {
    const map: Record<string, Event[]> = {};
    events.forEach(e => { (map[e.date] ||= []).push(e); });
    Object.values(map).forEach(arr => arr.sort((a, b) => a.time.localeCompare(b.time)));
    return map;
  }, [events]);

  const upcoming = useMemo(() => {
    return [...events]
      .filter(e => e.date >= TODAY)
      .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time))
      .slice(0, 4);
  }, [events]);

  // ---------- Week view ----------
  const weekStart = useMemo(() => {
    const d = new Date(cursor);
    d.setDate(d.getDate() - d.getDay());
    return d;
  }, [cursor]);
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart);
    d.setDate(d.getDate() + i);
    return d;
  });

  // ---------- Day view ----------
  const HOURS = Array.from({ length: 12 }, (_, i) => i + 8); // 8 → 19
  const dayKey = fmtDate(cursor.getFullYear(), cursor.getMonth(), cursor.getDate());
  const dayEvents = eventsByDate[dayKey] || [];

  const goPrev = () => {
    if (view === "Month") setCursor(new Date(year, month - 1, 1));
    else if (view === "Week") { const d = new Date(cursor); d.setDate(d.getDate() - 7); setCursor(d); }
    else { const d = new Date(cursor); d.setDate(d.getDate() - 1); setCursor(d); }
  };
  const goNext = () => {
    if (view === "Month") setCursor(new Date(year, month + 1, 1));
    else if (view === "Week") { const d = new Date(cursor); d.setDate(d.getDate() + 7); setCursor(d); }
    else { const d = new Date(cursor); d.setDate(d.getDate() + 1); setCursor(d); }
  };
  const goToday = () => setCursor(new Date(2026, 4, 9));

  return (
    <div>
      <PageHeader
        title="Calendar"
        subtitle={`${MONTHS[month]} ${year} — plan your week with intention`}
        action={
          <div className="flex flex-wrap items-center gap-2">
            <ViewToggle view={view} setView={setView} />
            <Button
              onClick={() => setCreateOpen(true)}
              className="rounded-2xl bg-gradient-primary text-white shadow-card hover:shadow-elevated"
            >
              <Plus className="w-4 h-4 mr-2" /> New event
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
        {/* ===== Main calendar ===== */}
        <GlassCard hover={false} className="!p-5 md:!p-6">
          {/* Top nav */}
          <div className="flex items-center justify-between mb-6 sticky top-0 z-10 bg-card/60 backdrop-blur-md -mx-2 px-2 py-1 rounded-2xl">
            <div className="flex items-center gap-2 md:gap-3">
              <Button variant="ghost" size="icon" onClick={goPrev} className="rounded-xl"><ChevronLeft className="w-5 h-5" /></Button>
              <h3 className="font-display text-xl md:text-2xl font-semibold">
                {view === "Day"
                  ? cursor.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })
                  : view === "Week"
                  ? `${weekDays[0].toLocaleDateString(undefined,{month:"short",day:"numeric"})} – ${weekDays[6].toLocaleDateString(undefined,{month:"short",day:"numeric"})}`
                  : `${MONTHS[month]} ${year}`}
              </h3>
              <Button variant="ghost" size="icon" onClick={goNext} className="rounded-xl"><ChevronRight className="w-5 h-5" /></Button>
            </div>
            <Button variant="outline" onClick={goToday} className="rounded-2xl">Today</Button>
          </div>

          <AnimatePresence mode="wait">
            {view === "Month" && (
              <motion.div key="month" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.22 }}>
                <div className="grid grid-cols-7 gap-1.5 md:gap-2 mb-2">
                  {DAYS.map(d => (
                    <div key={d} className="text-[10px] md:text-xs font-semibold text-muted-foreground uppercase tracking-[0.14em] text-center py-2">{d}</div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-1.5 md:gap-2">
                  {cells.map((d, i) => {
                    if (!d) return <div key={i} className="min-h-[88px] md:min-h-[112px]" />;
                    const key = fmtDate(year, month, d);
                    const list = eventsByDate[key] || [];
                    const isToday = key === TODAY;
                    return (
                      <motion.button
                        key={i}
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setSelectedDay(key)}
                        className={cn(
                          "min-h-[88px] md:min-h-[112px] p-2 rounded-2xl border text-left transition-all bg-card/60",
                          "border-border/60 hover:border-primary/40 hover:bg-card",
                          isToday && "border-primary/60 bg-pastel-lavender/40 shadow-card"
                        )}
                      >
                        <div className={cn(
                          "inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-semibold mb-1.5",
                          isToday ? "bg-gradient-primary text-white" : "text-foreground/80"
                        )}>{d}</div>
                        <div className="space-y-1">
                          {list.slice(0, 2).map(e => (
                            <div key={e.id} className={cn("flex items-center gap-1.5 text-[10px] md:text-[11px] rounded-lg px-1.5 py-1 truncate", COLORS[e.color].chip)}>
                              <span className={cn("w-1.5 h-1.5 rounded-full shrink-0", COLORS[e.color].dot)} />
                              <span className="truncate font-medium">{e.title}</span>
                            </div>
                          ))}
                          {list.length > 2 && <div className="text-[10px] text-muted-foreground px-1.5">+{list.length - 2} more</div>}
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {view === "Week" && (
              <motion.div key="week" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.22 }}
                className="grid grid-cols-7 gap-2">
                {weekDays.map((d, i) => {
                  const key = fmtDate(d.getFullYear(), d.getMonth(), d.getDate());
                  const list = eventsByDate[key] || [];
                  const isToday = key === TODAY;
                  return (
                    <div key={i} className={cn("rounded-2xl border bg-card/60 p-3 min-h-[360px]", isToday ? "border-primary/60 bg-pastel-lavender/30" : "border-border/60")}>
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <div className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">{DAYS[d.getDay()]}</div>
                          <div className={cn("font-display text-lg font-semibold", isToday && "text-primary")}>{d.getDate()}</div>
                        </div>
                        <button onClick={() => setSelectedDay(key)} className="text-[10px] text-muted-foreground hover:text-foreground transition">View</button>
                      </div>
                      <div className="space-y-1.5">
                        {list.map(e => (
                          <motion.div key={e.id} whileHover={{ y: -1 }} onClick={() => setSelectedDay(key)}
                            className={cn("rounded-xl px-2.5 py-2 cursor-pointer", COLORS[e.color].chip)}>
                            <div className="text-[10px] font-semibold opacity-70">{e.time}</div>
                            <div className="text-xs font-medium truncate">{e.title}</div>
                          </motion.div>
                        ))}
                        {list.length === 0 && <div className="text-[11px] text-muted-foreground/60 italic pt-2">No events</div>}
                      </div>
                    </div>
                  );
                })}
              </motion.div>
            )}

            {view === "Day" && (
              <motion.div key="day" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.22 }}>
                <div className="relative">
                  {HOURS.map(h => (
                    <div key={h} className="flex items-start gap-4 border-t border-border/50 first:border-t-0 h-20">
                      <div className="w-14 -mt-2.5 text-[11px] text-muted-foreground tabular-nums pt-1">
                        {h === 12 ? "12 PM" : h < 12 ? `${h} AM` : `${h - 12} PM`}
                      </div>
                      <div className="flex-1 relative h-full" />
                    </div>
                  ))}
                  {/* Events */}
                  <div className="absolute inset-0 pl-[72px] pr-1">
                    {dayEvents.map(e => {
                      const [hh, mm] = e.time.split(":").map(Number);
                      const startOffset = (hh - 8) * 80 + (mm / 60) * 80;
                      const height = (e.duration || 1) * 80 - 6;
                      if (hh < 8 || hh > 19) return null;
                      return (
                        <motion.div
                          key={e.id}
                          initial={{ opacity: 0, x: -6 }}
                          animate={{ opacity: 1, x: 0 }}
                          whileHover={{ scale: 1.01 }}
                          onClick={() => setSelectedDay(dayKey)}
                          className={cn("absolute left-0 right-0 rounded-2xl px-3 py-2 cursor-pointer shadow-card border border-white/40", COLORS[e.color].chip)}
                          style={{ top: startOffset, height }}
                        >
                          <div className="flex items-center gap-2">
                            <span className={cn("w-2 h-2 rounded-full", COLORS[e.color].dot)} />
                            <span className="text-xs font-semibold opacity-70">{e.time}</span>
                          </div>
                          <div className="text-sm font-semibold mt-0.5 truncate">{e.title}</div>
                          {e.location && <div className="text-[11px] opacity-70 truncate flex items-center gap-1 mt-0.5"><MapPin className="w-3 h-3" />{e.location}</div>}
                        </motion.div>
                      );
                    })}
                    {dayEvents.length === 0 && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center text-muted-foreground">
                          <CalendarDays className="w-8 h-8 mx-auto mb-2 opacity-50" />
                          <p className="text-sm">No events scheduled</p>
                          <button onClick={() => setCreateOpen(true)} className="text-xs text-primary mt-1 hover:underline">Add one</button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </GlassCard>

        {/* ===== Sidebar ===== */}
        <div className="space-y-6">
          <GlassCard hover={false} className="!p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-lg font-semibold">Upcoming</h3>
              <Sparkles className="w-4 h-4 text-primary/70" />
            </div>
            <div className="space-y-2">
              {upcoming.map((e, i) => (
                <motion.button
                  key={e.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}
                  whileHover={{ x: 2 }}
                  onClick={() => setSelectedDay(e.date)}
                  className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-secondary/60 transition text-left"
                >
                  <div className={cn("w-1 h-12 rounded-full shrink-0", COLORS[e.color].bar)} />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{e.title}</p>
                    <p className="text-xs text-muted-foreground">{prettyDate(e.date)} · {e.time}</p>
                  </div>
                </motion.button>
              ))}
            </div>
          </GlassCard>

          <GlassCard hover={false} className="!p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-lg font-semibold">Reminders</h3>
              <Bell className="w-4 h-4 text-primary/70" />
            </div>
            <div className="space-y-1.5">
              {reminders.map(r => (
                <label key={r.id} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-secondary/60 cursor-pointer transition">
                  <button
                    onClick={() => setReminders(prev => prev.map(x => x.id === r.id ? { ...x, done: !x.done } : x))}
                    className={cn(
                      "w-5 h-5 rounded-md border-2 flex items-center justify-center transition shrink-0",
                      r.done ? "bg-gradient-primary border-transparent" : "border-border hover:border-primary"
                    )}
                  >
                    <AnimatePresence>
                      {r.done && (
                        <motion.svg initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className="w-3 h-3 text-white" viewBox="0 0 12 12" fill="none">
                          <path d="M2 6l3 3 5-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </motion.svg>
                      )}
                    </AnimatePresence>
                  </button>
                  <span className={cn("text-sm transition-all relative", r.done && "text-muted-foreground")}>
                    {r.text}
                    <motion.span
                      initial={false}
                      animate={{ scaleX: r.done ? 1 : 0 }}
                      transition={{ duration: 0.25 }}
                      style={{ originX: 0 }}
                      className="absolute left-0 right-0 top-1/2 h-px bg-muted-foreground/60"
                    />
                  </span>
                </label>
              ))}
            </div>
          </GlassCard>

          <GlassCard hover={false} className="!p-5">
            <h3 className="font-display text-lg font-semibold mb-4">Quick actions</h3>
            <div className="grid grid-cols-2 gap-2">
              <QuickAction icon={Plus} label="New event" onClick={() => setCreateOpen(true)} />
              <QuickAction icon={Users} label="Invite team" />
              <QuickAction icon={CalendarDays} label="Today" onClick={goToday} />
              <QuickAction icon={Bell} label="Reminder" />
            </div>
          </GlassCard>
        </div>
      </div>

      {/* ===== Day events modal ===== */}
      <Dialog open={!!selectedDay} onOpenChange={(o) => !o && setSelectedDay(null)}>
        <DialogContent className="rounded-3xl border-border/70 bg-card/95 backdrop-blur-2xl shadow-elevated max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl">
              {selectedDay && parseISO(selectedDay).toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-2 max-h-[60vh] overflow-y-auto -mx-1 px-1">
            {selectedDay && (eventsByDate[selectedDay] || []).length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <CalendarDays className="w-10 h-10 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No events for this day</p>
              </div>
            )}
            {selectedDay && (eventsByDate[selectedDay] || []).map(e => (
              <motion.div key={e.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                className="flex gap-3 p-3 rounded-2xl bg-secondary/40">
                <div className={cn("w-1 rounded-full shrink-0", COLORS[e.color].bar)} />
                <div className="flex-1">
                  <div className="font-semibold">{e.title}</div>
                  <div className="text-xs text-muted-foreground flex items-center gap-3 mt-1">
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{e.time}</span>
                    {e.location && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{e.location}</span>}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" className="rounded-2xl" onClick={() => setSelectedDay(null)}>Close</Button>
            <Button className="rounded-2xl bg-gradient-primary text-white" onClick={() => { setCreateOpen(true); }}>
              <Plus className="w-4 h-4 mr-1" /> Add event
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ===== Create modal ===== */}
      <CreateEventModal
        open={createOpen}
        defaultDate={selectedDay || dayKey}
        onClose={() => setCreateOpen(false)}
        onSave={(e) => { setEvents(prev => [...prev, e]); setCreateOpen(false); }}
      />
    </div>
  );
}

/* -------------------- subcomponents -------------------- */

function ViewToggle({ view, setView }: { view: "Month"|"Week"|"Day"; setView: (v:"Month"|"Week"|"Day")=>void }) {
  const items: ("Month"|"Week"|"Day")[] = ["Month","Week","Day"];
  return (
    <div className="relative flex bg-secondary/70 rounded-2xl p-1">
      {items.map(v => (
        <button key={v} onClick={() => setView(v)} className="relative px-4 py-1.5 text-sm font-medium z-10">
          {view === v && (
            <motion.div layoutId="view-pill" className="absolute inset-0 bg-card rounded-xl shadow-card" transition={{ type: "spring", stiffness: 320, damping: 28 }} />
          )}
          <span className={cn("relative", view === v ? "text-foreground" : "text-muted-foreground")}>{v}</span>
        </button>
      ))}
    </div>
  );
}

function QuickAction({ icon: Icon, label, onClick }: { icon: any; label: string; onClick?: () => void }) {
  return (
    <motion.button whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }} onClick={onClick}
      className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-2xl bg-secondary/50 hover:bg-secondary transition">
      <Icon className="w-4 h-4 text-primary" />
      <span className="text-xs font-medium">{label}</span>
    </motion.button>
  );
}

function CreateEventModal({
  open, onClose, onSave, defaultDate,
}: { open: boolean; onClose: () => void; onSave: (e: Event) => void; defaultDate: string }) {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState(defaultDate);
  const [time, setTime] = useState("10:00");
  const [location, setLocation] = useState("");
  const [color, setColor] = useState<ColorKey>("lavender");

  const save = () => {
    if (!title.trim()) return;
    onSave({ id: crypto.randomUUID(), title: title.trim(), date, time, location: location.trim() || undefined, color, duration: 1 });
    setTitle(""); setLocation(""); setColor("lavender");
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="rounded-3xl border-border/70 bg-card/95 backdrop-blur-2xl shadow-elevated max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">New event</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Title</label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Add a title…" className="rounded-2xl mt-1.5 h-11" autoFocus />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Date</label>
              <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="rounded-2xl mt-1.5 h-11" />
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Time</label>
              <Input type="time" value={time} onChange={(e) => setTime(e.target.value)} className="rounded-2xl mt-1.5 h-11" />
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Location</label>
            <Input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Add location…" className="rounded-2xl mt-1.5 h-11" />
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Color</label>
            <div className="flex gap-2 mt-2">
              {(Object.keys(COLORS) as ColorKey[]).map(k => (
                <motion.button
                  key={k} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.92 }}
                  onClick={() => setColor(k)}
                  className={cn("w-9 h-9 rounded-full transition ring-offset-2 ring-offset-background", COLORS[k].dot, color === k && cn("ring-2", COLORS[k].ring))}
                  aria-label={COLORS[k].label}
                />
              ))}
            </div>
          </div>
        </div>
        <DialogFooter className="gap-2">
          <Button variant="outline" className="rounded-2xl" onClick={onClose}>Cancel</Button>
          <Button className="rounded-2xl bg-gradient-primary text-white" onClick={save} disabled={!title.trim()}>Save event</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

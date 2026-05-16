import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Pin, PinOff, Plus, Search, Trash2 } from "lucide-react";
import PageHeader from "@/components/shared/PageHeader";
import GlassCard from "@/components/shared/GlassCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Note { id: number; title: string; body: string; category: string; pinned: boolean; date: string; color: string; }

const seed: Note[] = [
  { id: 1, title: "Q3 product strategy", body: "Focus on AI-first onboarding, expand Notion integration, ship voice mode by August.", category: "Strategy", pinned: true, date: "May 8", color: "from-primary/20 to-primary/5" },
  { id: 2, title: "Design system tokens", body: "Migrate to OKLCH colors. Define semantic tokens for elevation 1-5. Document motion curves.", category: "Design", pinned: true, date: "May 7", color: "from-accent/20 to-accent/5" },
  { id: 3, title: "Book recommendations", body: "Deep Work — Cal Newport\nThe Pragmatic Programmer\nA Philosophy of Software Design", category: "Personal", pinned: false, date: "May 5", color: "from-warning/20 to-warning/5" },
  { id: 4, title: "1:1 prep with Lena", body: "Career growth, scope of frontend platform team, Q3 OKRs alignment.", category: "Work", pinned: false, date: "May 3", color: "from-success/20 to-success/5" },
  { id: 5, title: "Weekend ideas", body: "Hike Mt. Tam, try the new ramen spot, finish the React Compiler post.", category: "Personal", pinned: false, date: "May 2", color: "from-primary/20 to-accent/5" },
  { id: 6, title: "Hiring checklist", body: "Update job description, brief recruiter, prep take-home, schedule loop.", category: "Work", pinned: false, date: "Apr 30", color: "from-accent/20 to-primary/5" },
];

const categories = ["All", "Strategy", "Design", "Work", "Personal"];

export default function Notes() {
  const [notes, setNotes] = useState(seed);
  const [search, setSearch] = useState("");
  const [cat, setCat] = useState("All");

  const togglePin = (id: number) => setNotes((n) => n.map((x) => x.id === id ? { ...x, pinned: !x.pinned } : x));
  const remove = (id: number) => setNotes((n) => n.filter((x) => x.id !== id));

  const filtered = notes
    .filter((n) => cat === "All" || n.category === cat)
    .filter((n) => n.title.toLowerCase().includes(search.toLowerCase()) || n.body.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => Number(b.pinned) - Number(a.pinned));

  return (
    <div>
      <PageHeader
        title="Notes"
        subtitle="Capture ideas, ship clarity"
        action={<Button className="rounded-2xl bg-gradient-primary hover:shadow-glow-purple"><Plus className="w-4 h-4 mr-2" />New Note</Button>}
      />

      <div className="flex flex-col md:flex-row gap-3 mb-6">
        <div className="flex items-center gap-2 glass rounded-2xl px-4 py-2 flex-1">
          <Search className="w-4 h-4 text-muted-foreground" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search notes..." className="bg-transparent text-sm flex-1 outline-none" />
        </div>
        <div className="flex gap-2 overflow-x-auto">
          {categories.map((c) => (
            <button key={c} onClick={() => setCat(c)} className={`px-4 py-2 rounded-2xl text-sm font-medium whitespace-nowrap transition ${
              cat === c ? "bg-gradient-primary text-white shadow-glow-purple" : "glass hover:border-primary/40"
            }`}>{c}</button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        <AnimatePresence mode="popLayout">
          {filtered.map((n) => (
            <motion.div
              key={n.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              whileHover={{ y: -4 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className={`relative glass rounded-3xl p-5 hover:border-primary/30 group bg-gradient-to-br ${n.color}`}
            >
              <div className="flex items-start justify-between mb-3">
                <Badge variant="outline" className="rounded-full text-[10px]">{n.category}</Badge>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition">
                  <button onClick={() => togglePin(n.id)} className="p-1.5 hover:bg-secondary rounded-lg">
                    {n.pinned ? <Pin className="w-3.5 h-3.5 text-primary" /> : <PinOff className="w-3.5 h-3.5" />}
                  </button>
                  <button onClick={() => remove(n.id)} className="p-1.5 hover:bg-destructive/20 rounded-lg">
                    <Trash2 className="w-3.5 h-3.5 text-destructive" />
                  </button>
                </div>
              </div>
              {n.pinned && <Pin className="absolute top-4 right-4 w-3.5 h-3.5 text-primary group-hover:opacity-0 transition" />}
              <h4 className="font-semibold mb-2 leading-snug">{n.title}</h4>
              <p className="text-sm text-muted-foreground line-clamp-4 leading-relaxed whitespace-pre-line">{n.body}</p>
              <p className="text-[10px] text-muted-foreground mt-4">{n.date}</p>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

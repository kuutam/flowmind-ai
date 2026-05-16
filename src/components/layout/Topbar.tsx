import { Bell, Menu, Moon, Search, Sun } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

export default function Topbar({ onMenuClick }: { onMenuClick: () => void }) {
  const [dark, setDark] = useState(false);

  const toggleTheme = () => {
    document.documentElement.classList.toggle("dark");
    setDark(d => !d);
  };

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good Morning" : hour < 18 ? "Good Afternoon" : "Good Evening";

  return (
    <header className="sticky top-0 z-30 bg-background/70 backdrop-blur-xl">
      <div className="flex items-center gap-3 md:gap-4 px-4 md:px-6 h-16 md:h-20">
        <button onClick={onMenuClick} className="lg:hidden p-2 hover:bg-secondary rounded-full">
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden md:block">
          <motion.h2
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display text-xl md:text-2xl font-medium tracking-tight"
          >
            {greeting}, Maddie{" "}
            <motion.span
              className="inline-block"
              animate={{ rotate: [0, 14, -8, 14, -4, 10, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 4 }}
            >👋</motion.span>
          </motion.h2>
          <p className="text-xs text-muted-foreground mt-0.5">Let's make today productive</p>
        </div>

        <div className="flex-1" />

        <div className="hidden md:flex items-center gap-2 bg-card border border-border/70 rounded-full px-4 py-2 w-72 lg:w-96 hover:border-primary/40 transition-colors shadow-card">
          <Search className="w-4 h-4 text-muted-foreground" />
          <input
            placeholder="Search anything..."
            className="bg-transparent text-sm flex-1 outline-none placeholder:text-muted-foreground"
          />
          <kbd className="text-[10px] text-muted-foreground bg-secondary rounded px-1.5 py-0.5">⌘K</kbd>
        </div>

        <button className="md:hidden p-2 hover:bg-secondary rounded-full">
          <Search className="w-5 h-5" />
        </button>

        <button onClick={toggleTheme} className="p-2.5 hover:bg-secondary rounded-full transition group">
          {dark ? <Sun className="w-5 h-5 group-hover:rotate-45 transition" /> : <Moon className="w-5 h-5" />}
        </button>

        <button className="relative p-2.5 hover:bg-secondary rounded-full transition">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full animate-pulse" />
        </button>

        <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center text-white font-semibold cursor-pointer hover:shadow-glow-purple transition-all">
          M
        </div>
      </div>
    </header>
  );
}

import { NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, CheckSquare, Calendar, BarChart3, Sparkles,
  StickyNote, Target, Settings as SettingsIcon, ChevronUp, X, Brain,
  PanelLeftClose, PanelLeftOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const nav = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/tasks", label: "Tasks", icon: CheckSquare },
  { to: "/calendar", label: "Calendar", icon: Calendar },
  { to: "/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/ai", label: "AI Assistant", icon: Sparkles },
  { to: "/notes", label: "Notes", icon: StickyNote },
  { to: "/goals", label: "Goals", icon: Target },
  { to: "/settings", label: "Settings", icon: SettingsIcon },
];

interface Props {
  mobileOpen: boolean;
  onMobileClose: () => void;
  collapsed: boolean;
  onToggleCollapsed: () => void;
}

export default function Sidebar({ mobileOpen, onMobileClose, collapsed, onToggleCollapsed }: Props) {
  const SidebarInner = ({ isMobile = false }: { isMobile?: boolean }) => {
    const showLabels = isMobile ? true : !collapsed;
    return (
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className={cn("flex items-center justify-between p-5", !showLabels && "px-3")}>
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative shrink-0">
              <div className="w-10 h-10 rounded-2xl bg-gradient-primary flex items-center justify-center shadow-card">
                <Brain className="w-5 h-5 text-white" />
              </div>
            </div>
            <AnimatePresence initial={false}>
              {showLabels && (
                <motion.div
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden whitespace-nowrap"
                >
                  <h1 className="font-display text-lg leading-none">FlowMind</h1>
                  <p className="text-[10px] text-muted-foreground tracking-[0.2em] uppercase mt-1">Editorial · 2026</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          {isMobile && (
            <button
              onClick={onMobileClose}
              aria-label="Close sidebar"
              className="p-2 hover:bg-secondary rounded-full transition shrink-0"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Nav */}
        <nav className={cn("flex-1 space-y-1 overflow-y-auto", showLabels ? "px-3" : "px-2")}>
          {nav.map((item, i) => {
            const link = (
              <NavLink
                to={item.to}
                end={item.to === "/"}
                onClick={isMobile ? onMobileClose : undefined}
                className={({ isActive }) => cn(
                  "group relative flex items-center gap-3 rounded-2xl text-sm font-medium",
                  "transition-all duration-300",
                  showLabels ? "px-3.5 py-2.5" : "px-3 py-2.5 justify-center",
                  isActive
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                )}
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <motion.div
                        layoutId={isMobile ? "activeNavMobile" : "activeNav"}
                        className="absolute inset-0 bg-secondary rounded-2xl"
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      />
                    )}
                    <item.icon className={cn("w-[18px] h-[18px] relative z-10 shrink-0 transition-transform group-hover:scale-110", isActive && "text-primary")} />
                    {showLabels && <span className="relative z-10 truncate">{item.label}</span>}
                    {showLabels && isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary relative z-10" />}
                  </>
                )}
              </NavLink>
            );

            return (
              <motion.div
                key={item.to}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
              >
                {!showLabels ? (
                  <Tooltip delayDuration={0}>
                    <TooltipTrigger asChild>{link}</TooltipTrigger>
                    <TooltipContent side="right">{item.label}</TooltipContent>
                  </Tooltip>
                ) : link}
              </motion.div>
            );
          })}
        </nav>

        {/* Profile */}
        <div className={cn("border-t border-border/60", showLabels ? "p-3" : "p-2")}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className={cn(
                "w-full flex items-center gap-3 rounded-2xl hover:bg-secondary transition group",
                showLabels ? "p-2.5" : "p-2 justify-center"
              )}>
                <div className="relative shrink-0">
                  <div className="w-9 h-9 rounded-full bg-gradient-primary flex items-center justify-center text-white font-semibold text-sm">M</div>
                  <div className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-success border-2 border-card" />
                </div>
                {showLabels && (
                  <>
                    <div className="flex-1 text-left min-w-0">
                      <p className="text-sm font-semibold truncate">Maddie</p>
                      <p className="text-xs text-muted-foreground truncate">Frontend Developer</p>
                    </div>
                    <ChevronUp className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition" />
                  </>
                )}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-60 rounded-2xl">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Billing</DropdownMenuItem>
              <DropdownMenuItem>Team</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">Sign out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={onMobileClose}
              className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-40 lg:hidden"
            />
            <motion.aside
              key="drawer"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 34 }}
              className="fixed top-3 bottom-3 left-3 z-50 w-[85%] max-w-xs bg-card border border-border/70 rounded-3xl shadow-elevated lg:hidden overflow-hidden"
            >
              <SidebarInner isMobile />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Desktop floating sidebar */}
      <div className="hidden lg:block sticky top-0 h-screen py-4 pl-4 shrink-0">
        <motion.aside
          animate={{ width: collapsed ? 76 : 260 }}
          transition={{ type: "spring", stiffness: 260, damping: 30 }}
          className="h-full bg-card border border-border/70 rounded-3xl shadow-card relative"
        >
          <SidebarInner />
          <button
            onClick={onToggleCollapsed}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-card border border-border/70 flex items-center justify-center hover:bg-secondary hover:border-primary/40 transition shadow-card z-10"
          >
            {collapsed
              ? <PanelLeftOpen className="w-3.5 h-3.5" />
              : <PanelLeftClose className="w-3.5 h-3.5" />}
          </button>
        </motion.aside>
      </div>
    </>
  );
}

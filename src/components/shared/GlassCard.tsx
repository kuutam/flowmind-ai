import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";
import { forwardRef } from "react";

interface GlassCardProps extends HTMLMotionProps<"div"> {
  glow?: "purple" | "cyan" | "none";
  hover?: boolean;
}

const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, glow = "none", hover = true, children, ...props }, ref) => (
    <motion.div
      ref={ref}
      whileHover={hover ? { y: -3 } : undefined}
      transition={{ type: "spring", stiffness: 260, damping: 22 }}
      className={cn(
        "relative bg-card border border-border/70 rounded-[28px] p-6 shadow-card transition-all duration-300",
        hover && "hover:shadow-elevated hover:border-border",
        glow === "purple" && "hover:shadow-glow-purple",
        glow === "cyan" && "hover:shadow-glow-cyan",
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  )
);
GlassCard.displayName = "GlassCard";
export default GlassCard;

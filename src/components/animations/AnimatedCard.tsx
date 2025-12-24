"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface AnimatedCardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export function AnimatedCard({
  children,
  className,
  onClick,
}: AnimatedCardProps) {
  return (
    <motion.div
      whileHover={{ y: -4, boxShadow: "0 10px 40px rgba(43, 75, 60, 0.15)" }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className={cn(
        "bg-white rounded-2xl p-4 shadow-sm cursor-pointer",
        className
      )}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
}

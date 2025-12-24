"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export function Header() {
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-40 bg-cream/95 backdrop-blur-lg border-b border-cream-dark"
    >
      <div className="flex items-center justify-center h-14 px-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-serif font-bold text-primary">
            Chamiza
          </span>
          <span className="text-sm font-medium text-accent">2026</span>
        </Link>
      </div>
    </motion.header>
  );
}

"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { EVENT_DATE, getTimeUntil } from "@/lib/utils";

interface TimeUnitProps {
  value: number;
  label: string;
}

function TimeUnit({ value, label }: TimeUnitProps) {
  return (
    <div className="flex flex-col items-center">
      <div className="relative w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-xl shadow-lg overflow-hidden">
        <AnimatePresence mode="popLayout">
          <motion.div
            key={value}
            initial={{ y: -40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <span className="text-2xl sm:text-3xl font-bold text-primary font-serif">
              {value.toString().padStart(2, "0")}
            </span>
          </motion.div>
        </AnimatePresence>
      </div>
      <span className="mt-2 text-xs sm:text-sm text-primary/60 font-medium">
        {label}
      </span>
    </div>
  );
}

export function Countdown() {
  const [time, setTime] = useState(getTimeUntil(EVENT_DATE));
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const interval = setInterval(() => {
      setTime(getTimeUntil(EVENT_DATE));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  if (!mounted) {
    return (
      <div className="flex justify-center gap-3 sm:gap-4">
        {[0, 0, 0, 0].map((_, i) => (
          <div key={i} className="flex flex-col items-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-xl shadow-lg skeleton" />
            <div className="mt-2 w-12 h-4 skeleton rounded" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="flex justify-center gap-3 sm:gap-4"
    >
      <TimeUnit value={time.days} label="dias" />
      <TimeUnit value={time.hours} label="horas" />
      <TimeUnit value={time.minutes} label="minutos" />
      <TimeUnit value={time.seconds} label="segundos" />
    </motion.div>
  );
}

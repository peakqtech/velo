"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";

const STATS = [
  { number: 50, suffix: "+", label: "Industry Templates" },
  { number: 3, suffix: "×", label: "Faster Deployment" },
  { number: 98, suffix: "%", label: "Client Retention Rate" },
  { number: 0, suffix: "", label: "Setup Cost — Ever", prefix: "$" },
];

function useCountUp(target: number, duration = 1200, trigger: boolean) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!trigger) return;
    if (target === 0) { setCount(0); return; }
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration, trigger]);
  return count;
}

function StatItem({
  stat,
  delay,
  trigger,
}: {
  stat: (typeof STATS)[0];
  delay: number;
  trigger: boolean;
}) {
  const count = useCountUp(stat.number, 1200, trigger);
  return (
    <motion.div
      className="flex flex-col items-center justify-center py-10 px-6 text-center"
      initial={{ opacity: 0, y: 16 }}
      animate={trigger ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      style={{ borderRight: "1px solid rgba(255,255,255,0.06)" }}
    >
      <div className="text-4xl font-bold mb-1" style={{ fontFamily: "Impact, sans-serif" }}>
        {stat.prefix && <span className="text-white">{stat.prefix}</span>}
        <span className="text-white">{count}</span>
        <span style={{ color: "#3b82f6" }}>{stat.suffix}</span>
      </div>
      <div
        className="text-[10px] uppercase tracking-[0.12em]"
        style={{ fontFamily: "Courier New, monospace", color: "rgba(255,255,255,0.45)" }}
      >
        {stat.label}
      </div>
    </motion.div>
  );
}

export function Stats() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <div
      ref={ref}
      className="grid grid-cols-2 md:grid-cols-4"
      style={{
        borderTop: "1px solid rgba(59,130,246,0.12)",
        borderBottom: "1px solid rgba(59,130,246,0.12)",
      }}
    >
      {STATS.map((stat, i) => (
        <StatItem key={stat.label} stat={stat} delay={i * 0.15} trigger={isInView} />
      ))}
    </div>
  );
}

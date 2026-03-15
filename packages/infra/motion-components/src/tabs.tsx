"use client";

import { useState, useRef, useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

interface Tab {
  id: string;
  label: string;
  content: ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  className?: string;
}

export function Tabs({ tabs, className = "" }: TabsProps) {
  const [activeId, setActiveId] = useState(tabs[0]?.id ?? "");
  const shouldReduceMotion = useReducedMotion();
  const tabRefs = useRef<Map<string, HTMLButtonElement>>(new Map());
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });

  useEffect(() => {
    const el = tabRefs.current.get(activeId);
    if (el) {
      setIndicatorStyle({ left: el.offsetLeft, width: el.offsetWidth });
    }
  }, [activeId]);

  const activeTab = tabs.find((t) => t.id === activeId);

  return (
    <div className={className}>
      <div className="relative flex gap-1 rounded-full bg-foreground/5 p-1 w-fit mx-auto">
        {shouldReduceMotion ? null : (
          <motion.div
            className="absolute top-1 bottom-1 rounded-full bg-primary"
            animate={indicatorStyle}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
        )}
        {tabs.map((tab) => (
          <button
            key={tab.id}
            ref={(el) => { if (el) tabRefs.current.set(tab.id, el); }}
            onClick={() => setActiveId(tab.id)}
            className={`relative z-10 px-6 py-2 text-sm font-medium rounded-full transition-colors ${
              activeId === tab.id ? "text-white" : "text-muted hover:text-foreground"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="mt-8">
        {activeTab?.content}
      </div>
    </div>
  );
}

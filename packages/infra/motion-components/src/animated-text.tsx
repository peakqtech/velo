"use client";

import { motion, useReducedMotion } from "framer-motion";

interface AnimatedTextProps {
  text: string;
  as?: "h1" | "h2" | "h3" | "p" | "span";
  className?: string;
  staggerDelay?: number;
  /** "word" = word-by-word reveal, "char" = character-level with blur */
  mode?: "word" | "char";
}

const wordVariants = {
  hidden: { y: "100%", opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.5, ease: [0.33, 1, 0.68, 1] as const },
  },
};

const charVariants = {
  hidden: { y: "100%", opacity: 0, filter: "blur(4px)" },
  visible: {
    y: 0,
    opacity: 1,
    filter: "blur(0px)",
    transition: { duration: 0.4, ease: [0.33, 1, 0.68, 1] as const },
  },
};

export function AnimatedText({
  text,
  as: Tag = "h1",
  className = "",
  staggerDelay = 0.03,
  mode = "word",
}: AnimatedTextProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <Tag className={className}>{text}</Tag>;
  }

  if (mode === "char") {
    const words = text.split(" ");
    return (
      <Tag className={className} aria-label={text}>
        <motion.span
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: staggerDelay } },
          }}
        >
          {words.map((word, wi) => (
            <span key={wi} className="inline-block mr-[0.25em]">
              {word.split("").map((char, ci) => (
                <span key={ci} className="inline-block overflow-hidden">
                  <motion.span className="inline-block" variants={charVariants}>
                    {char}
                  </motion.span>
                </span>
              ))}
            </span>
          ))}
        </motion.span>
      </Tag>
    );
  }

  // Default: word mode
  const words = text.split(" ");
  return (
    <Tag className={className} aria-label={text}>
      <motion.span
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: staggerDelay * 3 } },
        }}
      >
        {words.map((word, i) => (
          <span key={i} className="inline-block overflow-hidden mr-[0.25em]">
            <motion.span className="inline-block" variants={wordVariants}>
              {word}
            </motion.span>
          </span>
        ))}
      </motion.span>
    </Tag>
  );
}

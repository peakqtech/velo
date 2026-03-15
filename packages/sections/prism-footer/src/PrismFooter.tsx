"use client";
import { useState, useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import type { PrismFooterProps } from "./prism-footer.types";
import { fadeInUp, staggerContainerSlow } from "@velo/animations";

export function PrismFooter({ content, localeSwitcher }: PrismFooterProps) {
  const { brand, newsletter, socials, links, legal } = content;
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const handleScroll = () => setShowBackToTop(window.scrollY > window.innerHeight);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) { setSubmitted(true); setEmail(""); }
  };

  return (
    <footer className="prism-footer-section relative bg-white border-t border-foreground/5" aria-label="Site footer">
      <div className="prism-footer-inner py-section px-6">
        <div className="max-w-content mx-auto pt-12">
          <motion.div className="text-center mb-20"
            initial={shouldReduceMotion ? "visible" : "hidden"} whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
            <h2 className="text-2xl md:text-4xl font-display font-bold text-foreground">{newsletter.heading}</h2>
            {submitted ? (
              <motion.div className="flex items-center justify-center gap-2 text-primary font-medium mt-6"
                initial={shouldReduceMotion ? {} : { opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
                Thanks for subscribing!
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="flex max-w-md mx-auto gap-2 mt-6">
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder={newsletter.placeholder} required aria-label="Email address"
                  className="flex-1 px-5 py-3 bg-background border border-foreground/10 rounded-xl text-foreground placeholder:text-muted focus:outline-none focus:border-primary transition-all duration-300" />
                <button type="submit" className="px-6 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary-light transition-colors">{newsletter.cta}</button>
              </form>
            )}
          </motion.div>

          <motion.div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16"
            initial={shouldReduceMotion ? "visible" : "hidden"} whileInView="visible" viewport={{ once: true }} variants={staggerContainerSlow}>
            <motion.div variants={fadeInUp}>
              <Image src={brand.logo} alt={brand.name} width={120} height={30} />
            </motion.div>
            {links.map((group) => (
              <motion.div key={group.group} variants={fadeInUp}>
                <h3 className="font-display font-semibold text-foreground mb-4">{group.group}</h3>
                <ul className="space-y-3">
                  {group.items.map((item) => (
                    <li key={item.label}><a href={item.href} className="text-muted hover:text-foreground transition-colors text-sm">{item.label}</a></li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </motion.div>

          <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-foreground/5">
            <div className="flex items-center gap-4">
              <p className="text-sm text-muted">{legal}</p>
              {localeSwitcher}
            </div>
            <div className="flex gap-3 mt-4 md:mt-0">
              {socials.map((social) => (
                <a key={social.platform} href={social.url} target="_blank" rel="noopener noreferrer" aria-label={social.platform}
                  className="p-2.5 rounded-full bg-foreground/5 text-muted hover:text-foreground hover:bg-primary/10 transition-all duration-300 text-sm">
                  {social.platform}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      <motion.button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} aria-label="Back to top"
        className="fixed bottom-8 right-8 z-40 p-3 rounded-full bg-primary text-white shadow-lg hover:bg-primary-light transition-all duration-300"
        initial={false} animate={{ opacity: showBackToTop ? 1 : 0, scale: showBackToTop ? 1 : 0.8 }} transition={{ duration: 0.3 }}
        style={{ pointerEvents: showBackToTop ? "auto" : "none" }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="18 15 12 9 6 15"/></svg>
      </motion.button>
    </footer>
  );
}

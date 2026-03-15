"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import type { FooterProps } from "./footer.types";
import { fadeInUp, staggerContainerSlow } from "@velo/animations";

const socialIcons: Record<string, JSX.Element> = {
  instagram: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="5" /><circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" />
    </svg>
  ),
  twitter: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  ),
  youtube: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  ),
};

export function Footer({ content, localeSwitcher }: FooterProps) {
  const { brand, newsletter, socials, links, legal } = content;
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > window.innerHeight);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubmitted(true);
      setEmail("");
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer
      className="footer-section relative bg-secondary"
      aria-label="Site footer"
    >
      {/* Section divider */}
      <div className="section-divider" />

      <div className="footer-inner py-section px-6">
        <div className="max-w-content mx-auto pt-12">
          {/* Newsletter */}
          <motion.div
            className="text-center mb-20"
            initial={shouldReduceMotion ? "visible" : "hidden"}
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h2 className="text-2xl md:text-4xl font-display font-bold text-foreground mb-6">
              {newsletter.heading}
            </h2>
            {submitted ? (
              <motion.div
                className="flex items-center justify-center gap-2 text-primary font-medium"
                initial={shouldReduceMotion ? {} : { opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                Thanks for subscribing!
              </motion.div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="flex max-w-md mx-auto gap-2"
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={newsletter.placeholder}
                  required
                  aria-label="Email address"
                  className="flex-1 px-5 py-3 bg-background border border-foreground/20 rounded-full text-foreground placeholder:text-muted focus:outline-none focus:border-primary focus:glow-primary-sm transition-all duration-300"
                />
                <button
                  type="submit"
                  className="px-6 py-3 bg-primary text-white font-bold rounded-full hover:bg-primary-light transition-all duration-300 hover:scale-105 glow-primary"
                >
                  {newsletter.cta}
                </button>
              </form>
            )}
          </motion.div>

          {/* Links grid with stagger */}
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16"
            initial={shouldReduceMotion ? "visible" : "hidden"}
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainerSlow}
          >
            {/* Brand */}
            <motion.div variants={fadeInUp}>
              <Image
                src={brand.logo}
                alt={brand.name}
                width={120}
                height={30}
              />
            </motion.div>

            {links.map((group) => (
              <motion.div key={group.group} variants={fadeInUp}>
                <h3 className="font-display font-bold text-foreground mb-4">
                  {group.group}
                </h3>
                <ul className="space-y-3">
                  {group.items.map((item) => (
                    <li key={item.label}>
                      <a
                        href={item.href}
                        className="text-muted hover:text-foreground transition-colors duration-300 hover:translate-x-1 inline-block"
                      >
                        {item.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </motion.div>

          {/* Bottom bar */}
          <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-foreground/10">
            <div className="flex items-center gap-4">
              <p className="text-sm text-muted">{legal}</p>
              {localeSwitcher}
            </div>
            <div className="flex gap-3 mt-4 md:mt-0">
              {socials.map((social) => (
                <a
                  key={social.platform}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.platform}
                  className="p-2.5 rounded-full bg-foreground/5 border border-foreground/10 text-muted hover:text-foreground hover:border-primary/30 hover:bg-foreground/10 transition-all duration-300"
                >
                  {socialIcons[social.icon] ?? social.platform}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Back to top */}
      <motion.button
        onClick={scrollToTop}
        aria-label="Back to top"
        className="fixed bottom-8 right-8 z-40 p-3 rounded-full bg-primary text-white shadow-lg hover:bg-primary-light transition-all duration-300"
        initial={false}
        animate={{ opacity: showBackToTop ? 1 : 0, scale: showBackToTop ? 1 : 0.8 }}
        transition={{ duration: 0.3 }}
        style={{ pointerEvents: showBackToTop ? "auto" : "none" }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="18 15 12 9 6 15" />
        </svg>
      </motion.button>
    </footer>
  );
}

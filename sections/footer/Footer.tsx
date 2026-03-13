"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import type { FooterProps } from "./footer.types";
import { LocaleSwitcher } from "@/components/locale-switcher";

export function Footer({ content }: FooterProps) {
  const { brand, newsletter, socials, links, legal } = content;
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubmitted(true);
      setEmail("");
    }
  };

  return (
    <footer
      className="footer-section relative bg-secondary"
      aria-label="Site footer"
    >
      <div className="footer-inner py-section px-6">
        <div className="max-w-content mx-auto">
          {/* Newsletter */}
          <div className="text-center mb-16">
            <h2 className="text-2xl md:text-4xl font-display font-bold text-foreground mb-6">
              {newsletter.heading}
            </h2>
            {submitted ? (
              <motion.p
                className="text-primary font-medium"
                initial={shouldReduceMotion ? {} : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                Thanks for subscribing!
              </motion.p>
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
                  className="flex-1 px-4 py-3 bg-background border border-foreground/20 rounded-full text-foreground placeholder:text-muted focus:outline-none focus:border-primary transition-colors"
                />
                <button
                  type="submit"
                  className="px-6 py-3 bg-primary text-white font-bold rounded-full hover:bg-primary-light transition-colors"
                >
                  {newsletter.cta}
                </button>
              </form>
            )}
          </div>

          {/* Links grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
            {/* Brand */}
            <div>
              <Image
                src={brand.logo}
                alt={brand.name}
                width={120}
                height={30}
              />
            </div>

            {links.map((group) => (
              <div key={group.group}>
                <h3 className="font-display font-bold text-foreground mb-4">
                  {group.group}
                </h3>
                <ul className="space-y-2">
                  {group.items.map((item) => (
                    <li key={item.label}>
                      <a
                        href={item.href}
                        className="text-muted hover:text-foreground transition-colors"
                      >
                        {item.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Bottom bar */}
          <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-foreground/10">
            <div className="flex items-center gap-4">
              <p className="text-sm text-muted">{legal}</p>
              <LocaleSwitcher />
            </div>
            <div className="flex gap-4 mt-4 md:mt-0">
              {socials.map((social) => (
                <a
                  key={social.platform}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.platform}
                  className="text-muted hover:text-foreground transition-colors text-sm"
                >
                  {/* Icon integration via 21st.dev at implementation time — text fallback for now */}
                  {social.platform}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

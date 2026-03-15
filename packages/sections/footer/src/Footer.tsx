"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import type { FooterProps } from "./footer.types";
import { getVariantStyles } from "./footer-variants";
import { fadeInUp, staggerContainerSlow } from "@velo/animations";
import { BackToTop } from "@velo/ui";

const socialIcons: Record<string, React.JSX.Element> = {
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

export function Footer({ content, variant = "default", localeSwitcher }: FooterProps) {
  const { brand, newsletter, socials, links, legal } = content;
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const styles = getVariantStyles(variant);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubmitted(true);
      setEmail("");
    }
  };

  const successInitial = shouldReduceMotion
    ? {}
    : styles.successAnimation === "scale"
      ? { opacity: 0, scale: 0.9 }
      : { opacity: 0 };

  return (
    <footer
      className={`${styles.sectionClass} relative ${styles.section}`}
      aria-label="Site footer"
    >
      {styles.showDivider && <div className={styles.dividerClass} />}

      <div className={`footer-inner py-section ${styles.padding}`}>
        <div className="max-w-content mx-auto pt-12">
          {/* Newsletter */}
          <motion.div
            className="text-center mb-20"
            initial={shouldReduceMotion ? "visible" : "hidden"}
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h2 className={styles.heading}>
              {newsletter.heading}
            </h2>
            {submitted ? (
              <motion.div
                className="flex items-center justify-center gap-2 text-primary font-medium"
                initial={successInitial}
                animate={{ opacity: 1, scale: 1 }}
              >
                {styles.successIcon && (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
                Thanks for subscribing!
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="flex max-w-md mx-auto gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={newsletter.placeholder}
                  required
                  aria-label="Email address"
                  className={styles.input}
                />
                <button type="submit" className={styles.button}>
                  {newsletter.cta}
                </button>
              </form>
            )}
          </motion.div>

          {/* Links grid */}
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16"
            initial={shouldReduceMotion ? "visible" : "hidden"}
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainerSlow}
          >
            <motion.div variants={fadeInUp}>
              <Image src={brand.logo} alt={brand.name} width={120} height={30} />
            </motion.div>

            {links.map((group) => (
              <motion.div key={group.group} variants={fadeInUp}>
                <h3 className={styles.groupTitle}>{group.group}</h3>
                <ul className="space-y-3">
                  {group.items.map((item) => (
                    <li key={item.label}>
                      <a href={item.href} className={styles.linkItem}>
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
                  className={styles.socialButton}
                >
                  {socialIcons[social.icon] ?? social.platform}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      <BackToTop className={styles.backToTop} />
    </footer>
  );
}

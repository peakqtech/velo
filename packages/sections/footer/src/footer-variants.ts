import type { FooterVariant } from "./footer.types";

interface VariantStyles {
  section: string;
  sectionClass: string;
  showDivider: boolean;
  dividerClass: string;
  heading: string;
  input: string;
  button: string;
  successIcon: boolean;
  successAnimation: "scale" | "fade";
  groupTitle: string;
  linkItem: string;
  socialButton: string;
  backToTop: string;
  padding: string;
}

const baseStyles: VariantStyles = {
  section: "bg-secondary",
  sectionClass: "footer-section",
  showDivider: true,
  dividerClass: "section-divider",
  heading: "text-2xl md:text-4xl font-display font-bold text-foreground mb-6",
  input: "w-full py-3.5 pl-5 pr-32 bg-background border border-foreground/20 rounded-full text-foreground text-base placeholder:text-muted focus:outline-none focus:border-primary transition-all duration-300",
  button: "px-6 py-2 bg-primary text-white text-sm font-bold rounded-full hover:bg-primary-light transition-all duration-300",
  successIcon: true,
  successAnimation: "scale",
  groupTitle: "font-display font-bold text-foreground mb-4",
  linkItem: "text-muted hover:text-foreground transition-colors duration-300 hover:translate-x-1 inline-block",
  socialButton: "p-2.5 rounded-full bg-foreground/5 border border-foreground/10 text-muted hover:text-foreground hover:border-primary/30 hover:bg-foreground/10 transition-all duration-300",
  backToTop: "rounded-full",
  padding: "px-6",
};

const variants: Record<FooterVariant, Partial<VariantStyles>> = {
  default: {},
  ember: {
    dividerClass: "w-12 h-px bg-primary mx-auto mb-8",
    input: "w-full py-3.5 pl-5 pr-32 bg-background border border-foreground/10 text-foreground placeholder:text-muted focus:outline-none focus:border-primary transition-all duration-300",
    button: "px-6 py-2 bg-primary text-white text-sm font-bold hover:bg-primary-light transition-all duration-300",
    successIcon: false,
    successAnimation: "fade",
  },
  haven: {
    showDivider: false,
    input: "w-full py-3.5 pl-5 pr-32 bg-white/5 backdrop-blur-xl border border-white/10 rounded-lg text-foreground placeholder:text-foreground/40 focus:outline-none focus:border-primary transition-all duration-300",
    button: "px-6 py-2 bg-primary text-white text-sm font-bold rounded-lg hover:bg-primary-light transition-all duration-300",
    successIcon: false,
    successAnimation: "fade",
    backToTop: "rounded-lg",
    padding: "px-6 md:px-12",
  },
  nexus: {
    heading: "text-2xl md:text-4xl font-display font-black text-foreground mb-6 uppercase tracking-tight",
    input: "w-full py-3.5 pl-5 pr-32 bg-background border border-foreground/20 text-foreground placeholder:text-muted focus:outline-none focus:border-primary transition-all duration-300",
    button: "px-6 py-2 bg-primary text-white text-sm font-black hover:bg-primary-light transition-all duration-300",
    groupTitle: "font-display font-black text-foreground mb-4 uppercase tracking-wider",
    socialButton: "p-2.5 border border-foreground/20 text-muted hover:text-foreground hover:border-primary transition-all duration-300",
    backToTop: "",
    padding: "px-6 md:px-12",
  },
  prism: {
    section: "bg-background border-t border-foreground/5",
    showDivider: false,
    input: "w-full py-3.5 pl-5 pr-32 bg-foreground/5 border border-foreground/10 rounded-xl text-foreground placeholder:text-muted focus:outline-none focus:border-primary transition-all duration-300",
    button: "px-6 py-2 bg-primary text-white text-sm font-bold rounded-xl hover:bg-primary-light transition-all duration-300",
    socialButton: "p-2.5 rounded-full bg-foreground/5 text-muted hover:text-foreground hover:bg-foreground/10 transition-all duration-300",
  },
  serenity: {
    section: "bg-background border-t border-foreground/5",
    showDivider: false,
    input: "w-full py-3.5 pl-5 pr-32 bg-foreground/5 border border-foreground/10 rounded-2xl text-foreground placeholder:text-muted focus:outline-none focus:border-primary transition-all duration-300",
    button: "px-6 py-2 bg-primary text-white text-sm font-bold rounded-2xl hover:bg-primary-light transition-all duration-300 shadow-sm",
    successIcon: false,
    successAnimation: "fade",
    backToTop: "rounded-2xl shadow-primary/20",
    padding: "px-6 md:px-12",
  },
};

export function getVariantStyles(variant: FooterVariant): VariantStyles {
  return { ...baseStyles, ...variants[variant] };
}

import React from "react";
import type { BaseFooterContent } from "@velo/types";

export type { FooterContent } from "@velo/types";
export type { BaseFooterContent } from "@velo/types";

export type FooterVariant = "default" | "ember" | "haven" | "nexus" | "prism" | "serenity";

export interface FooterProps {
  content: BaseFooterContent;
  variant?: FooterVariant;
  localeSwitcher?: React.ReactNode;
}

import React from "react";

export type { FooterContent } from "@velocity/types";

export interface FooterProps {
  content: import("@velocity/types").FooterContent;
  localeSwitcher?: React.ReactNode;
}

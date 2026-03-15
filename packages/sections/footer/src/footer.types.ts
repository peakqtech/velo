import React from "react";

export type { FooterContent } from "@velo/types";

export interface FooterProps {
  content: import("@velo/types").FooterContent;
  localeSwitcher?: React.ReactNode;
}

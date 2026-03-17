import React from "react";

type HeadingProps = React.HTMLAttributes<HTMLHeadingElement>;
type ParagraphProps = React.HTMLAttributes<HTMLParagraphElement>;
type AnchorProps = React.AnchorHTMLAttributes<HTMLAnchorElement>;
type ListProps = React.HTMLAttributes<HTMLUListElement | HTMLOListElement>;
type BlockquoteProps = React.HTMLAttributes<HTMLQuoteElement>;

export const mdxComponents = {
  h1: (props: HeadingProps) => (
    <h1
      className="mb-6 mt-10 text-3xl font-extrabold tracking-tight"
      style={{ color: "var(--foreground)" }}
      {...props}
    />
  ),

  h2: (props: HeadingProps) => (
    <h2
      className="mb-4 mt-8 text-2xl font-bold tracking-tight"
      style={{ color: "var(--foreground)" }}
      {...props}
    />
  ),

  h3: (props: HeadingProps) => (
    <h3
      className="mb-3 mt-6 text-xl font-semibold"
      style={{ color: "var(--foreground)" }}
      {...props}
    />
  ),

  p: (props: ParagraphProps) => (
    <p
      className="mb-4 leading-relaxed"
      style={{ color: "var(--foreground)" }}
      {...props}
    />
  ),

  a: ({ href, children, ...props }: AnchorProps) => (
    <a
      href={href}
      className="underline underline-offset-2 transition-opacity hover:opacity-75"
      style={{ color: "var(--accent)" }}
      {...props}
    >
      {children}
    </a>
  ),

  ul: (props: ListProps) => (
    <ul
      className="mb-4 list-disc pl-6 leading-relaxed"
      style={{ color: "var(--foreground)" }}
      {...(props as React.HTMLAttributes<HTMLUListElement>)}
    />
  ),

  ol: (props: ListProps) => (
    <ol
      className="mb-4 list-decimal pl-6 leading-relaxed"
      style={{ color: "var(--foreground)" }}
      {...(props as React.HTMLAttributes<HTMLOListElement>)}
    />
  ),

  blockquote: (props: BlockquoteProps) => (
    <blockquote
      className="my-6 border-l-4 pl-4 italic"
      style={{
        borderColor: "var(--accent)",
        color: "var(--muted)",
      }}
      {...props}
    />
  ),
};

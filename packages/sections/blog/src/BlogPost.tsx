import React from "react";

export interface BlogPostProps {
  title: string;
  description: string;
  date: string;
  author: string;
  readingTime: number;
  keywords?: string[];
  children: React.ReactNode;
}

export function BlogPost({
  title,
  description,
  date,
  author,
  readingTime,
  keywords = [],
  children,
}: BlogPostProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    datePublished: date,
    author: {
      "@type": "Person",
      name: author,
    },
    keywords: keywords.join(", "),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article className="mx-auto max-w-3xl px-4 py-12">
        <header className="mb-10">
          <h1
            className="mb-4 text-4xl font-extrabold leading-tight tracking-tight"
            style={{ color: "var(--foreground)" }}
          >
            {title}
          </h1>
          <p className="mb-6 text-lg leading-relaxed" style={{ color: "var(--muted)" }}>
            {description}
          </p>
          <div
            className="flex flex-wrap items-center gap-4 text-sm"
            style={{ color: "var(--muted)" }}
          >
            <span>{author}</span>
            <span aria-hidden="true">·</span>
            <time dateTime={date}>{date}</time>
            <span aria-hidden="true">·</span>
            <span>{readingTime} min read</span>
          </div>
        </header>

        <div
          className="prose prose-lg max-w-none"
          style={{ color: "var(--foreground)" }}
        >
          {children}
        </div>
      </article>
    </>
  );
}

import React from "react";

export interface BlogCardProps {
  title: string;
  description: string;
  date: string;
  image?: string;
  slug: string;
  category?: string;
  readingTime: number;
  locale: string;
}

export function BlogCard({
  title,
  description,
  date,
  image,
  slug,
  category,
  readingTime,
  locale,
}: BlogCardProps) {
  const href = `/${locale}/blog/${slug}`;

  return (
    <article
      className="flex flex-col overflow-hidden rounded-xl border transition-shadow hover:shadow-lg"
      style={{ backgroundColor: "var(--card-bg)", borderColor: "var(--muted)" }}
    >
      {image && (
        <a href={href} className="block overflow-hidden aspect-video">
          <img
            src={image}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
          />
        </a>
      )}

      <div className="flex flex-1 flex-col gap-3 p-5">
        {category && (
          <span
            className="text-xs font-semibold uppercase tracking-wider"
            style={{ color: "var(--accent)" }}
          >
            {category}
          </span>
        )}

        <h2 className="text-lg font-bold leading-snug" style={{ color: "var(--foreground)" }}>
          <a href={href} className="hover:underline">
            {title}
          </a>
        </h2>

        <p className="flex-1 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
          {description}
        </p>

        <div
          className="flex items-center gap-3 text-xs"
          style={{ color: "var(--muted)" }}
        >
          <time dateTime={date}>{date}</time>
          <span aria-hidden="true">·</span>
          <span>{readingTime} min read</span>
        </div>
      </div>
    </article>
  );
}

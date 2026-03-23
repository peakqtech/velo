import React from "react";
import { BlogCard, type BlogCardProps } from "./BlogCard";

export interface BlogPost extends Omit<BlogCardProps, "locale"> {
  id: string;
}

export interface BlogListProps {
  posts: BlogPost[];
  locale: string;
}

export function BlogList({ posts, locale }: BlogListProps) {
  if (posts.length === 0) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-base" style={{ color: "var(--muted)" }}>
          No posts yet. Check back soon!
        </p>
      </div>
    );
  }

  return (
    <section className="w-full">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <BlogCard key={post.id} {...post} locale={locale} />
        ))}
      </div>
    </section>
  );
}

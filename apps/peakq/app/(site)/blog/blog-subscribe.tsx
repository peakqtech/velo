"use client";

import { useState } from "react";

export function BlogSubscribe() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  if (subscribed) {
    return (
      <p className="text-sm font-medium" style={{ color: "#4ade80" }}>
        You&rsquo;re on the list! We&rsquo;ll let you know when we publish our
        first post.
      </p>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        console.log("Blog subscribe:", email);
        setSubscribed(true);
      }}
      className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
    >
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@company.com"
        className="flex-1 rounded-lg px-4 py-3 text-sm text-white placeholder:text-gray-500 outline-none focus:ring-2"
        style={{
          background: "#1f2937",
          border: "1px solid #374151",
        }}
      />
      <button
        type="submit"
        className="px-6 py-3 rounded-lg font-semibold text-sm transition-all duration-200 hover:opacity-90 active:scale-95 cursor-pointer whitespace-nowrap"
        style={{ backgroundColor: "#4ade80", color: "#030712" }}
      >
        Notify Me
      </button>
    </form>
  );
}

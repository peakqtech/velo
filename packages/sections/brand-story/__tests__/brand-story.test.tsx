import { describe, it, expect, beforeAll } from "vitest";
import { render, screen } from "@testing-library/react";
import { BrandStory } from "../src/BrandStory";
import type { BrandStoryContent } from "@velo/types";

// jsdom lacks IntersectionObserver — mock it so framer-motion whileInView doesn't throw
beforeAll(() => {
  global.IntersectionObserver = class IntersectionObserver {
    readonly root = null;
    readonly rootMargin = "";
    readonly thresholds: ReadonlyArray<number> = [];
    observe() {}
    unobserve() {}
    disconnect() {}
    takeRecords(): IntersectionObserverEntry[] { return []; }
  };
});

vi.mock("framer-motion", async () => {
  const actual = await vi.importActual("framer-motion");
  return {
    ...actual,
    useReducedMotion: () => true,
  };
});

const mockContent: BrandStoryContent = {
  chapters: [
    {
      heading: "Born on the Track",
      body: "Our origin story.",
      media: { type: "image", src: "/story-1.jpg", alt: "Track sunrise" },
      layout: "right",
    },
    {
      heading: "Tested by Champions",
      body: "Battle tested at every level.",
      media: { type: "image", src: "/story-2.jpg", alt: "Athletes competing" },
      layout: "left",
    },
  ],
};

describe("BrandStory", () => {
  it("renders all chapter headings", () => {
    render(<BrandStory content={mockContent} />);
    // Headings appear in both desktop + mobile layouts
    const headings = screen.getAllByText("Born on the Track");
    expect(headings.length).toBeGreaterThanOrEqual(1);
  });

  it("renders chapter body text", () => {
    render(<BrandStory content={mockContent} />);
    const bodies = screen.getAllByText("Our origin story.");
    expect(bodies.length).toBeGreaterThanOrEqual(1);
  });

  it("renders images with alt text", () => {
    render(<BrandStory content={mockContent} />);
    const images = screen.getAllByRole("img", { name: "Track sunrise" });
    expect(images.length).toBeGreaterThanOrEqual(1);
  });

  it("has accessible section label", () => {
    render(<BrandStory content={mockContent} />);
    expect(screen.getByLabelText("Brand Story")).toBeInTheDocument();
  });
});

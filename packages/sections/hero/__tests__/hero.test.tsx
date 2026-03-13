import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Hero } from "../src/Hero";
import type { HeroContent } from "@velocity/types";

// Mock framer-motion to avoid animation issues in tests
vi.mock("framer-motion", async () => {
  const actual = await vi.importActual("framer-motion");
  return {
    ...actual,
    useReducedMotion: () => true, // Disable animations in tests
  };
});

const mockContent: HeroContent = {
  headline: "Test Headline",
  tagline: "Test tagline text",
  cta: { label: "Shop Now", href: "#shop" },
  media: { type: "image", src: "/test.jpg", alt: "Test image" },
  overlay: { opacity: 0.5 },
};

describe("Hero", () => {
  it("renders headline text", () => {
    render(<Hero content={mockContent} />);
    expect(screen.getByText("Test Headline")).toBeInTheDocument();
  });

  it("renders tagline", () => {
    render(<Hero content={mockContent} />);
    expect(screen.getByText("Test tagline text")).toBeInTheDocument();
  });

  it("renders CTA with correct href", () => {
    render(<Hero content={mockContent} />);
    const link = screen.getByRole("link", { name: "Shop Now" });
    expect(link).toHaveAttribute("href", "#shop");
  });

  it("renders image when media type is image", () => {
    render(<Hero content={mockContent} />);
    expect(screen.getByRole("img", { name: "Test image" })).toBeInTheDocument();
  });

  it("has accessible section label", () => {
    render(<Hero content={mockContent} />);
    expect(screen.getByLabelText("Hero")).toBeInTheDocument();
  });
});

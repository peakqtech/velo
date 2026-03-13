import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Footer } from "../Footer";
import type { FooterContent } from "@/lib/types";

vi.mock("framer-motion", async () => {
  const actual = await vi.importActual("framer-motion");
  return {
    ...actual,
    useReducedMotion: () => true,
  };
});

// Mock next/navigation for LocaleSwitcher
vi.mock("next/navigation", () => ({
  usePathname: () => "/en",
}));

const mockContent: FooterContent = {
  brand: { name: "Velocity", logo: "/logo.svg" },
  newsletter: { heading: "Stay in the race", placeholder: "Email", cta: "Subscribe" },
  socials: [{ platform: "Instagram", url: "https://instagram.com", icon: "instagram" }],
  links: [
    { group: "Shop", items: [{ label: "Running", href: "#" }] },
  ],
  legal: "© 2026 Velocity",
};

describe("Footer", () => {
  it("renders newsletter heading", () => {
    render(<Footer content={mockContent} />);
    expect(screen.getByText("Stay in the race")).toBeInTheDocument();
  });

  it("renders link groups", () => {
    render(<Footer content={mockContent} />);
    expect(screen.getByText("Shop")).toBeInTheDocument();
    expect(screen.getByText("Running")).toBeInTheDocument();
  });

  it("renders social links", () => {
    render(<Footer content={mockContent} />);
    expect(screen.getByLabelText("Instagram")).toBeInTheDocument();
  });

  it("renders legal text", () => {
    render(<Footer content={mockContent} />);
    expect(screen.getByText("© 2026 Velocity")).toBeInTheDocument();
  });

  it("shows success message after newsletter submit", () => {
    render(<Footer content={mockContent} />);
    const input = screen.getByLabelText("Email address");
    fireEvent.change(input, { target: { value: "test@test.com" } });
    fireEvent.click(screen.getByText("Subscribe"));
    expect(screen.getByText("Thanks for subscribing!")).toBeInTheDocument();
  });
});

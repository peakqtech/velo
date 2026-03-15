import { describe, it, expect, beforeAll } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Footer } from "../src/Footer";
import type { BaseFooterContent } from "@velo/types";

// Mock IntersectionObserver for jsdom
beforeAll(() => {
  global.IntersectionObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  } as any;
});

vi.mock("framer-motion", async () => {
  const actual = await vi.importActual("framer-motion");
  return {
    ...actual,
    useReducedMotion: () => true,
  };
});

vi.mock("@velo/ui", () => ({
  BackToTop: ({ className }: { className?: string }) => (
    <button data-testid="back-to-top" className={className}>Top</button>
  ),
}));

const mockContent: BaseFooterContent = {
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

  it("renders localeSwitcher prop when provided", () => {
    render(<Footer content={mockContent} localeSwitcher={<span>EN | ID</span>} />);
    expect(screen.getByText("EN | ID")).toBeInTheDocument();
  });

  it("renders back-to-top button", () => {
    render(<Footer content={mockContent} />);
    expect(screen.getByTestId("back-to-top")).toBeInTheDocument();
  });

  it("defaults to 'default' variant", () => {
    const { container } = render(<Footer content={mockContent} />);
    const footer = container.querySelector("footer");
    expect(footer?.className).toContain("bg-secondary");
  });

  it("applies nexus variant with uppercase typography", () => {
    const { container } = render(<Footer content={mockContent} variant="nexus" />);
    const heading = container.querySelector("h2");
    expect(heading?.className).toContain("uppercase");
  });

  it("applies prism variant with light background", () => {
    const { container } = render(<Footer content={mockContent} variant="prism" />);
    const footer = container.querySelector("footer");
    expect(footer?.className).toContain("bg-background");
  });

  it("applies serenity variant with rounded-2xl buttons", () => {
    const { container } = render(<Footer content={mockContent} variant="serenity" />);
    const button = container.querySelector("button[type='submit']");
    expect(button?.className).toContain("rounded-2xl");
  });

  it("hides divider for haven variant", () => {
    const { container } = render(<Footer content={mockContent} variant="haven" />);
    expect(container.querySelector(".section-divider")).toBeNull();
  });

  it("shows divider for default variant", () => {
    const { container } = render(<Footer content={mockContent} />);
    expect(container.querySelector(".section-divider")).toBeInTheDocument();
  });
});

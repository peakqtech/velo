import { describe, it, expect, beforeAll } from "vitest";
import { render, screen, fireEvent, act, waitFor } from "@testing-library/react";
import { Testimonials } from "../src/Testimonials";
import type { TestimonialsContent } from "@velo/types";

beforeAll(() => {
  // Mock IntersectionObserver for framer-motion whileInView
  global.IntersectionObserver = class IntersectionObserver {
    constructor(private callback: IntersectionObserverCallback) {}
    observe(target: Element) {
      // Immediately trigger as intersecting so whileInView animations fire
      this.callback(
        [{ isIntersecting: true, target, intersectionRatio: 1 } as IntersectionObserverEntry],
        this as unknown as IntersectionObserver
      );
    }
    unobserve() {}
    disconnect() {}
    get root() { return null; }
    get rootMargin() { return ""; }
    get thresholds() { return []; }
    takeRecords() { return []; }
  } as unknown as typeof IntersectionObserver;
});

vi.mock("framer-motion", async () => {
  const actual = await vi.importActual("framer-motion");
  return {
    ...actual,
    useReducedMotion: () => true,
  };
});

const mockContent: TestimonialsContent = {
  heading: "Athletes Speak",
  testimonials: [
    { quote: "Amazing shoes!", author: "Sarah", role: "Runner", avatar: "/a.jpg", avatarAlt: "Sarah portrait" },
    { quote: "Best ever.", author: "Marcus", role: "Trainer", avatar: "/b.jpg", avatarAlt: "Marcus portrait" },
    { quote: "Love them!", author: "Elena", role: "Coach", avatar: "/c.jpg", avatarAlt: "Elena portrait" },
  ],
};

describe("Testimonials — default (carousel) variant", () => {
  it("renders heading", () => {
    render(<Testimonials content={mockContent} />);
    expect(screen.getByText("Athletes Speak")).toBeInTheDocument();
  });

  it("renders first testimonial by default", () => {
    render(<Testimonials content={mockContent} />);
    expect(screen.getByText(/Amazing shoes!/)).toBeInTheDocument();
    expect(screen.getByText("Sarah")).toBeInTheDocument();
  });

  it("navigates to next testimonial on button click", async () => {
    render(<Testimonials content={mockContent} />);
    await act(async () => {
      fireEvent.click(screen.getByLabelText("Next testimonial"));
    });
    await waitFor(() => {
      expect(screen.getByText(/Best ever./)).toBeInTheDocument();
    });
  });

  it("has accessible carousel region", () => {
    render(<Testimonials content={mockContent} />);
    expect(screen.getByRole("region", { name: "Customer testimonials" })).toBeInTheDocument();
  });

  it("renders navigation dots", () => {
    render(<Testimonials content={mockContent} />);
    const dots = screen.getAllByRole("tab");
    expect(dots).toHaveLength(3);
  });
});

describe("Testimonials — grid variants", () => {
  it("renders all testimonials simultaneously for ember variant", () => {
    render(<Testimonials content={mockContent} variant="ember" />);
    expect(screen.getByText("Athletes Speak")).toBeInTheDocument();
    expect(screen.getByText(/Amazing shoes!/)).toBeInTheDocument();
    expect(screen.getByText(/Best ever./)).toBeInTheDocument();
    expect(screen.getByText(/Love them!/)).toBeInTheDocument();
  });

  it("renders all testimonials for prism variant", () => {
    render(<Testimonials content={mockContent} variant="prism" />);
    expect(screen.getByText("Athletes Speak")).toBeInTheDocument();
    expect(screen.getByText("Sarah")).toBeInTheDocument();
    expect(screen.getByText("Marcus")).toBeInTheDocument();
    expect(screen.getByText("Elena")).toBeInTheDocument();
  });

  it("renders star ratings for serenity variant", () => {
    const { container } = render(<Testimonials content={mockContent} variant="serenity" />);
    // 5 stars per testimonial, 3 testimonials = 15 star SVGs
    const stars = container.querySelectorAll("svg.text-amber-400");
    expect(stars.length).toBe(15);
  });

  it("does not render star ratings for ember variant", () => {
    const { container } = render(<Testimonials content={mockContent} variant="ember" />);
    const stars = container.querySelectorAll("svg.text-amber-400");
    expect(stars.length).toBe(0);
  });

  it("does not show carousel navigation for grid variants", () => {
    render(<Testimonials content={mockContent} variant="prism" />);
    expect(screen.queryByLabelText("Next testimonial")).not.toBeInTheDocument();
    expect(screen.queryByLabelText("Previous testimonial")).not.toBeInTheDocument();
  });

  it("renders ember divider accent line", () => {
    const { container } = render(<Testimonials content={mockContent} variant="ember" />);
    const divider = container.querySelector(".w-12.h-\\[1px\\].bg-primary");
    expect(divider).toBeInTheDocument();
  });

  it("has accessible section label for grid variants", () => {
    render(<Testimonials content={mockContent} variant="serenity" />);
    expect(screen.getByRole("region", { name: "Testimonials" })).toBeInTheDocument();
  });
});

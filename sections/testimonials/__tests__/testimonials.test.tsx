import { describe, it, expect } from "vitest";
import { render, screen, fireEvent, act, waitFor } from "@testing-library/react";
import { Testimonials } from "../Testimonials";
import type { TestimonialsContent } from "@/lib/types";

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
  ],
};

describe("Testimonials", () => {
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
    expect(dots).toHaveLength(2);
  });
});

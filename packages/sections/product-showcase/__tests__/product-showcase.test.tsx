import { describe, it, expect, beforeAll } from "vitest";
import { render, screen } from "@testing-library/react";
import { ProductShowcase } from "../src/ProductShowcase";
import type { ProductShowcaseContent } from "@velo/types";

vi.mock("framer-motion", async () => {
  const actual = await vi.importActual("framer-motion");
  return {
    ...actual,
    useReducedMotion: () => true,
  };
});

beforeAll(() => {
  // jsdom does not implement IntersectionObserver
  global.IntersectionObserver = class IntersectionObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  } as unknown as typeof IntersectionObserver;
});

const mockContent: ProductShowcaseContent = {
  title: "The Apex Runner",
  subtitle: "Our best shoe",
  products: [
    {
      name: "Apex Runner Pro",
      image: "/shoe.png",
      alt: "Apex shoe",
      features: [
        { label: "Carbon Plate", position: { x: 30, y: 60 } },
        { label: "React Foam", position: { x: 70, y: 80 } },
      ],
    },
  ],
};

describe("ProductShowcase", () => {
  it("renders title and subtitle", () => {
    render(<ProductShowcase content={mockContent} />);
    expect(screen.getByText("The Apex Runner")).toBeInTheDocument();
    expect(screen.getByText("Our best shoe")).toBeInTheDocument();
  });

  it("renders product image with alt text", () => {
    render(<ProductShowcase content={mockContent} />);
    expect(screen.getByRole("img", { name: "Apex shoe" })).toBeInTheDocument();
  });

  it("renders feature callouts", () => {
    render(<ProductShowcase content={mockContent} />);
    expect(screen.getByText("Carbon Plate")).toBeInTheDocument();
    expect(screen.getByText("React Foam")).toBeInTheDocument();
  });

  it("has accessible section label", () => {
    render(<ProductShowcase content={mockContent} />);
    expect(screen.getByLabelText("Product Showcase")).toBeInTheDocument();
  });
});

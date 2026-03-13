import { describe, it, expect } from "vitest";
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import { ProductGrid } from "../src/ProductGrid";
import type { ProductGridContent } from "@velocity/types";

vi.mock("framer-motion", async () => {
  const actual = await vi.importActual("framer-motion");
  return {
    ...actual,
    useReducedMotion: () => true,
  };
});

const mockContent: ProductGridContent = {
  heading: "Shop Collection",
  categories: ["All", "Running", "Training"],
  products: [
    { name: "Runner A", price: { amount: 180, currency: "USD" }, image: "/a.jpg", alt: "Runner A shoe", category: "Running", badge: "New" },
    { name: "Trainer B", price: { amount: 140, currency: "USD" }, image: "/b.jpg", alt: "Trainer B shoe", category: "Training" },
  ],
};

describe("ProductGrid", () => {
  it("renders heading", () => {
    render(<ProductGrid content={mockContent} />);
    expect(screen.getByText("Shop Collection")).toBeInTheDocument();
  });

  it("renders all products initially", () => {
    render(<ProductGrid content={mockContent} />);
    expect(screen.getByText("Runner A")).toBeInTheDocument();
    expect(screen.getByText("Trainer B")).toBeInTheDocument();
  });

  it("filters products by category", async () => {
    render(<ProductGrid content={mockContent} />);
    await act(async () => {
      fireEvent.click(screen.getByRole("tab", { name: "Running" }));
    });
    expect(screen.getByText("Runner A")).toBeInTheDocument();
    await waitFor(() =>
      expect(screen.queryByText("Trainer B")).not.toBeInTheDocument()
    );
  });

  it("renders badges when present", () => {
    render(<ProductGrid content={mockContent} />);
    expect(screen.getByText("New")).toBeInTheDocument();
  });

  it("formats prices correctly", () => {
    render(<ProductGrid content={mockContent} />);
    expect(screen.getByText("$180")).toBeInTheDocument();
    expect(screen.getByText("$140")).toBeInTheDocument();
  });

  it("has accessible filter tabs with first selected by default", () => {
    render(<ProductGrid content={mockContent} />);
    const tabs = screen.getAllByRole("tab");
    expect(tabs).toHaveLength(3);
    expect(tabs[0]).toHaveAttribute("aria-selected", "true");
  });
});

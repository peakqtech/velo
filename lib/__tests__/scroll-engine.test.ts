import { describe, it, expect } from "vitest";
import type { ScrollConfig } from "@/lib/scroll-engine";

describe("ScrollConfig type", () => {
  it("accepts a valid config object", () => {
    const config: ScrollConfig = {
      trigger: ".hero",
      pin: true,
      scrub: 1,
      start: "top top",
      end: "+=100%",
      timeline: (tl, el) => {
        expect(typeof tl).toBeDefined();
        expect(typeof el).toBe("function");
      },
    };
    expect(config.trigger).toBe(".hero");
    expect(config.pin).toBe(true);
  });

  it("accepts minimal config with only required fields", () => {
    const config: ScrollConfig = {
      trigger: ".section",
      timeline: () => {},
    };
    expect(config.trigger).toBe(".section");
    expect(config.pin).toBeUndefined();
  });
});

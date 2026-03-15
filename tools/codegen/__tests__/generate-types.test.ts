import { describe, it, expect } from "vitest";
import { generateContentType } from "../src/generate-types";

describe("generateContentType", () => {
  it("generates a composite content type from template.json sections", () => {
    const manifest = {
      name: "velocity",
      contentType: "VelocityContent",
      sections: {
        "@velo/hero": { component: "Hero", contentKey: "hero" },
        "@velo/footer": { component: "Footer", contentKey: "footer" },
      },
    };

    const output = generateContentType(manifest);

    expect(output).toContain("VelocityContent");
    expect(output).toContain("hero: HeroContent");
    expect(output).toContain("footer: BaseFooterContent");
    expect(output).toContain("metadata: BaseMetadata");
  });

  it("generates correct import statements for section content types", () => {
    const manifest = {
      name: "velocity",
      contentType: "VelocityContent",
      sections: {
        "@velo/hero": { component: "Hero", contentKey: "hero" },
        "@velo/product-showcase": { component: "ProductShowcase", contentKey: "productShowcase" },
      },
    };

    const output = generateContentType(manifest);

    expect(output).toContain("HeroContent");
    expect(output).toContain("ProductShowcaseContent");
    expect(output).toContain("BaseMetadata");
  });

  it("derives content type name from component name + Content", () => {
    const manifest = {
      name: "ember",
      contentType: "EmberContent",
      sections: {
        "@velo/ember-hero": { component: "EmberHero", contentKey: "hero" },
        "@velo/ember-menu": { component: "EmberMenu", contentKey: "menu" },
      },
    };

    const output = generateContentType(manifest);

    expect(output).toContain("EmberContent");
    expect(output).toContain("hero: EmberHeroContent");
    expect(output).toContain("menu: EmberMenuContent");
  });

  it("uses BaseFooterContent for footer sections (consolidated)", () => {
    const manifest = {
      name: "ember",
      contentType: "EmberContent",
      sections: {
        "@velo/footer": {
          component: "Footer",
          contentKey: "footer",
          extraProps: { variant: "ember" },
        },
      },
    };

    const output = generateContentType(manifest);

    // Footer is consolidated — use BaseFooterContent regardless of variant
    expect(output).toContain("footer: BaseFooterContent");
  });

  it("uses BaseTestimonialContent for testimonials sections (consolidated)", () => {
    const manifest = {
      name: "prism",
      contentType: "PrismContent",
      sections: {
        "@velo/testimonials": {
          component: "Testimonials",
          contentKey: "testimonials",
          extraProps: { variant: "prism" },
        },
      },
    };

    const output = generateContentType(manifest);

    expect(output).toContain("testimonials: BaseTestimonialContent");
  });

  it("includes auto-generated header comment", () => {
    const manifest = {
      name: "velocity",
      contentType: "VelocityContent",
      sections: {
        "@velo/hero": { component: "Hero", contentKey: "hero" },
      },
    };

    const output = generateContentType(manifest);

    expect(output).toContain("Auto-generated");
    expect(output).toContain("DO NOT EDIT");
  });

  it("produces valid TypeScript interface syntax", () => {
    const manifest = {
      name: "velocity",
      contentType: "VelocityContent",
      sections: {
        "@velo/hero": { component: "Hero", contentKey: "hero" },
        "@velo/footer": { component: "Footer", contentKey: "footer" },
      },
    };

    const output = generateContentType(manifest);

    // Should have proper interface declaration
    expect(output).toMatch(/export interface VelocityContent \{/);
    // Should close the interface
    expect(output).toContain("}");
  });
});

describe("generateAllContentTypes", () => {
  it("generates types for all templates in apps/", async () => {
    const { generateAllContentTypes } = await import("../src/generate-types");
    const { resolve, dirname } = await import("node:path");
    const { fileURLToPath } = await import("node:url");

    const root = resolve(dirname(fileURLToPath(import.meta.url)), "../../..");
    const results = generateAllContentTypes(root);

    // Should generate for all 6 templates
    expect(Object.keys(results).length).toBe(6);
    expect(results["velocity"]).toContain("VelocityContent");
    expect(results["ember"]).toContain("EmberContent");
    expect(results["haven"]).toContain("HavenContent");
    expect(results["nexus"]).toContain("NexusContent");
    expect(results["prism"]).toContain("PrismContent");
    expect(results["serenity"]).toContain("SerenityContent");
  });
});

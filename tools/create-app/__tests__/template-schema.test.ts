import { describe, it, expect } from "vitest";
import { templateManifestSchema } from "../src/template-schema";

describe("templateManifestSchema", () => {
  const validManifest = {
    name: "velocity",
    displayName: "Velocity",
    description: "Athletic/Sportswear — Cinematic Dark theme",
    businessType: "Athletic/Sportswear",
    style: "Cinematic Dark",
    contentType: "VelocityContent",
    sections: {
      "@velo/hero": {
        component: "Hero",
        configExport: "heroScrollConfig",
        contentKey: "hero",
      },
      "@velo/footer": {
        component: "Footer",
        configExport: "footerScrollConfig",
        contentKey: "footer",
      },
    },
  };

  it("accepts a valid template manifest", () => {
    const result = templateManifestSchema.safeParse(validManifest);
    expect(result.success).toBe(true);
  });

  it("accepts a section with extraProps", () => {
    const manifest = {
      ...validManifest,
      sections: {
        "@velo/footer": {
          component: "Footer",
          configExport: "footerScrollConfig",
          contentKey: "footer",
          extraProps: { localeSwitcher: true },
        },
      },
    };
    const result = templateManifestSchema.safeParse(manifest);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.sections["@velo/footer"].extraProps).toEqual({
        localeSwitcher: true,
      });
    }
  });

  it("rejects missing name", () => {
    const { name, ...noName } = validManifest;
    const result = templateManifestSchema.safeParse(noName);
    expect(result.success).toBe(false);
  });

  it("rejects missing displayName", () => {
    const { displayName, ...noDisplayName } = validManifest;
    const result = templateManifestSchema.safeParse(noDisplayName);
    expect(result.success).toBe(false);
  });

  it("rejects missing contentType", () => {
    const { contentType, ...noContentType } = validManifest;
    const result = templateManifestSchema.safeParse(noContentType);
    expect(result.success).toBe(false);
  });

  it("rejects empty sections", () => {
    const result = templateManifestSchema.safeParse({
      ...validManifest,
      sections: {},
    });
    expect(result.success).toBe(false);
  });

  it("rejects section missing component", () => {
    const result = templateManifestSchema.safeParse({
      ...validManifest,
      sections: {
        "@velo/hero": {
          configExport: "heroScrollConfig",
          contentKey: "hero",
        },
      },
    });
    expect(result.success).toBe(false);
  });

  it("rejects section missing configExport", () => {
    const result = templateManifestSchema.safeParse({
      ...validManifest,
      sections: {
        "@velo/hero": {
          component: "Hero",
          contentKey: "hero",
        },
      },
    });
    expect(result.success).toBe(false);
  });

  it("rejects section missing contentKey", () => {
    const result = templateManifestSchema.safeParse({
      ...validManifest,
      sections: {
        "@velo/hero": {
          component: "Hero",
          configExport: "heroScrollConfig",
        },
      },
    });
    expect(result.success).toBe(false);
  });

  it("rejects non-string section values", () => {
    const result = templateManifestSchema.safeParse({
      ...validManifest,
      sections: {
        "@velo/hero": {
          component: 123,
          configExport: "heroScrollConfig",
          contentKey: "hero",
        },
      },
    });
    expect(result.success).toBe(false);
  });

  it("provides clear error for missing required field", () => {
    const { name, ...noName } = validManifest;
    const result = templateManifestSchema.safeParse(noName);
    expect(result.success).toBe(false);
    if (!result.success) {
      const messages = result.error.issues.map((i) => i.message);
      expect(messages.some((m) => m.toLowerCase().includes("required") || m.toLowerCase().includes("name"))).toBe(true);
    }
  });
});

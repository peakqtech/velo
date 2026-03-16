import { describe, it, expect } from "vitest";
import {
  contactFormSchema,
  leadCaptureSchema,
  newsletterSchema,
} from "../src/schema";
import { validateFormSubmission, createSubmission } from "../src/handlers";
import { formsIntegration } from "../src/config";

/* -------------------------------------------------------------------------- */
/*  contactFormSchema                                                         */
/* -------------------------------------------------------------------------- */

describe("contactFormSchema", () => {
  it("validates valid data", () => {
    const result = contactFormSchema.safeParse({
      name: "Jane Doe",
      email: "jane@example.com",
      message: "Hello!",
    });
    expect(result.success).toBe(true);
  });

  it("rejects missing name", () => {
    const result = contactFormSchema.safeParse({
      email: "jane@example.com",
      message: "Hello!",
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid email", () => {
    const result = contactFormSchema.safeParse({
      name: "Jane",
      email: "not-an-email",
      message: "Hello!",
    });
    expect(result.success).toBe(false);
  });

  it("rejects honeypot with value (bot detection)", () => {
    const result = contactFormSchema.safeParse({
      name: "Bot",
      email: "bot@spam.com",
      message: "Buy stuff",
      _hp: "gotcha",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const hpIssue = result.error.issues.find((i) => i.path.includes("_hp"));
      expect(hpIssue).toBeDefined();
      expect(hpIssue!.message).toBe("Bot detected");
    }
  });

  it("rejects message longer than 5000 chars", () => {
    const result = contactFormSchema.safeParse({
      name: "Jane",
      email: "jane@example.com",
      message: "a".repeat(5001),
    });
    expect(result.success).toBe(false);
  });
});

/* -------------------------------------------------------------------------- */
/*  leadCaptureSchema                                                         */
/* -------------------------------------------------------------------------- */

describe("leadCaptureSchema", () => {
  it("validates valid data", () => {
    const result = leadCaptureSchema.safeParse({
      name: "John Smith",
      email: "john@corp.com",
      company: "Acme Inc",
      interest: "demo",
    });
    expect(result.success).toBe(true);
  });
});

/* -------------------------------------------------------------------------- */
/*  newsletterSchema                                                          */
/* -------------------------------------------------------------------------- */

describe("newsletterSchema", () => {
  it("validates valid email", () => {
    const result = newsletterSchema.safeParse({ email: "reader@news.com" });
    expect(result.success).toBe(true);
  });

  it("rejects invalid email", () => {
    const result = newsletterSchema.safeParse({ email: "nope" });
    expect(result.success).toBe(false);
  });
});

/* -------------------------------------------------------------------------- */
/*  validateFormSubmission                                                    */
/* -------------------------------------------------------------------------- */

describe("validateFormSubmission", () => {
  it("returns success with clean data (no _hp field)", () => {
    const result = validateFormSubmission("contact", {
      name: "Jane",
      email: "jane@example.com",
      message: "Hi there",
      _hp: "",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).not.toHaveProperty("_hp");
      expect(result.data).toEqual({
        name: "Jane",
        email: "jane@example.com",
        message: "Hi there",
      });
    }
  });

  it("returns errors for invalid data", () => {
    const result = validateFormSubmission("contact", { name: "" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(Object.keys(result.errors).length).toBeGreaterThan(0);
    }
  });

  it("returns error for unknown form type", () => {
    const result = validateFormSubmission("unknown" as any, {});
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.errors._form).toContain("Unknown form type");
    }
  });
});

/* -------------------------------------------------------------------------- */
/*  createSubmission                                                          */
/* -------------------------------------------------------------------------- */

describe("createSubmission", () => {
  it("creates a submission with correct shape", () => {
    const submission = createSubmission("site-123", "contact", {
      name: "Jane",
      email: "jane@example.com",
      message: "Hello",
    });

    expect(submission.id).toBeDefined();
    expect(typeof submission.id).toBe("string");
    expect(submission.siteId).toBe("site-123");
    expect(submission.formType).toBe("contact");
    expect(submission.data).toEqual({
      name: "Jane",
      email: "jane@example.com",
      message: "Hello",
    });
    expect(submission.submittedAt).toBeDefined();
    expect(new Date(submission.submittedAt).toISOString()).toBe(submission.submittedAt);
  });
});

/* -------------------------------------------------------------------------- */
/*  formsIntegration                                                          */
/* -------------------------------------------------------------------------- */

describe("formsIntegration", () => {
  it("has correct name and category", () => {
    expect(formsIntegration.name).toBe("@velo/integration-forms");
    expect(formsIntegration.category).toBe("forms");
    expect(formsIntegration.displayName).toBe("Forms & Lead Capture");
  });
});

import { contactFormSchema, leadCaptureSchema, newsletterSchema } from "./schema";
import type { FormsConfig } from "./config";

export interface FormSubmission {
  id: string;
  siteId: string;
  formType: "contact" | "lead" | "newsletter";
  data: Record<string, unknown>;
  submittedAt: string;
  ip?: string;
}

export interface FormSubmitResult {
  success: boolean;
  message: string;
  submissionId?: string;
  errors?: Record<string, string>;
}

const SCHEMAS = {
  contact: contactFormSchema,
  lead: leadCaptureSchema,
  newsletter: newsletterSchema,
} as const;

export function validateFormSubmission(
  formType: keyof typeof SCHEMAS,
  data: unknown
): { success: true; data: Record<string, unknown> } | { success: false; errors: Record<string, string> } {
  const schema = SCHEMAS[formType];
  if (!schema) {
    return { success: false, errors: { _form: `Unknown form type: ${formType}` } };
  }

  const result = schema.safeParse(data);
  if (!result.success) {
    const errors: Record<string, string> = {};
    for (const issue of result.error.issues) {
      const path = issue.path.join(".") || "_form";
      errors[path] = issue.message;
    }
    return { success: false, errors };
  }

  // Remove honeypot field from stored data
  const { _hp, ...cleanData } = result.data as Record<string, unknown>;
  return { success: true, data: cleanData };
}

export function createSubmission(
  siteId: string,
  formType: "contact" | "lead" | "newsletter",
  data: Record<string, unknown>
): FormSubmission {
  return {
    id: crypto.randomUUID(),
    siteId,
    formType,
    data,
    submittedAt: new Date().toISOString(),
  };
}

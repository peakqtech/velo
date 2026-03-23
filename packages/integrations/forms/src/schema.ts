import { z } from "zod";

export const contactFormSchema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  email: z.string().email("Invalid email"),
  phone: z.string().optional(),
  subject: z.string().max(500).optional(),
  message: z.string().min(1, "Message is required").max(5000),
  _hp: z.string().max(0, "Bot detected").optional(), // honeypot
});

export const leadCaptureSchema = z.object({
  name: z.string().min(1).max(200),
  email: z.string().email(),
  company: z.string().optional(),
  phone: z.string().optional(),
  interest: z.string().optional(),
  _hp: z.string().max(0).optional(),
});

export const newsletterSchema = z.object({
  email: z.string().email("Invalid email"),
  _hp: z.string().max(0).optional(),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;
export type LeadCaptureData = z.infer<typeof leadCaptureSchema>;
export type NewsletterData = z.infer<typeof newsletterSchema>;

"use client";

import { useState, type FormEvent } from "react";

interface FormProps {
  onSubmit?: (data: Record<string, unknown>) => void;
  action?: string;
  className?: string;
}

/* -------------------------------------------------------------------------- */
/*  ContactForm                                                               */
/* -------------------------------------------------------------------------- */

export function ContactForm({
  onSubmit,
  action = "/api/integrations/forms/submit",
  className,
}: FormProps) {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setErrors({});

    const fd = new FormData(e.currentTarget);
    const data: Record<string, unknown> = {
      name: fd.get("name"),
      email: fd.get("email"),
      subject: fd.get("subject"),
      message: fd.get("message"),
      _hp: fd.get("_hp"),
    };

    onSubmit?.(data);

    try {
      const res = await fetch(action, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ formType: "contact", data }),
      });
      const json = await res.json();

      if (json.success) {
        setStatus("success");
        setSuccessMessage(json.message ?? "Thank you! We'll be in touch.");
        (e.target as HTMLFormElement).reset();
      } else {
        setStatus("error");
        setErrors(json.errors ?? { _form: "Submission failed" });
      }
    } catch {
      setStatus("error");
      setErrors({ _form: "Network error. Please try again." });
    }
  }

  if (status === "success") {
    return (
      <div className={className} role="status" aria-live="polite">
        <p className="text-foreground text-lg font-medium">{successMessage}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={className} noValidate>
      {/* Honeypot — visually hidden */}
      <div aria-hidden="true" style={{ position: "absolute", left: "-9999px" }}>
        <label htmlFor="contact-hp">Do not fill this</label>
        <input type="text" id="contact-hp" name="_hp" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="flex flex-col gap-4">
        <div>
          <label htmlFor="contact-name" className="block text-sm font-medium text-foreground mb-1">
            Name *
          </label>
          <input
            id="contact-name"
            name="name"
            type="text"
            required
            aria-required="true"
            aria-invalid={!!errors.name}
            className="w-full rounded border border-foreground/20 bg-background px-3 py-2 text-foreground placeholder:text-foreground/50 focus:outline-none focus:ring-2 focus:ring-foreground/30"
          />
          {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
        </div>

        <div>
          <label htmlFor="contact-email" className="block text-sm font-medium text-foreground mb-1">
            Email *
          </label>
          <input
            id="contact-email"
            name="email"
            type="email"
            required
            aria-required="true"
            aria-invalid={!!errors.email}
            className="w-full rounded border border-foreground/20 bg-background px-3 py-2 text-foreground placeholder:text-foreground/50 focus:outline-none focus:ring-2 focus:ring-foreground/30"
          />
          {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
        </div>

        <div>
          <label htmlFor="contact-subject" className="block text-sm font-medium text-foreground mb-1">
            Subject
          </label>
          <input
            id="contact-subject"
            name="subject"
            type="text"
            className="w-full rounded border border-foreground/20 bg-background px-3 py-2 text-foreground placeholder:text-foreground/50 focus:outline-none focus:ring-2 focus:ring-foreground/30"
          />
          {errors.subject && <p className="mt-1 text-sm text-red-600">{errors.subject}</p>}
        </div>

        <div>
          <label htmlFor="contact-message" className="block text-sm font-medium text-foreground mb-1">
            Message *
          </label>
          <textarea
            id="contact-message"
            name="message"
            required
            aria-required="true"
            aria-invalid={!!errors.message}
            rows={5}
            className="w-full rounded border border-foreground/20 bg-background px-3 py-2 text-foreground placeholder:text-foreground/50 focus:outline-none focus:ring-2 focus:ring-foreground/30"
          />
          {errors.message && <p className="mt-1 text-sm text-red-600">{errors.message}</p>}
        </div>

        {errors._form && <p className="text-sm text-red-600">{errors._form}</p>}

        <button
          type="submit"
          disabled={status === "submitting"}
          className="rounded bg-foreground px-6 py-2 text-background font-medium hover:opacity-90 disabled:opacity-50 transition-opacity"
        >
          {status === "submitting" ? "Sending..." : "Send Message"}
        </button>
      </div>
    </form>
  );
}

/* -------------------------------------------------------------------------- */
/*  LeadCaptureForm                                                           */
/* -------------------------------------------------------------------------- */

export function LeadCaptureForm({
  onSubmit,
  action = "/api/integrations/forms/submit",
  className,
}: FormProps) {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setErrors({});

    const fd = new FormData(e.currentTarget);
    const data: Record<string, unknown> = {
      name: fd.get("name"),
      email: fd.get("email"),
      company: fd.get("company"),
      interest: fd.get("interest"),
      _hp: fd.get("_hp"),
    };

    onSubmit?.(data);

    try {
      const res = await fetch(action, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ formType: "lead", data }),
      });
      const json = await res.json();

      if (json.success) {
        setStatus("success");
        setSuccessMessage(json.message ?? "Thank you! We'll be in touch.");
        (e.target as HTMLFormElement).reset();
      } else {
        setStatus("error");
        setErrors(json.errors ?? { _form: "Submission failed" });
      }
    } catch {
      setStatus("error");
      setErrors({ _form: "Network error. Please try again." });
    }
  }

  if (status === "success") {
    return (
      <div className={className} role="status" aria-live="polite">
        <p className="text-foreground text-lg font-medium">{successMessage}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={className} noValidate>
      {/* Honeypot */}
      <div aria-hidden="true" style={{ position: "absolute", left: "-9999px" }}>
        <label htmlFor="lead-hp">Do not fill this</label>
        <input type="text" id="lead-hp" name="_hp" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="flex flex-col gap-4">
        <div>
          <label htmlFor="lead-name" className="block text-sm font-medium text-foreground mb-1">
            Name *
          </label>
          <input
            id="lead-name"
            name="name"
            type="text"
            required
            aria-required="true"
            aria-invalid={!!errors.name}
            className="w-full rounded border border-foreground/20 bg-background px-3 py-2 text-foreground placeholder:text-foreground/50 focus:outline-none focus:ring-2 focus:ring-foreground/30"
          />
          {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
        </div>

        <div>
          <label htmlFor="lead-email" className="block text-sm font-medium text-foreground mb-1">
            Email *
          </label>
          <input
            id="lead-email"
            name="email"
            type="email"
            required
            aria-required="true"
            aria-invalid={!!errors.email}
            className="w-full rounded border border-foreground/20 bg-background px-3 py-2 text-foreground placeholder:text-foreground/50 focus:outline-none focus:ring-2 focus:ring-foreground/30"
          />
          {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
        </div>

        <div>
          <label htmlFor="lead-company" className="block text-sm font-medium text-foreground mb-1">
            Company
          </label>
          <input
            id="lead-company"
            name="company"
            type="text"
            className="w-full rounded border border-foreground/20 bg-background px-3 py-2 text-foreground placeholder:text-foreground/50 focus:outline-none focus:ring-2 focus:ring-foreground/30"
          />
        </div>

        <div>
          <label htmlFor="lead-interest" className="block text-sm font-medium text-foreground mb-1">
            Interest
          </label>
          <select
            id="lead-interest"
            name="interest"
            aria-label="Area of interest"
            className="w-full rounded border border-foreground/20 bg-background px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/30"
          >
            <option value="">Select an option</option>
            <option value="product">Product Information</option>
            <option value="pricing">Pricing</option>
            <option value="demo">Request a Demo</option>
            <option value="partnership">Partnership</option>
            <option value="other">Other</option>
          </select>
        </div>

        {errors._form && <p className="text-sm text-red-600">{errors._form}</p>}

        <button
          type="submit"
          disabled={status === "submitting"}
          className="rounded bg-foreground px-6 py-2 text-background font-medium hover:opacity-90 disabled:opacity-50 transition-opacity"
        >
          {status === "submitting" ? "Submitting..." : "Get in Touch"}
        </button>
      </div>
    </form>
  );
}

/* -------------------------------------------------------------------------- */
/*  NewsletterForm                                                            */
/* -------------------------------------------------------------------------- */

export function NewsletterForm({
  onSubmit,
  action = "/api/integrations/forms/submit",
  className,
}: FormProps) {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setErrors({});

    const fd = new FormData(e.currentTarget);
    const data: Record<string, unknown> = {
      email: fd.get("email"),
      _hp: fd.get("_hp"),
    };

    onSubmit?.(data);

    try {
      const res = await fetch(action, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ formType: "newsletter", data }),
      });
      const json = await res.json();

      if (json.success) {
        setStatus("success");
        setSuccessMessage(json.message ?? "You're subscribed!");
        (e.target as HTMLFormElement).reset();
      } else {
        setStatus("error");
        setErrors(json.errors ?? { _form: "Submission failed" });
      }
    } catch {
      setStatus("error");
      setErrors({ _form: "Network error. Please try again." });
    }
  }

  if (status === "success") {
    return (
      <div className={className} role="status" aria-live="polite">
        <p className="text-foreground text-lg font-medium">{successMessage}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={className} noValidate>
      {/* Honeypot */}
      <div aria-hidden="true" style={{ position: "absolute", left: "-9999px" }}>
        <label htmlFor="nl-hp">Do not fill this</label>
        <input type="text" id="nl-hp" name="_hp" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="flex gap-2 items-start">
        <div className="flex-1">
          <label htmlFor="nl-email" className="sr-only">
            Email address
          </label>
          <input
            id="nl-email"
            name="email"
            type="email"
            required
            aria-required="true"
            aria-invalid={!!errors.email}
            placeholder="your@email.com"
            className="w-full rounded border border-foreground/20 bg-background px-3 py-2 text-foreground placeholder:text-foreground/50 focus:outline-none focus:ring-2 focus:ring-foreground/30"
          />
          {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
          {errors._form && <p className="mt-1 text-sm text-red-600">{errors._form}</p>}
        </div>

        <button
          type="submit"
          disabled={status === "submitting"}
          className="rounded bg-foreground px-6 py-2 text-background font-medium hover:opacity-90 disabled:opacity-50 transition-opacity whitespace-nowrap"
        >
          {status === "submitting" ? "..." : "Subscribe"}
        </button>
      </div>
    </form>
  );
}

import { describe, it, expect } from "vitest";
import { paymentsConfigSchema, paymentsIntegration } from "../src/config";
import { createPaymentAdapter } from "../src/factory";
import { createStripeAdapter } from "../src/adapters/stripe";
import { createXenditAdapter } from "../src/adapters/xendit";
import { createDurianpayAdapter } from "../src/adapters/durianpay";
import { createMidtransAdapter } from "../src/adapters/midtrans";

describe("paymentsConfigSchema", () => {
  it("validates stripe config", () => {
    const result = paymentsConfigSchema.safeParse({
      provider: "stripe",
      stripe: {
        publishableKey: "pk_test_123",
        secretKey: "sk_test_123",
        webhookSecret: "whsec_123",
      },
    });
    expect(result.success).toBe(true);
  });

  it("validates xendit config", () => {
    const result = paymentsConfigSchema.safeParse({
      provider: "xendit",
      xendit: {
        publicKey: "xnd_public_123",
        secretKey: "xnd_secret_123",
        webhookToken: "token_123",
      },
    });
    expect(result.success).toBe(true);
  });

  it("validates durianpay config", () => {
    const result = paymentsConfigSchema.safeParse({
      provider: "durianpay",
      durianpay: {
        accessKey: "dp_access_123",
        secretKey: "dp_secret_123",
      },
    });
    expect(result.success).toBe(true);
  });

  it("validates midtrans config", () => {
    const result = paymentsConfigSchema.safeParse({
      provider: "midtrans",
      midtrans: {
        clientKey: "mid_client_123",
        serverKey: "mid_server_123",
        isProduction: false,
      },
    });
    expect(result.success).toBe(true);
  });

  it("rejects missing provider config", () => {
    const result = paymentsConfigSchema.safeParse({
      provider: "stripe",
      // no stripe config provided
    });
    expect(result.success).toBe(false);
  });

  it("rejects unknown provider", () => {
    const result = paymentsConfigSchema.safeParse({
      provider: "paypal",
    });
    expect(result.success).toBe(false);
  });
});

describe("createPaymentAdapter", () => {
  const stripeConfig = {
    enabled: true,
    provider: "stripe" as const,
    currency: "USD" as const,
    stripe: {
      publishableKey: "pk_test_123",
      secretKey: "sk_test_123",
      webhookSecret: "whsec_123",
    },
  };

  const xenditConfig = {
    enabled: true,
    provider: "xendit" as const,
    currency: "IDR" as const,
    xendit: {
      publicKey: "xnd_public_123",
      secretKey: "xnd_secret_123",
      webhookToken: "token_123",
    },
  };

  const durianpayConfig = {
    enabled: true,
    provider: "durianpay" as const,
    currency: "IDR" as const,
    durianpay: {
      accessKey: "dp_access_123",
      secretKey: "dp_secret_123",
    },
  };

  const midtransConfig = {
    enabled: true,
    provider: "midtrans" as const,
    currency: "IDR" as const,
    midtrans: {
      clientKey: "mid_client_123",
      serverKey: "mid_server_123",
      isProduction: false,
    },
  };

  it("returns stripe adapter", () => {
    const adapter = createPaymentAdapter(stripeConfig);
    expect(adapter.name).toBe("stripe");
    expect(adapter.displayName).toBe("Stripe");
  });

  it("returns xendit adapter", () => {
    const adapter = createPaymentAdapter(xenditConfig);
    expect(adapter.name).toBe("xendit");
    expect(adapter.displayName).toBe("Xendit");
  });

  it("returns durianpay adapter", () => {
    const adapter = createPaymentAdapter(durianpayConfig);
    expect(adapter.name).toBe("durianpay");
    expect(adapter.displayName).toBe("Durianpay");
  });

  it("returns midtrans adapter", () => {
    const adapter = createPaymentAdapter(midtransConfig);
    expect(adapter.name).toBe("midtrans");
    expect(adapter.displayName).toBe("Midtrans");
  });

  it("throws for missing config", () => {
    expect(() =>
      createPaymentAdapter({
        enabled: true,
        provider: "stripe",
        currency: "USD",
      } as any)
    ).toThrow("Stripe configuration is required");
  });
});

describe("adapter supported methods", () => {
  it("stripe adapter has correct supported methods", () => {
    const adapter = createStripeAdapter({
      publishableKey: "pk_test",
      secretKey: "sk_test",
      webhookSecret: "whsec_test",
    });
    expect(adapter.supportedMethods).toEqual(["card", "subscription"]);
  });

  it("xendit adapter has correct supported methods", () => {
    const adapter = createXenditAdapter({
      publicKey: "xnd_public",
      secretKey: "xnd_secret",
      webhookToken: "token",
    });
    expect(adapter.supportedMethods).toEqual(["card", "ewallet", "va", "qris"]);
  });

  it("midtrans adapter has correct supported methods", () => {
    const adapter = createMidtransAdapter({
      clientKey: "mid_client",
      serverKey: "mid_server",
      isProduction: false,
    });
    expect(adapter.supportedMethods).toEqual(["card", "ewallet", "va", "qris", "bank_transfer"]);
  });

  it("durianpay adapter has correct supported methods", () => {
    const adapter = createDurianpayAdapter({
      accessKey: "dp_access",
      secretKey: "dp_secret",
    });
    expect(adapter.supportedMethods).toEqual(["card", "ewallet", "va", "qris", "bank_transfer"]);
  });
});

describe("paymentsIntegration", () => {
  it("has correct name and category", () => {
    expect(paymentsIntegration.name).toBe("@velo/integration-payments");
    expect(paymentsIntegration.category).toBe("payments");
  });
});

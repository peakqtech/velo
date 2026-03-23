export type PaymentMethod = "card" | "ewallet" | "va" | "qris" | "bank_transfer" | "subscription";

export type PaymentProvider = "stripe" | "xendit" | "durianpay" | "midtrans";

export type Currency = "USD" | "IDR" | "SGD" | "MYR" | "PHP" | "THB";

export interface CheckoutParams {
  amount: number;
  currency: Currency;
  description: string;
  customerEmail?: string;
  customerName?: string;
  metadata?: Record<string, string>;
  successUrl: string;
  cancelUrl: string;
  paymentMethods?: PaymentMethod[];
}

export interface CheckoutSession {
  id: string;
  provider: PaymentProvider;
  url: string;
  expiresAt?: string;
}

export interface PaymentEvent {
  id: string;
  provider: PaymentProvider;
  type: "payment.success" | "payment.failed" | "payment.expired" | "refund.success";
  amount: number;
  currency: Currency;
  customerEmail?: string;
  metadata?: Record<string, string>;
  rawEvent: unknown;
}

export interface PaymentStatus {
  id: string;
  provider: PaymentProvider;
  status: "pending" | "paid" | "failed" | "expired" | "refunded";
  amount: number;
  currency: Currency;
  paidAt?: string;
}

export interface PaymentProviderAdapter {
  name: PaymentProvider;
  displayName: string;
  supportedMethods: PaymentMethod[];
  supportedCurrencies: Currency[];

  createCheckout(params: CheckoutParams): Promise<CheckoutSession>;
  handleWebhook(payload: unknown, headers: Record<string, string>): Promise<PaymentEvent>;
  getPaymentStatus(paymentId: string): Promise<PaymentStatus>;
  createBillingPortal?(customerId: string, returnUrl: string): Promise<string>;
}

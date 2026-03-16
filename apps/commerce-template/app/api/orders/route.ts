import { NextRequest, NextResponse } from "next/server";

// In-memory store for demo mode
const orders: Array<{
  id: string;
  orderNumber: string;
  customer: {
    name: string;
    email: string;
    phone: string;
    street: string;
    city: string;
    province: string;
    postalCode: string;
  };
  items: Array<{
    productId: string;
    name: string;
    price: number;
    variant: string;
    quantity: number;
  }>;
  paymentMethod: string;
  subtotal: number;
  shipping: number;
  total: number;
  status: string;
  createdAt: string;
}> = [];

function generateOrderNumber(): string {
  const prefix = "ORD";
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { customer, items, paymentMethod, subtotal, shipping, total } = body;

    // Basic validation
    if (!customer?.name || !customer?.email || !items?.length) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const orderNumber = generateOrderNumber();
    const order = {
      id: crypto.randomUUID(),
      orderNumber,
      customer,
      items,
      paymentMethod,
      subtotal,
      shipping,
      total,
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    // Demo mode: store in memory
    orders.push(order);

    return NextResponse.json({
      orderNumber: order.orderNumber,
      id: order.id,
      status: order.status,
    });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  // For admin use — returns all orders
  return NextResponse.json({ orders });
}

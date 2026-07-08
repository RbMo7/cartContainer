import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

export async function POST(req: Request) {
  try {
    const { sessionId } = await req.json();
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    return NextResponse.json({ status: session.status, paymentStatus: session.payment_status });
  } catch {
    return NextResponse.json({ error: "Failed to retrieve session" }, { status: 500 });
  }
}

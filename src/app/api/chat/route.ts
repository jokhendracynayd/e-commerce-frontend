import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const message: string = body?.message || '';

    // Basic, local assistant logic (placeholder for real AI integration)
    let reply = '';
    const m = message.toLowerCase();
    if (m.includes('shipping') || m.includes('delivery')) {
      reply = 'Shipping typically takes 3-5 business days; you can track orders in your account.';
    } else if (m.includes('return') || m.includes('refund')) {
      reply = 'You can initiate a return from your orders page within 30 days. Refunds are processed within 5-7 business days.';
    } else if (m.includes('recommend') || m.includes('suggest')) {
      reply = 'Check out our trending products on the homepage or view recommendations on each product page.';
    } else if (m.includes('help') || m.includes('support')) {
      reply = 'Sure — how can I help? You can ask about orders, products, returns, or shipping.';
    } else {
      reply = 'I can help with orders, shipping, returns, product info, and recommendations. How can I assist?';
    }

    return NextResponse.json({ reply });
  } catch (error: any) {
    return new NextResponse(JSON.stringify({ error: 'Server error' }), { status: 500 });
  }
}



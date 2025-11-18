import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connect from "@/db";
import Cart from "@/models/cart";

export async function POST() {
  try {
    const session = await getServerSession();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connect();

  
    const User = (await import("@/models/users")).default;
    const user = await User.findOne({ email: session.user.email });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

 
    const cart = await Cart.findOne({ userId: user._id });

    if (!cart || cart.items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }


    const orderData = {
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: "USD",
            value: cart.totalAmount.toFixed(2),
            breakdown: {
              item_total: {
                currency_code: "USD",
                value: cart.totalAmount.toFixed(2),
              },
            },
          },
          items: cart.items.map((item: { title: string; quantity: number; price: number }) => ({
            name: item.title,
            quantity: item.quantity.toString(),
            unit_amount: {
              currency_code: "USD",
              value: item.price.toFixed(2),
            },
          })),
        },
      ],
      application_context: {
        return_url: `${process.env.NEXTAUTH_URL}/checkout/success`,
        cancel_url: `${process.env.NEXTAUTH_URL}/checkout/cancel`,
      },
    };

    
    const mockOrderId = `PAYPAL-${Date.now()}`;

    return NextResponse.json({
      orderId: mockOrderId,
      orderData,
    });
  } catch (error) {
    console.error("PayPal order creation error:", error);
    return NextResponse.json({ error: "Order creation failed" }, { status: 500 });
  }
}
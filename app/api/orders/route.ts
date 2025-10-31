import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connect from "@/db";
import Order from "@/models/order";
import Cart from "@/models/cart";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { shippingAddress, paymentMethod, paymentIntentId, paypalOrderId } = await req.json();

    await connect();

    // Find user by email
    const User = (await import("@/models/users")).default;
    const user = await User.findOne({ email: session.user.email });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get cart
    const cart = await Cart.findOne({ userId: user._id });

    if (!cart || cart.items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    // Calculate totals
    const subtotal = cart.totalAmount;
    const tax = subtotal * 0.08; // 8% tax
    const shipping = subtotal > 100 ? 0 : 10; // Free shipping over $100
    const totalAmount = subtotal + tax + shipping;

    // Create order
    const order = await Order.create({
      userId: user._id,
      items: cart.items,
      shippingAddress,
      paymentMethod,
      paymentStatus: 'paid',
      subtotal,
      tax,
      shipping,
      totalAmount,
      stripePaymentIntentId: paymentIntentId,
      paypalOrderId,
    });

    // Clear cart
    await Cart.findByIdAndDelete(cart._id);

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Order creation failed" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const session = await getServerSession();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connect();

    // Find user by email
    const User = (await import("@/models/users")).default;
    const user = await User.findOne({ email: session.user.email });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const orders = await Order.find({ userId: user._id }).sort({ createdAt: -1 });

    return NextResponse.json(orders, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connect from "@/db";
import Cart from "@/models/cart";

// PUT - Update item quantity in cart
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ itemId: string }> }
) {
  try {
    const session = await getServerSession();
    const { quantity } = await req.json();

    if (quantity < 1) {
      return NextResponse.json({ error: "Quantity must be at least 1" }, { status: 400 });
    }

    await connect();

    let cart;

    if (session?.user) {
      // User is logged in
      const User = (await import("@/models/users")).default;
      const user = await User.findOne({ email: session.user.email });

      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      cart = await Cart.findOne({ userId: user._id });
    } else {
      // Anonymous user
      const cookies = req.cookies;
      const sessionId = cookies.get('cart-session-id')?.value;

      if (!sessionId) {
        return NextResponse.json({ error: "No cart session found" }, { status: 404 });
      }

      cart = await Cart.findOne({ sessionId });
    }

    if (!cart) {
      return NextResponse.json({ error: "Cart not found" }, { status: 404 });
    }

    // Find item in cart
    const resolvedParams = await params;
    const itemIndex = cart.items.findIndex(
      (item: { _id: string }) => item._id.toString() === resolvedParams.itemId
    );

    if (itemIndex === -1) {
      return NextResponse.json({ error: "Item not found in cart" }, { status: 404 });
    }

    // Update quantity
    cart.items[itemIndex].quantity = quantity;

    await cart.save();

    return NextResponse.json(cart, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// DELETE - Remove item from cart
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ itemId: string }> }
) {
  try {
    const session = await getServerSession();

    await connect();

    let cart;

    if (session?.user) {
      // User is logged in
      const User = (await import("@/models/users")).default;
      const user = await User.findOne({ email: session.user.email });

      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      cart = await Cart.findOne({ userId: user._id });
    } else {
      // Anonymous user
      const cookies = req.cookies;
      const sessionId = cookies.get('cart-session-id')?.value;

      if (!sessionId) {
        return NextResponse.json({ error: "No cart session found" }, { status: 404 });
      }

      cart = await Cart.findOne({ sessionId });
    }

    if (!cart) {
      return NextResponse.json({ error: "Cart not found" }, { status: 404 });
    }

    // Remove item from cart
    const resolvedParams = await params;
    cart.items = cart.items.filter(
      (item: { _id: string }) => item._id.toString() !== resolvedParams.itemId
    );

    await cart.save();

    return NextResponse.json(cart, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
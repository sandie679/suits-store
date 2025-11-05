import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connect from "@/db";
import Cart from "@/models/cart";
import Post from "@/models/post";
import Wedding from "@/models/wedding";
import Womensware from "@/models/womensware";


export async function GET() {
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

    const cart = await Cart.findOne({ userId: user._id }).populate('items.productId');

    if (!cart) {
      return NextResponse.json({ items: [], totalAmount: 0 }, { status: 200 });
    }

    return NextResponse.json(cart, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}


export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { productId, quantity = 1 } = await req.json();

    if (!productId) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
    }

    await connect();

   
    const User = (await import("@/models/users")).default;
    const user = await User.findOne({ email: session.user.email });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    
    let product = await Post.findById(productId);
    if (!product) {
      product = await Wedding.findById(productId);
    }
    if (!product) {
      product = await Womensware.findById(productId);
    }
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    console.log('Product found:', { productId, price: product.price, priceType: typeof product.price });

    
    let cart = await Cart.findOne({ userId: user._id });

    if (!cart) {
      cart = new Cart({
        userId: user._id,
        items: [],
        totalAmount: 0,
      });
    }

    const existingItemIndex = cart.items.findIndex(
      (item: { productId: string }) => item.productId.toString() === productId
    );

    if (existingItemIndex > -1) {
     
      cart.items[existingItemIndex].quantity += quantity;
    } else {
    
      const parsedPrice = parseFloat(product.price.replace(/[^0-9.-]/g, '')) || 0;
      console.log('Parsed price:', { original: product.price, parsed: parsedPrice });
      cart.items.push({
        productId,
        quantity,
        price: parsedPrice,
        title: product.description || 'Untitled',
        imageUrl: product.imageUrl,
      });
    }

    await cart.save();

    return NextResponse.json(cart, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
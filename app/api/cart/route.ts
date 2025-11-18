import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connect from "@/db";
import Cart from "@/models/cart";
import Post from "@/models/post";
import Wedding from "@/models/wedding";
import Womensware from "@/models/womensware";
import Mensware from "@/models/mensware";


export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession();
    const cookies = req.cookies;
    const cartSessionId = cookies.get('cart-session-id')?.value;

    await connect();

    let cart;

    if (session?.user) {
      
      const User = (await import("@/models/users")).default;
      const user = await User.findOne({ email: session.user.email });

      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      cart = await Cart.findOne({ userId: user._id }).populate('items.productId');

      // If user has no cart but there's an anonymous cart, merge them
      if (!cart && cartSessionId) {
        const anonymousCart = await Cart.findOne({ sessionId: cartSessionId });
        if (anonymousCart) {
          // Transfer anonymous cart to user
          anonymousCart.userId = user._id;
          anonymousCart.sessionId = undefined;
          await anonymousCart.save();
          cart = anonymousCart;
        }
      }
    } else {

      if (!cartSessionId) {

        return NextResponse.json({ items: [], totalAmount: 0 }, { status: 200 });
      }
      cart = await Cart.findOne({ sessionId: cartSessionId }).populate('items.productId');
    }

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
    const { productId, quantity = 1 } = await req.json();

    if (!productId) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
    }

    await connect();

   
    let product = await Post.findById(productId);
    if (!product) {
      product = await Wedding.findById(productId);
    }
    if (!product) {
      product = await Womensware.findById(productId);
    }
    if (!product) {
      product = await Mensware.findById(productId);
    }
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    console.log('Product found:', { productId, price: product.price, priceType: typeof product.price });

    let cart;
    let response = NextResponse.json({}, { status: 200 });

    if (session?.user) {
     
      const User = (await import("@/models/users")).default;
      const user = await User.findOne({ email: session.user.email });

      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      cart = await Cart.findOne({ userId: user._id });
      if (!cart) {
        cart = new Cart({
          userId: user._id,
          items: [],
          totalAmount: 0,
        });
      }
    } else {

      const cookies = req.cookies;
      let cartSessionId = cookies.get('cart-session-id')?.value;

      if (!cartSessionId) {
        cartSessionId = `anon_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        response.cookies.set('cart-session-id', cartSessionId, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 60 * 60 * 24 * 30,
        });
      }

      cart = await Cart.findOne({ sessionId: cartSessionId });
      if (!cart) {
        cart = new Cart({
          sessionId: cartSessionId,
          items: [],
          totalAmount: 0,
        });
      }
    }

    const existingItemIndex = cart.items.findIndex(
      (item: { productId: string }) => item.productId.toString() === productId
    );

    if (existingItemIndex > -1) {
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      const parsedPrice = typeof product.price === 'string' ? (parseFloat(product.price.replace(/[^0-9.-]/g, '')) || 0) : (product.price || 0);
      console.log('Parsed price:', { original: product.price, parsed: parsedPrice });
      cart.items.push({
        productId,
        quantity,
        price: parsedPrice,
        title: product.title || product.description || 'Untitled',
        imageUrl: product.imageUrl,
      });
    }

    await cart.save();

    
    response = NextResponse.json(cart, { status: 200 });
    if (!session?.user && !req.cookies.get('cart-session-id')) {

      const cartSessionId = cart.sessionId;
      response.cookies.set('cart-session-id', cartSessionId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 30,
      });
    }

    return response;
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
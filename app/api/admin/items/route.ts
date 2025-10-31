import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connect from "@/db";
import Post from "@/models/post";

export async function GET() {
  try {
    const session = await getServerSession();

    if (!session || session.user?.email !== process.env.ADMIN_EMAIL?.replace(/"/g, '')) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connect();
    const items = await Post.find({});
    return NextResponse.json(items, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession();

    if (!session || session.user?.email !== process.env.ADMIN_EMAIL?.replace(/"/g, '')) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { description, price, imageUrl, link } = await req.json();

    if (!description || !price || !imageUrl || !link) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    await connect();
    const newItem = await Post.create({ description, price, imageUrl, link });
    return NextResponse.json(newItem, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
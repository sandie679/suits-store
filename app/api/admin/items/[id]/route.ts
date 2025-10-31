import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connect from "@/db";
import Post from "@/models/post";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession();

    if (!session || session.user?.email !== process.env.ADMIN_EMAIL?.replace(/"/g, '')) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connect();
    const resolvedParams = await params;
    const deletedItem = await Post.findByIdAndDelete(resolvedParams.id);

    if (!deletedItem) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Item deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession();

    if (!session || session.user?.email !== process.env.ADMIN_EMAIL?.replace(/"/g, '')) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { description, price, imageUrl, link } = await req.json();

    await connect();
    const resolvedParams = await params;
    const updatedItem = await Post.findByIdAndUpdate(
      resolvedParams.id,
      { description, price, imageUrl, link },
      { new: true }
    );

    if (!updatedItem) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    return NextResponse.json(updatedItem, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
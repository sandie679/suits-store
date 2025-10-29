import { NextResponse } from "next/server";
import connect from "@/db";
import Post from "@/models/post";

export const GET = async () => {
  try {
    await connect();
    const posts = await Post.find({});
    return new NextResponse(JSON.stringify(posts), { status: 200 });
  } catch (err) {
    console.error("Database Error:", err);
    return new NextResponse("Database Error", { status: 500 });
  }
};

import { NextResponse } from "next/server";
import connect from "@/db";
import Post from "@/models/post";

export const GET = async () => {
  try {
    await connect();
    const posts = await Post.find({});
    
    const transformedPosts = posts.map(post => ({
      _id: post._id,
      title: post.description || 'Untitled Item',
      price: post.price,
      imageUrl: post.imageUrl,
      images: post.images || [post.imageUrl],
      description: post.description,
      link: post.link,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt
    }));
    return new NextResponse(JSON.stringify(transformedPosts), { status: 200 });
  } catch (err) {
    console.error("Database Error:", err);
    return new NextResponse("Database Error", { status: 500 });
  }
};

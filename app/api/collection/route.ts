import { NextResponse } from "next/server";
import connect from "@/db";
import collection from "@/models/collection";

export const GET = async () => {
  try {
    await connect();
    const collections = await collection.find({});
    return new NextResponse(JSON.stringify(collections), { status: 200 });
  } catch (err) {
    console.error("Database Error:", err);
    return new NextResponse("Database Error", { status: 500 });
  }
};

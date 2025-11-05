import { NextResponse } from "next/server";
import connect from "@/db";
import Wedding from "@/models/wedding";

export const GET = async () => {
  try {
    await connect();
    const weddings = await Wedding.find({});
    return new NextResponse(JSON.stringify(weddings), { status: 200 });
  } catch (err) {
    console.error("Database Error:", err);
    return new NextResponse("Database Error", { status: 500 });
  }
};

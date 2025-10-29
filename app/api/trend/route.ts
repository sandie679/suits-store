import { NextResponse } from "next/server";
import connect from "@/db";
import Trend from "@/models/trend";

export const GET = async () => {
  try {
    await connect();
    const trends = await Trend.find({});
    return new NextResponse(JSON.stringify(trends), { status: 200 });
  } catch (err) {
    console.error("Database Error:", err);
    return new NextResponse("Database Error", { status: 500 });
  }
};

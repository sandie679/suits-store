import { NextResponse } from "next/server";
import connect from "@/db";
import Discount from "@/models/discount";

export const GET = async () => {
  try {
    await connect();
    const discounts = await Discount.find({});
    return new NextResponse(JSON.stringify(discounts), { status: 200 });
  } catch (err) {
    console.error("Database Error:", err);
    return new NextResponse("Database Error", { status: 500 });
  }
};

import { NextResponse } from "next/server";
import connect from "@/db";
import Womensware from "@/models/womensware";

export const GET = async () => {
  try {
    await connect();
    const womenwares = await Womensware.find({});
    return new NextResponse(JSON.stringify(womenwares), { status: 200 });
  } catch (err) {
    console.error("Database Error:", err);
    return new NextResponse("Database Error", { status: 500 });
  }
};

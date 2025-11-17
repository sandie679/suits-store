import { NextResponse } from "next/server";
import connect from "@/db";
import mensware from "@/models/mensware";

export const GET = async () => {
  try {
    await connect();
    const menswareItems = await mensware.find({});
    return new NextResponse(JSON.stringify(menswareItems), { status: 200 });
  } catch (err) {
    console.error("Database Error:", err);
    return new NextResponse("Database Error", { status: 500 });
  }
};
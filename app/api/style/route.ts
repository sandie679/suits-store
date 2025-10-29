import { NextResponse } from "next/server";
import connect from "@/db";
import Style from "@/models/style";

export const GET = async () => {
  try {
    await connect();
    const styles = await Style.find({});
    return new NextResponse(JSON.stringify(styles), { status: 200 });
  } catch (err) {
    console.error("Database Error:", err);
    return new NextResponse("Database Error", { status: 500 });
  }
};

import { NextResponse } from "next/server";
import connect from "@/db";
import User from "@/models/users";

export const GET = async () => {
  try {
    await connect();
    const users = await User.find({});
    return NextResponse.json(users, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Database Error" }, { status: 500 });
  }
};
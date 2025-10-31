import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connect from "@/db";
import User from "@/models/users";

export async function GET() {
  try {
    const session = await getServerSession();

    if (!session || session.user?.email !== process.env.ADMIN_EMAIL?.replace(/"/g, '')) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connect();
    const users = await User.find({});
    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
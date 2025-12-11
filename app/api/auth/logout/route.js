import { NextResponse } from "next/server";
import { connectDB } from "@/lib/databaseConnection";

export async function POST() {
  await connectDB();

  const res = NextResponse.json({
    success: true,
    statusCode: 200,
    message: "Logout successful",
  });

  res.cookies.set("access_token", "", {
    httpOnly: true,
    path: "/",
    maxAge: 0,
  });

  return res;
}

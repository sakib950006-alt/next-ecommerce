import { connectDB } from "@/lib/databaseConnection";
import { catchError } from "@/lib/helperFunction";
import UserModel from "@/models/User.model";
import { jwtVerify } from "jose";

function response(success, message, statusCode = 200) {
  return new Response(JSON.stringify({ success, message }), {
    status: statusCode,
    headers: { "Content-Type": "application/json" },
  });
}

export async function POST(request) {
  try {
    await connectDB();

    const { token } = await request.json();
    if (!token) {
      return response(false, "Token is required", 400);
    }

    const secret = new TextEncoder().encode(process.env.SECRET_KEY);
    const decoded = await jwtVerify(token, secret);
    const userId = decoded.payload.userId;

    const user = await UserModel.findById(userId);
    if (!user) {
      return response(false, "User not found", 404);
    }

    user.isEmailVerified = true;
    await user.save();

    return response(true, "Email verified successfully", 200);

  } catch (error) {
    return catchError(error);
  }
}

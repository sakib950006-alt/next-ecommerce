// api/auth/verify-otp/route.js

import { cookies } from "next/headers";
import { SignJWT } from "jose";
import { connectDB } from "@/lib/databaseConnection";
import OtpModel from "@/models/Otp.model";
import UserModel from "@/models/User.model";
import { zSchema } from "@/lib/zodSchema";
import { catchError, response } from "@/lib/helperFunction";

export async function POST(request) {
  try {
    await connectDB();
    const payload = await request.json();

    const validation = zSchema.pick({ email: true, otp: true });
    const validated = validation.safeParse(payload);

    if (!validated.success) {
      return response(false, 400, validated.error.errors[0].message);
    }

    const { email, otp } = validated.data;

    const getOtp = await OtpModel.findOne({ email, otp });
    if (!getOtp) return response(false, 400, "Invalid OTP");

    const user = await UserModel.findOne({ email, deletedAt: null });
    if (!user) return response(false, 404, "User not found");

    // ⭐ JWT में data FLAT डालो
   const token = await new SignJWT({
  id: user._id.toString(),
  email: user.email,
  role: user.role
})
  .setProtectedHeader({ alg: "HS256" })
  .setIssuedAt()
  .setExpirationTime("24h")
  .sign(new TextEncoder().encode(process.env.SECRET_KEY));


    const cookieStore = await cookies();
    cookieStore.set("access_token", token, {
      httpOnly: true,
      path: "/",
      sameSite: "lax",
      secure: false,
    });

    await getOtp.deleteOne();

    return response(true, 200, "Login successful", {
      _id: user._id.toString(),
      role: user.role,
      email: user.email,
    });
  } catch (err) {
    return catchError(err);
  }
}

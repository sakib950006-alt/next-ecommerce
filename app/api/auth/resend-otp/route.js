import { NextResponse } from "next/server";
import { otpEmail } from "@/email/otpEmail";
import { connectDB } from "@/lib/databaseConnection";
import { catchError, generateOtp } from "@/lib/helperFunction";
import { sendMail } from "@/lib/sendMail";
import { zSchema } from "@/lib/zodSchema";
import OtpModel from "@/models/Otp.model";
import UserModel from "@/models/User.model";

export async function POST(request) {
  try {
    console.log("📌 Step 1: Connecting to DB...");
    await connectDB();
    console.log("✅ DB Connected");

    const payload = await request.json();
    console.log("📌 Step 2: Payload received =>", payload);

    const validationSchema = zSchema.pick({ email: true });
    const validatedData = validationSchema.safeParse(payload);
    console.log("📌 Step 3: Validation result =>", validatedData);

    if (!validatedData.success) {
      const errorMsg = validatedData.error.errors?.[0]?.message || "Validation failed";
      console.log("❌ Validation failed:", errorMsg);
      return NextResponse.json({ success: false, message: errorMsg }, { status: 400 });
    }

    const { email: userEmail } = validatedData.data;

    console.log("📌 Step 4: Checking user in DB...");
    const getUser = await UserModel.findOne({ email: userEmail });
    if (!getUser) {
      console.log("❌ User not found");
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }
    console.log("✅ User found:", getUser.email);

    console.log("📌 Step 5: Deleting old OTPs...");
    await OtpModel.deleteMany({ email: userEmail });

    const otp = generateOtp();
    console.log("📌 Step 6: Generated OTP =>", otp);

    const newOtpData = new OtpModel({ email: userEmail, otp });
    await newOtpData.save();
    console.log("✅ OTP saved in DB");

    console.log("📌 Step 7: Sending OTP email...");
    let otpSendStatus;
    try {
      otpSendStatus = await sendMail(
        "Your login verification code.",
        userEmail,
        otpEmail(otp)
      );
      console.log("📌 Email send status:", otpSendStatus);
    } catch (err) {
      console.error("❌ Email send error:", err);
      return NextResponse.json({ success: false, message: "Failed to send OTP" }, { status: 500 });
    }

    if (!otpSendStatus?.success) {
      console.log("❌ OTP send failed");
      return NextResponse.json({ success: false, message: "Failed to send OTP" }, { status: 500 });
    }

    console.log("✅ OTP sent successfully");
    return NextResponse.json({ success: true, message: "OTP sent successfully" }, { status: 200 });

  } catch (error) {
    console.error("❌ Unhandled Error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

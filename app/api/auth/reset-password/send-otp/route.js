import { otpEmail } from "@/email/otpEmail";
import { connectDB } from "@/lib/databaseConnection";
import { catchError, generateOtp, response } from "@/lib/helperFunction";
import { sendMail } from "@/lib/sendMail";
import { zSchema } from "@/lib/zodSchema";
import OTPModel from "@/models/Otp.model";
import UserModel from "@/models/User.model";

export async function POST(request) {
  try {
    await connectDB();

    const payload = await request.json();

    const validationSchema = zSchema.pick({
      email: true,
    });

    const validatedData = validationSchema.safeParse(payload);

    if (!validatedData.success) {
      return response(
        false,
        401,
        "Invalid or missing input field.",
        validatedData.error
      );
    }

    const { email } = validatedData.data;

    const getUser = await UserModel.findOne({ deletedAt: null, email }).lean();

    if (!getUser) {
      return response(false, 404, "User not found");
    }

    await OTPModel.deleteMany({ email });

    const otp = generateOtp();

    const newOtpData = new OTPModel({
      email,
      otp,
    });
    await newOtpData.save();

    const otpSendStatus = await sendMail(
      "Your login verification code.",
      email,
      otpEmail(otp)
    );

    if (!otpSendStatus.success) {
      return response(false, 400, "Failed to reset otp.");
    }

    return response(true, 200, "Please verify your account.");
  } catch (error) {
    return catchError(error);
  }
}

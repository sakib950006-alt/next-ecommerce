import { emailVerificationLink } from "@/email/emailVerificationlink";
import { connectDB } from "@/lib/databaseConnection";
import UserModel from "@/models/User.model";
import { zSchema } from "@/lib/zodSchema";
import { catchError, response } from "@/lib/helperFunction";
import { sendMail } from "@/lib/sendMail";
import { SignJWT } from "jose";

export async function POST(request) {
  try {
    await connectDB();

    const validationSchema = zSchema.pick({
      name: true,
      email: true,
      password: true,
    });

    const payload = await request.json();
    const validatedData = validationSchema.safeParse(payload);

    if (!validatedData.success) {
      return response(
        false,
        401,
        "Invalid or missing input field.",
        validatedData.error
      );
    }

    const { name, email, password } = validatedData.data;

    const checkUser = await UserModel.exists({ email });
    if (checkUser) {
      return response(false, 409, "User already exists with this email.");
    }

    // ❌ No manual hashing (hook already hashes password)
    const NewRegistration = new UserModel({
      name,
      email,
      password,
    });

    await NewRegistration.save();

    const secret = new TextEncoder().encode(process.env.SECRET_KEY);
    const token = await new SignJWT({
      userId: NewRegistration._id.toString(),
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("1h")
      .sign(secret);

    await sendMail(
      "Email Verification request from Developer Shakib",
      email,
      emailVerificationLink(
        `${process.env.NEXT_PUBLIC_BASE_URL}/auth/verify-email/${token}`
      )
    );

    return response(
      true,
      200,
      "Registration successful. Please verify your email."
    );
  } catch (error) {
    catchError(error);
    return response(false, 500, "Internal Server Error", error.message);
  }
}

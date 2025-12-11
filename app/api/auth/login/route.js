import { connectDB } from "@/lib/databaseConnection";
import UserModel from "@/models/User.model";
import OtpModel from "@/models/Otp.model";
import { zSchema } from "@/lib/zodSchema";
import { catchError, response, generateOtp } from "@/lib/helperFunction";
import { sendMail } from "@/lib/sendMail";

export async function POST(request){
  try{
    await connectDB();
    const payload = await request.json();
    const validationSchema = zSchema.pick({email:true,password:true});
    const validatedData = validationSchema.safeParse(payload);
    if(!validatedData.success) return response(false,401,"Invalid input",validatedData.error);

    const {email,password} = validatedData.data;

    const user = await UserModel.findOne({email}).select("+password");
    if(!user) return response(false,401,"Invalid email or password");

    const isPasswordValid = await user.comparePassword(password);
    if(!isPasswordValid) return response(false,401,"Invalid email or password");

    if(!user.isEmailVerified) return response(false,401,"Please verify email");

    // ✅ Generate OTP
    const otp = generateOtp();
    await OtpModel.create({email: user.email, otp, expiresAt: new Date(Date.now()+5*60*1000)});

    // ✅ Send OTP
    await sendMail({to:user.email,subject:"Your Login OTP",text:`Your OTP is ${otp}. It expires in 5 min.`});

    return response(true,200,"OTP sent. Verify to complete login",{userId:user._id});
  }catch(error){
    catchError(error);
    return response(false,500,"Internal Server Error",error.message);
  }
}

import { connectDB } from "@/lib/databaseConnection";
import UserModel from "@/models/User.model";
import OtpModel from "@/models/Otp.model";
import { catchError, response } from "@/lib/helperFunction";
import { SignJWT } from "jose";
import { cookies } from "next/headers";

export async function POST(request){
  try{
    await connectDB();
    const {email,otp} = await request.json();

    const otpRecord = await OtpModel.findOne({email,otp});
    if(!otpRecord) return response(false,401,"Invalid OTP");

    if(new Date() > otpRecord.expiresAt) return response(false,401,"OTP expired");

    const user = await UserModel.findOne({email});
    if(!user) return response(false,401,"User not found");

    if(!process.env.SECRET_KEY) throw new Error("SECRET_KEY missing");

    const secret = new TextEncoder().encode(process.env.SECRET_KEY);
    const token = await new SignJWT({userId:user._id.toString()})
      .setProtectedHeader({alg:"HS256"})
      .setIssuedAt()
      .setExpirationTime("7d")
      .sign(secret);

    cookies().set("token",token,{httpOnly:true,secure:process.env.NODE_ENV==="production",path:"/",maxAge:60*60*24*7});
    await OtpModel.deleteOne({_id: otpRecord._id});

    return response(true,200,"Login successful",{token,user:{id:user._id,name:user.name,email:user.email,role:user.role}});
  }catch(error){
    catchError(error);
    return response(false,500,"Internal Server Error",error.message);
  }
}

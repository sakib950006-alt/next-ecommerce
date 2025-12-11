import cloudinary from "@/lib/cloudinary";
import { NextResponse } from "next/server";
import { catchError } from "@/lib/helperFunction";



export async function POST(request) {
  try {
   const payload = await request.json()
   const { paramsToSign } = payload;

   const signature = cloudinary.utils.api_sign_request(paramsToSign,process.env.CLOUDINARY_API_SECRET)

    return NextResponse.json({ signature });
  } catch (error) {
    return catchError(error);
  }
}
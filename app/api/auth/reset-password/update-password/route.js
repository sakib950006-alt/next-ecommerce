import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import { zSchema } from "@/lib/zodSchema";
import UserModel from "@/models/User.model";
import bcrypt from "bcryptjs";

export async function PUT(request){
  try{
    await connectDB();
    const payload = await request.json();
    const validationSchema = zSchema.pick({email:true,password:true});
    const validatedData = validationSchema.safeParse(payload);
    if(!validatedData.success) return response(false,401,"Invalid input",validatedData.error);

    const {email,password} = validatedData.data;
    const hashedPassword = await bcrypt.hash(password,10);

    const updatedUser = await UserModel.findOneAndUpdate(
      {email},
      {password:hashedPassword},
      {new:true}
    );

    if(!updatedUser) return response(false,404,"User not found");

    return response(true,200,"Password updated successfully");
  }catch(error){
    console.error(error);
    return response(false,500,"Internal Server Error",error.message);
  }
}

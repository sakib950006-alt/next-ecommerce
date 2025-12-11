
import { connectDB } from "@/lib/databaseConnection";
import { catchError } from "@/lib/helperFunction";
import { response } from "@/lib/response";
import Categorymodel from "@/models/Category.model";


export async function GET() {
  try {
   

    // ✅ Connect DB
   await connectDB()

  

    const getCategory = await Categorymodel.find({deletedAt: null}).lean();

    if (!getCategory) {
      return response(false, 404, "Category not found");
    }

    return response(true, 200, "Category found", getCategory);
  } catch (error) {
    return catchError(error);
  }
}

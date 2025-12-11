
import { connectDB } from "@/lib/databaseConnection";
import { catchError } from "@/lib/helperFunction";
import { response } from "@/lib/response";
import ProductVariantModel from "@/models/ProductVariant.model";



export async function GET() {
  try {
   

    // ✅ Connect DB
   await connectDB()

  

    const getColor = await ProductVariantModel.distinct('color')

    if (!getColor) {
      return response(false, 404, "Color not found");
    }

    return response(true, 200, "Color found", getColor);
  } catch (error) {
    return catchError(error);
  }
}

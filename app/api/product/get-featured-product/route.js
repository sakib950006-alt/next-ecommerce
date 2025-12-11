
import { catchError } from "@/lib/helperFunction";
import { response } from "@/lib/response";
import ProductModel from "@/models/Product.model";
import MediaModel from "@/models/Media.model";
import { connectDB } from "@/lib/databaseConnection";



export async function GET() {
  try {
    

    // ✅ Connect DB
  await connectDB()



   

    const getProduct = await ProductModel.find({
      deletedAt:null
    }).populate('media').limit(8).lean();

    if (!getProduct) {
      return response(false, 404, "Product not found");
    }

    return response(true, 200, "Product found", getProduct);
  } catch (error) {
    return catchError(error);
  }
}


import { connectDB } from "@/lib/databaseConnection";
import { catchError } from "@/lib/helperFunction";
import { response } from "@/lib/response";
import ProductVariantModel from "@/models/ProductVariant.model";



export async function GET() {
  try {
   

    // ✅ Connect DB
   await connectDB()

  

    const getsize = await ProductVariantModel.aggregate([
         {$sort:{_id:1}},
         {
            $group:{
                _id:"$size",
                first:{$first: "$_id"}
            }
         },
         {$sort:{first :1}},
         {$project: {_id:0, size: "$_id"}}
    ])
    if(!getsize.length){
 return response(false, 404, "size not found");
    }

    const sizes = getsize.map(item => item.size)

    return response(true, 200, "size found", sizes);
  } catch (error) {
    return catchError(error);
  }
}

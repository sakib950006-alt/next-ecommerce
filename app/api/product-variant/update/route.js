import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/databaseConnection";
import { catchError } from "@/lib/helperFunction";
import { response } from "@/lib/response";
import { zSchema } from "@/lib/zodSchema";
import ProductVariantModel from "@/models/ProductVariant.model";



export async function PUT(request) {
  try {
    const auth = await isAuthenticated("admin");
    if (!auth.isAuth) {
      return response(false, 403, "Unauthorized.");
    }

    await connectDB();

    const payload = await request.json();

    // ✅ सही schema (string → number convert allowed)
const schema = zSchema.pick({
      _id: true,
      product: true,
      sku: true,
      color: true,
      size: true,
      mrp: true,
      sellingPrice: true,
      discountPercentage: true,
      media: true,
      description: true, // ✅ included optional
    });

    const validate = schema.safeParse(payload);

    if (!validate.success) {
      return response(false, 400, "Invalid or missing fields.", validate.error.errors);
    }

    const validateData = validate.data;
const getProductVariant = await ProductVariantModel.findOne({ deletedAt: null, _id:validateData._id})
if(!getProductVariant){
  return response(false, 404, "Product not found");
}
    
    getProductVariant.product = validateData.product;
    getProductVariant.sku = validateData.sku;
    getProductVariant.color = validateData.color;
    getProductVariant.size = validateData.size;
    getProductVariant.mrp = validateData.mrp;
    getProductVariant.sellingPrice = validateData.sellingPrice;
    getProductVariant.discountPercentage = validateData.discountPercentage;
    getProductVariant.media = validateData.media;
    await getProductVariant.save();
    return response(true, 200, "Product variant updated successfully", getProductVariant);
     
   
  } catch (error) {
    return catchError(error);
  }
}

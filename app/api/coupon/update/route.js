import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/databaseConnection";
import { catchError } from "@/lib/helperFunction";
import { response } from "@/lib/response";
import { zSchema } from "@/lib/zodSchema";
import CouponModel from "@/models/Coupon.model";



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
    code: true,
    discountPercentage: true,
    minShoppingAmount: true,
    validity: true,
  })

    const validate = schema.safeParse(payload);

    if (!validate.success) {
      return response(false, 400, "Invalid or missing fields.", validate.error.errors);
    }

    const validateData = validate.data;
const getCoupon = await CouponModel.findOne({ deletedAt: null, _id:validateData._id})
if(!getCoupon){
  return response(false, 404, "Product not found");
}
    
   
getCoupon.code = validateData.code
getCoupon.discountPercentage = validateData.discountPercentage
getCoupon.minShoppingAmount = validateData.minShoppingAmount
getCoupon.validity = validateData.validity

    await getCoupon.save();
    return response(true, 200, "Coupon updated successfully", getCoupon);
     
   
  } catch (error) {
    return catchError(error);
  }
}

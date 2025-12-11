import { isAuthenticated } from "@/lib/authentication";
import { catchError } from "@/lib/helperFunction";
import { response } from "@/lib/response";
import CouponModel from "@/models/Coupon.model";


import mongoose, { isValidObjectId } from "mongoose";

export async function GET(request, context) {
  try {
    const auth = await isAuthenticated("admin");
    if (!auth.isAuth) {
      return response(false, 403, "Unauthorized");
    }

    // ✅ Connect DB
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URI);
    }

    const { params } = context || {};
    const id = params?.id;

    if (!id) {
      return response(false, 400, "Missing id param");
    }

    if (!isValidObjectId(id)) {
      return response(false, 404, "Invalid object id");
    }

    const getCoupon = await CouponModel.findOne({
      _id: id,
      deletedAt: null,
    }).lean();

    if (!getCoupon) {
      return response(false, 404, "Coupon not found");
    }

    return response(true, 200, "Coupon found", getCoupon);
  } catch (error) {
    return catchError(error);
  }
}

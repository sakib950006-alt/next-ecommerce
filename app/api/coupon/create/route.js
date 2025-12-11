import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/databaseConnection";
import { catchError } from "@/lib/helperFunction";
import { response } from "@/lib/response";
import { zSchema } from "@/lib/zodSchema";
import CouponModel from "@/models/Coupon.model";

import { z } from "zod";

export async function POST(request) {
  try {
    const auth = await isAuthenticated("admin");
    if (!auth.isAuth) {
      return response(false, 403, "Unauthorized.");
    }

    await connectDB();

    const payload = await request.json();

    // ✅ सही schema (string → number convert allowed)
    const schema = z.object({
      code: z.string().min(1, { message: "code is required" }),
         minShoppingAmount: z.union([
          z.number(),
          z.string().transform((val) => Number(val)),
        ]),
        validity: z.coerce.date(),
         discountPercentage: z.union([
            z.number(),
            z.string().transform((val) => Number(val)),
          ]),
    });

    const validate = schema.safeParse(payload);

    if (!validate.success) {
      return response(false, 400, "Invalid or missing fields.", validate.error.errors);
    }

    const couponData = validate.data;

    const newCoupon = new CouponModel({
     code: couponData.code,
     discountPercentage: couponData.discountPercentage,
     minShoppingAmount: couponData.minShoppingAmount,
     validity: couponData.validity
    });

    try {
      await newCoupon.save();
      return response(true, 200, "Product added successfully.");
    } catch (err) {
      if (err.code === 11000) {
        return response(false, 400, "Product with same name or slug already exists.");
      }
      throw err;
    }
  } catch (error) {
    return catchError(error);
  }
}

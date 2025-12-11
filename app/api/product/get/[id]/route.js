import { isAuthenticated } from "@/lib/authentication";
import { catchError } from "@/lib/helperFunction";
import { response } from "@/lib/response";
import ProductModel from "@/models/Product.model";
import MediaModel from "@/models/Media.model";

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

    const getProduct = await ProductModel.findOne({
      _id: id,
      deletedAt: null,
    }).populate('media', '_id secure_url').lean();

    if (!getProduct) {
      return response(false, 404, "Product not found");
    }

    return response(true, 200, "Product found", getProduct);
  } catch (error) {
    return catchError(error);
  }
}

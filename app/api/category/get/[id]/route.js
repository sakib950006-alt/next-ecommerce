import { isAuthenticated } from "@/lib/authentication";
import { catchError } from "@/lib/helperFunction";
import { response } from "@/lib/response";
import Categorymodel from "@/models/Category.model";
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

    const getCategory = await Categorymodel.findOne({
      _id: id,
      deletedAt: null,
    }).lean();

    if (!getCategory) {
      return response(false, 404, "Category not found");
    }

    return response(true, 200, "Category found", getCategory);
  } catch (error) {
    return catchError(error);
  }
}

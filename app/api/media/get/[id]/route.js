import { isAuthenticated } from "@/lib/authentication";
import { catchError } from "@/lib/helperFunction";
import { response } from "@/lib/response";
import MediaModel from "@/models/Media.model";
import mongoose, { isValidObjectId } from "mongoose";

export async function GET(request, { params }) {
  try {
    const auth = await isAuthenticated("admin");
    if (!auth.isAuth) {
      return response(false, 403, "Unauthorized");
    }

    // ✅ Connect to DB
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URI);
    }

    const { id } = params;

    // ✅ Validate ObjectId
    if (!isValidObjectId(id)) {
      return response(false, 404, "Invalid object id");
    }

    // ✅ Find document
    const filter = { _id: id, deletedAt: null };
    const getMedia = await MediaModel.findOne(filter).lean();

    if (!getMedia) {
      return response(false, 404, "Media not found");
    }

    return response(true, 200, "Media found", getMedia);
  } catch (error) {
    return catchError(error);
  }
}

import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/databaseConnection";
import { catchError } from "@/lib/helperFunction";
import { response } from "@/lib/response";
import ReviewModel from "@/models/Review.model";

export async function GET() {
  try {
    const auth = await isAuthenticated("admin");
    if (!auth.isAuth) {
      return response(false, 403, "Unauthorized");
    }

    await connectDB();
    
    const latestReview = await ReviewModel
      .find({ deletedAt: null })
      .sort({ createdAt: -1 })
      .limit(20)  // ✅ FIXED
      .populate({
        path: "product",
        select: "name media",  // media already contains secure_url
      })
      .lean();  // performance boost

    return response(true, 200, "Latest review", latestReview);

  } catch (error) {
    return catchError(error);
  }
}

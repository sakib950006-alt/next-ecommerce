import { connectDB } from "@/lib/databaseConnection";
import { response } from "@/lib/response";
import { catchError } from "@/lib/helperFunction";
import ReviewModel from "@/models/Review.model";
import mongoose from "mongoose";

export async function GET(request) {
  try {
    await connectDB();

    const searchParams = request.nextUrl.searchParams;
    const productId = searchParams.get("productId");

    if (!productId) {
      return response(false, 404, "ProductId is missing.");
    }

    const review = await ReviewModel.aggregate([
      {
        $match: {
          product: new mongoose.Types.ObjectId(productId),
          deletedAt: null
        }
      },
      {
        $group: { _id: "$rating", count: { $sum: 1 } }
      },
      {
        $sort: { _id: -1 }
      }
    ]);

    const totalReview = review.reduce((sum, r) => sum + r.count, 0);

    const totalPoints = review.reduce(
      (sum, r) => sum + r._id * r.count,
      0
    );

    // ⭐ STRING DECIMALS
    const totalReviewStr = totalReview.toFixed(1);
    const averageRatingStr =
      totalReview > 0
        ? (totalPoints / totalReview).toFixed(1)
        : (0).toFixed(3);

    const rating = {};
    review.forEach((r) => {
      rating[r._id] = r.count.toFixed(1); // STRING
    });

    const percentage = {};
    review.forEach((r) => {
      percentage[r._id] = totalReview
        ? ((r.count / totalReview) * 100).toFixed(5) // STRING
        : (0).toFixed(3);
    });

    return response(true, 200, "Review stats", {
      totalReview: totalReviewStr,
      averageRating: averageRatingStr,
      rating,
      percentage
    });

  } catch (error) {
    return catchError(error);
  }
}

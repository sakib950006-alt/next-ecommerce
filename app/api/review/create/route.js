import { connectDB } from "@/lib/databaseConnection";
import { catchError } from "@/lib/helperFunction";
import { response } from "@/lib/response";
import ReviewModel from "@/models/Review.model";
import { z } from "zod";

export async function POST(request) {
  try {
    await connectDB();

    const payload = await request.json();

    // Zod Validation Schema
    const schema = z.object({
      product: z.string(),
      userId: z.string(),  // userId required from body
      rating: z.coerce.number(),
      title: z.string(),
      review: z.string(),
    });

    const validate = schema.safeParse(payload);

    if (!validate.success) {
      return response(false, 400, "Invalid or missing fields.", validate.error.errors);
    }

    const { product, userId, rating, title, review } = validate.data;

    const newReview = new ReviewModel({
      product,
      user: userId, // directly from body
      rating,
      title,
      review,
    });

    await newReview.save();

    return response(true, 200, "Review added successfully.");
  } catch (error) {
    return catchError(error);
  }
}

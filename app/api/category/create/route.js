import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/databaseConnection";
import { catchError } from "@/lib/helperFunction";
import { response } from "@/lib/response";
import Categorymodel from "@/models/Category.model";
  // ✅ check filename carefully
import { z } from "zod";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required"),
});

export async function POST(request) {
  try {
    const auth = await isAuthenticated("admin");
    if (!auth.isAuth) {
      return response(false, 403, "Unauthorized.");
    }

    await connectDB();

    const payload = await request.json();
    const validate = schema.safeParse(payload);

    if (!validate.success) {
      return response(false, 400, "Invalid or missing fields.", validate.error.errors);
    }

    const { name, slug } = validate.data;

    const newCategory = new Categorymodel({ name, slug });

    try {
      await newCategory.save();
      return response(true, 200, "Category added successfully.");
    } catch (err) {
      if (err.code === 11000) {
        return response(false, 400, "Category with same name or slug already exists.");
      }
      throw err;
    }
  } catch (error) {
    return catchError(error);
  }
}

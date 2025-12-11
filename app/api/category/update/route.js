import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/databaseConnection";
import { catchError } from "@/lib/helperFunction";
import { response } from "@/lib/response";
import Categorymodel from "@/models/Category.model";
import { z } from "zod";

const schema = z.object({
  _id: z.string().min(1, "ID is required"),
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required"),
});

export async function PUT(request) {
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

    const { _id, name, slug } = validate.data;

    // ✅ Find existing category
    const getCategory = await Categorymodel.findOne({ _id, deletedAt: null });

    if (!getCategory) {
      return response(false, 404, "Category not found");
    }

    // ✅ Update fields
    getCategory.name = name;
    getCategory.slug = slug;

    // ✅ Save updated document
    await getCategory.save();

    return response(true, 200, "Category updated successfully", getCategory);
  } catch (error) {
    return catchError(error);
  }
}

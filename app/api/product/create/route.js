import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/databaseConnection";
import { catchError } from "@/lib/helperFunction";
import { response } from "@/lib/response";
import { zSchema } from "@/lib/zodSchema";
import ProductModel from "@/models/Product.model";
import { encode } from "entities";
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
      name: z.string().min(1),
      slug: z.string().min(1),
      category: z.string().min(1),
      mrp: z.coerce.number(),
      sellingPrice: z.coerce.number(),
      discountPercentage: z.coerce.number(),
      description: z.string().min(1),
      media: z.array(z.string()).min(1, "At least one media is required"),
    });

    const validate = schema.safeParse(payload);

    if (!validate.success) {
      return response(false, 400, "Invalid or missing fields.", validate.error.errors);
    }

    const productData = validate.data;

    const newProduct = new ProductModel({
      name: productData.name,
      slug: productData.slug,
      category: productData.category,
      mrp: productData.mrp,
      sellingPrice: productData.sellingPrice,
      discountPercentage: productData.discountPercentage,
      description: encode(productData.description),
      media: productData.media,
    });

    try {
      await newProduct.save();
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

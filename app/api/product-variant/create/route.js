import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/databaseConnection";
import { catchError } from "@/lib/helperFunction";
import { response } from "@/lib/response";
import { zSchema } from "@/lib/zodSchema";
import ProductVariantModel from "@/models/ProductVariant.model";

export async function POST(request) {
  try {
    const auth = await isAuthenticated("admin");
    if (!auth.isAuth) {
      return response(false, 403, "Unauthorized.");
    }

    await connectDB();

    const payload = await request.json();

    // ✅ Define schema for product variant
    const schema = zSchema.pick({
      product: true,
      sku: true,
      color: true,
      size: true,
      mrp: true,
      sellingPrice: true,
      discountPercentage: true,
      media: true,
      description: true, // ✅ included optional
    });

    console.log("[1] Validating body with Zod...");
    const validate = schema.safeParse(payload);

    if (!validate.success) {
      console.error("❌ Validation failed:", validate.error.errors);
      return response(false, 400, "Invalid or missing fields.", validate.error.errors);
    }

    const variantData = validate.data;

    console.log("[2] Saving to DB...");

    const newProductVariant = new ProductVariantModel({
      product: variantData.product,
      sku: variantData.sku,
      color: variantData.color,
      size: variantData.size,
      mrp: variantData.mrp,
      sellingPrice: variantData.sellingPrice,
      discountPercentage: variantData.discountPercentage,
      media: variantData.media,
      description: variantData.description || "",
    });

    await newProductVariant.save();

    console.log("[3] Saved successfully!");
    return response(true, 200, "Product variant added successfully.");

  } catch (error) {
    console.error("🔥 Error:", error);
    if (error.code === 11000) {
      return response(false, 400, "Duplicate SKU or product variant exists.");
    }
    return catchError(error);
  }
}

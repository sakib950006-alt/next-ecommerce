import { response } from "@/lib/response";
import { catchError } from "@/lib/helperFunction";
import ProductModel from "@/models/Product.model";
import ProductVariantModel from "@/models/ProductVariant.model";
import ReviewModel from "@/models/Review.model";
import { connectDB } from "@/lib/databaseConnection";
import mediaModel from "@/models/Media.model";

export async function GET(request, context) {
  try {
    await connectDB();

    // ⭐ Next.js 14/15 REQUIREMENT → context.params ASYNC hota hai
    const { params } = context;
    const slug = (await params)?.slug;

    if (!slug) {
      return response(false, 404, "Slug missing");
    }

    const searchParams = request.nextUrl.searchParams;
    const size = searchParams.get("size");
    const color = searchParams.get("color");

    // ⭐ PRODUCT
    const product = await ProductModel.findOne({
      slug,
      deletedAt: null,
    })
      .populate("media", "secure_url")
      .lean();

    if (!product) return response(false, 404, "Product not found");

    // ⭐ VARIANT FILTER
    const filter = { product: product._id };
    if (size) filter.size = size;
    if (color) filter.color = color;

    const variant = await ProductVariantModel.findOne(filter)
      .populate("media", "secure_url")
      .lean();

    if (!variant) return response(false, 404, "Variant not found");

    // ⭐ COLORS + SIZES
    const colors = await ProductVariantModel.distinct("color", {
      product: product._id,
    });

    const sizes = await ProductVariantModel.distinct("size", {
      product: product._id,
    });

    const reviewCount = await ReviewModel.countDocuments({
      product: product._id,
    });

    return response(true, 200, "Product found", {
      product,
      variant,
      colors,
      sizes,
      reviewCount,
    });
  } catch (error) {
    return catchError(error);
  }
}  
import { connectDB } from "@/lib/databaseConnection";
import { catchError } from "@/lib/helperFunction";
import { response } from "@/lib/response";
import ProductVariantModel from "@/models/ProductVariant.model";

export async function POST(request){
    try {
        await connectDB();
        const payload = await request.json();

        const verifiedCartData = await Promise.all(
            payload.map(async (cartItem) => {

                const variant = await ProductVariantModel
                    .findById(cartItem.variantId)
                    .populate("product")
                    .populate("media", "secure_url")
                    .lean();

                if (!variant) return null;

                return {
                    productId: variant.product._id,
                    variantId: variant._id,
                    name: variant.product.name,
                    url: variant.product.slug,
                    size: variant.size,
                    color: variant.color,
                    mrp: variant.mrp,
                    sellingPrice: variant.sellingPrice,
                    media: variant?.media?.[0]?.secure_url || null,
                    qty: cartItem.qty,
                };
            })
        );

        // Remove null items
        const cleanCart = verifiedCartData.filter(Boolean);

        return response(true, 200, "Verified Cart Data", cleanCart);

    } catch (error) {
        return catchError(error);
    }
}

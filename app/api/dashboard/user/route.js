import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/databaseConnection";
import { catchError } from "@/lib/helperFunction";
import { response } from "@/lib/response";
import OrderModel from "@/models/Order.model";
import { Types } from "mongoose";
import ProductModel from "@/models/Product.model";
import ProductVariantModel from "@/models/ProductVariant.model";
import MediaModel from "@/models/Media.model";

export async function GET() {
    try {
        await connectDB();

        const auth = await isAuthenticated("user");

        if (!auth.isAuth) {
            return response(false, 401, "Unauthorized");
        }
console.log("User ID From Token:", auth.userId);

        const userId = new Types.ObjectId(auth.userId);


        const recentOrders = await OrderModel.find({ user: userId })
            .populate("products.productId", "name slug")
            .populate({
                path: "products.variantId",
                populate: { path: "media" },
            }).limit(10)
            .lean();

        const totalOrder = await OrderModel.countDocuments({ user: userId });

        return response(true, 200, "Dashboard Info.", {
            recentOrders,
            totalOrder,
        });
    } catch (error) {
        return catchError(error);
    }
}

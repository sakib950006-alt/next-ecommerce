import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/databaseConnection";
import { catchError } from "@/lib/helperFunction";
import { response } from "@/lib/response";
import OrderModel from "@/models/Order.model";

export async function GET() {
  try {
    const auth = await isAuthenticated("admin");
    if (!auth.isAuth) {
      return response(false, 403, "Unauthorized");
    }

    await connectDB();

    const orderStatus = await OrderModel.aggregate([
      {
        $match: {
          deletedAt: null,
          // ❗ FIXED spelling mistake
          
        },
      },
      {
        $group: {
          _id: "$status",
          count: {$sum: 1}
        },
      },
      {
        $sort: { count: 1},
      },
    ]);

    return response(true, 200, "Data found", orderStatus);
  } catch (error) {
    return catchError(error);
  }
}

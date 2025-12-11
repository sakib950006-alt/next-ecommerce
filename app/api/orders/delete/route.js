import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/databaseConnection";
import { catchError } from "@/lib/helperFunction";
import { response } from "@/lib/response";
import OrderModel from "@/models/Order.model";

export async function DELETE(request) {
  try {
    const auth = await isAuthenticated("admin");
    if (!auth.isAuth) {
      return response(false, 403, "Unauthorized Access");
    }

    await connectDB();
    const payload = await request.json();

    const ids = payload.ids || [];

    if (!Array.isArray(ids) || ids.length === 0) {
      return response(false, 400, "No IDs provided for deletion");
    }

    const data = await OrderModel.find({ _id: { $in: ids } }).lean();
    if (!data.length) {
      return response(false, 404, "Orders not found");
    }

    // PERMANENT DELETE
    await OrderModel.deleteMany({ _id: { $in: ids } });

    return response(true, 200, "Orders permanently deleted successfully");
  } catch (error) {
    return catchError(error);
  }
}

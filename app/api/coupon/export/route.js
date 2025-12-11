import ExcelJS from "exceljs";
import { connectDB } from "@/lib/databaseConnection";
import { catchError } from "@/lib/helperFunction";
import { isAuthenticated } from "@/lib/authentication";
import CouponModel from "@/models/Coupon.model";

export async function GET() {
  try {
    const auth = await isAuthenticated("admin");
    if (!auth.isAuth) {
      return new Response("Unauthorized", { status: 403 });
    }

    await connectDB();
    const Coupon = await CouponModel.find({ deletedAt: null }).lean();

    if (!Coupon.length) {
      return new Response("No product found", { status: 404 });
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Products");  // ✅ Sheet Name भी product

    worksheet.columns = [
      { header: "ID", key: "_id", width: 30 },
      { header: "Name", key: "name", width: 25 },
      { header: "Slug", key: "slug", width: 25 },
      { header: "Created At", key: "createdAt", width: 25 },
    ];

    worksheet.addRows(Coupon); // ✅ Correct variable

    const buffer = await workbook.xlsx.writeBuffer();

    return new Response(buffer, {
      status: 200,
      headers: {
        "Content-Disposition": 'attachment; filename="products.xlsx"', // ✅ File name भी change
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      },
    });

  } catch (error) {
    return catchError(error);
  }
}

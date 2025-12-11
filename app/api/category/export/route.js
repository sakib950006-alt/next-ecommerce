import ExcelJS from "exceljs";
import { connectDB } from "@/lib/databaseConnection";
import { catchError } from "@/lib/helperFunction";
import { isAuthenticated } from "@/lib/authentication";
import Categorymodel from "@/models/Category.model";

export async function GET() {
  try {
    const auth = await isAuthenticated("admin");
    if (!auth.isAuth) {
      return new Response("Unauthorized", { status: 403 });
    }

    await connectDB();
    const categories = await Categorymodel.find({ deletedAt: null }).lean();

    if (!categories.length) {
      return new Response("No category found", { status: 404 });
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Categories");

    worksheet.columns = [
      { header: "ID", key: "_id", width: 30 },
      { header: "Name", key: "name", width: 25 },
      { header: "Slug", key: "slug", width: 25 },
      { header: "Created At", key: "createdAt", width: 25 },
    ];

    worksheet.addRows(categories);
    const buffer = await workbook.xlsx.writeBuffer();

    return new Response(buffer, {
      status: 200,
      headers: {
        "Content-Disposition": 'attachment; filename="categories.xlsx"',
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      },
    });
  } catch (error) {
    return catchError(error);
  }
}

import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/databaseConnection";
import { catchError } from "@/lib/helperFunction";
import ReviewModel from "@/models/Review.model";

export async function GET(request) {
  try {
    const auth = await isAuthenticated("admin");
    if (!auth.isAuth) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 });
    }

    await connectDB();

    const searchParams = request.nextUrl.searchParams;

    const start = parseInt(searchParams.get("start") || 0, 10);
    const size = parseInt(searchParams.get("size") || 10, 10);
    const filters = JSON.parse(searchParams.get("filters") || "[]");
    const globalFilter = searchParams.get("globalFilter") || "";
    const sorting = JSON.parse(searchParams.get("sorting") || "[]");
    const deleteType = searchParams.get("deleteType") || "none";

    let matchQuery = {};
    if (deleteType === "SD") {
      matchQuery = { deletedAt: null };
    } else if (deleteType === "PD") {
      matchQuery = { deletedAt: { $ne: null } };
    }

    // ✅ Global search fix
    if (globalFilter) {
      matchQuery["$or"] = [
        { "productData.name": { $regex: globalFilter, $options: "i" } },
        { "userData.name": { $regex: globalFilter, $options: "i" } },
        { email: { $regex: globalFilter, $options: "i" } },
        { title: { $regex: globalFilter, $options: "i" } },
        { review: { $regex: globalFilter, $options: "i" } },
      ];
    }

    // ✅ Filters fix
    filters.forEach((filter) => {
      if (filter.id === "product") {
        matchQuery["productData.name"] = { $regex: filter.value, $options: "i" };
      } else if (filter.id === "user") {
        matchQuery["userData.name"] = { $regex: filter.value, $options: "i" };
      } else {
        matchQuery[filter.id] = { $regex: filter.value, $options: "i" };
      }
    });

    // ✅ Sorting
    let sortQuery = {};
    sorting.forEach((sort) => {
      sortQuery[sort.id] = sort.desc ? -1 : 1;
    });

    // ✅ Main aggregation pipeline
    const aggregationPipeline = [
      {
        $lookup: {
          from: "products",
          localField: "product",
          foreignField: "_id", // ✅ spelling fix
          as: "productData",
        },
      },
      { $unwind: { path: "$productData", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id", // ✅ spelling fix
          as: "userData",
        },
      },
      { $unwind: { path: "$userData", preserveNullAndEmptyArrays: true } },
      { $match: matchQuery },
      { $sort: Object.keys(sortQuery).length ? sortQuery : { createdAt: -1 } },
      { $skip: start },
      { $limit: size },
      {
        $project: {
          _id: 1,
          product: "$productData.name",
          user: "$userData.name",
          rating: 1,
          review: 1,
          title: 1,
          createdAt: 1,
          updatedAt: 1,
          deletedAt: 1,
        },
      },
    ];

    const getReview = await ReviewModel.aggregate(aggregationPipeline);

    const totalRowCount = await ReviewModel.countDocuments();

    return NextResponse.json({
      success: true,
      data: getReview,
      meta: { totalRowCount },
    });
  } catch (error) {
    console.error("Error in GET /api/review:", error);
    return catchError(error);
  }
}

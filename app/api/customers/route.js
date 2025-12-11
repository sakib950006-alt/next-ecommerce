import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/databaseConnection";
import { catchError } from "@/lib/helperFunction";
import UserModel from "@/models/User.model";



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

    // global search
    if (globalFilter) {
      matchQuery["$or"] = [
        { name : {$regex: globalFilter , option : 'i'}},
        { email : {$regex: globalFilter , option : 'i'}},
        { phone : {$regex: globalFilter , option : 'i'}},
        { address : {$regex: globalFilter , option : 'i'}},
        { isEmailVerified : {$regex: globalFilter , option : 'i'}},
        

      ];
    }

    // filters
    filters.forEach((filter) => {
       matchQuery[filter.id] = { $regex: filter.value, $options: "i" };
    
    });

    // sorting
    let sortQuery = {};
    sorting.forEach((sort) => {
      sortQuery[sort.id] = sort.desc ? -1 : 1;
    });

 const aggregationPipeline = [
  
  { $match: matchQuery },
  { $sort: Object.keys(sortQuery).length ? sortQuery : { createdAt: -1 } },
  { $skip: start },
  { $limit: size },
  {
    $project: {
      _id: 1,
      name:1,
      email:1,
      phone:1,
      avatar:1,
      address:1,
      isEmailVerified:1,
      createdAt:1,
      updatedAt:1,
      deletedAt:1,
    },
  },
];


    const getCustomers = await UserModel.aggregate(aggregationPipeline);
    const totalRowCount = await UserModel.countDocuments(matchQuery);

    return NextResponse.json({
      success: true,
      data: getCustomers,
      meta: { totalRowCount }
    });
  } catch (error) {
    console.error("Error in GET /api/category:", error);
    return catchError(error);
  }
}







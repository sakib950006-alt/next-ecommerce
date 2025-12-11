import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/databaseConnection";
import { catchError } from "@/lib/helperFunction";

import CouponModel from "@/models/Coupon.model";


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
        { code: { $regex: globalFilter, $options: "i" } },
       
       
          {
          $expr:{
            $regexMatch: {
              input: { $toString: "$minShoppingAmount" },
              regex: globalFilter,
              options: "i"
            }
          }
        },
          {
          $expr:{
            $regexMatch: {
              input: { $toString: "$discountpercentage" },
              regex: globalFilter,
              options: "i"
            }
          }
        }

      ];
    }

    // filters
    filters.forEach((filter) => {
      if( filter.id === "minShoppingAmount" || filter.id === "discountPercentage"){

        matchQuery[filter.id] =  Number(filter.value);

      }else if(filter.id === 'validity'){
      matchQuery[filter.id] = new Date(filter.value)
      }
      else{
  matchQuery[filter.id] = { $regex: filter.value, $options: "i" };
      }
    
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
      code: 1,
      discountPercentage: 1,
      minShoppingAmount: 1,
      validity: 1,
      createdAt: 1,
      deletedAt: 1,
      updatedAt: 1,
    },
  },
];


    const getCoupon = await CouponModel.aggregate(aggregationPipeline);
    const totalRowCount = await CouponModel.countDocuments(matchQuery);

    return NextResponse.json({
      success: true,
      data: getCoupon,
      meta: { totalRowCount }
    });
  } catch (error) {
    console.error("Error in GET /api/category:", error);
    return catchError(error);
  }
}







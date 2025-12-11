import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/databaseConnection";
import { catchError } from "@/lib/helperFunction";
import ProductVariantModel from "@/models/ProductVariant.model";


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
        { color: { $regex: globalFilter, $options: "i" } },
        { size: { $regex: globalFilter, $options: "i" } },
        { sku: { $regex: globalFilter, $options: "i" } },
        { "productData.name": { $regex: globalFilter, $options: "i" } },

        {
          $expr:{
            $regexMatch: {
              input: { $toString: "$mrp" },
              regex: globalFilter,
              options: "i"
            }
          }
        },
          {
          $expr:{
            $regexMatch: {
              input: { $toString: "$sellingPrice" },
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
      if(filter.id === "mrp" || filter.id === "sellingPrice" || filter.id === "discountPercentage"){

        matchQuery[filter.id] =  Number(filter.value);

      }else if(filter.id === "product"){
       matchQuery["productData.name"] = { $regex: filter.value, $options: "i" };
      }else{
  matchQuery[filter.id] = { $regex: filter.value, $options: "i" };
      }
    
    });

    // sorting
    let sortQuery = {};
    sorting.forEach((sort) => {
      sortQuery[sort.id] = sort.desc ? -1 : 1;
    });

 const aggregationPipeline = [
  {
    $lookup: {
      from: "products",
      localField: "product",
      foreignField: "_id", // ✅ category slug match
      as: "productData"
    }
  },
  {
    $unwind: {
      path: "$productData",
      preserveNullAndEmptyArrays: true
    }
  },
  { $match: matchQuery },
  { $sort: Object.keys(sortQuery).length ? sortQuery : { createdAt: -1 } },
  { $skip: start },
  { $limit: size },
  {
    $project: {
      _id: 1,
      product: "$productData.name",
      color: 1,
      size: 1,
      sku: 1,
      mrp: 1,
      sellingPrice: 1, // ✅ fixed spelling
      discountPercentage: 1, 
      createdAt: 1,
      deletedAt: 1,
      updatedAt: 1,
    },
  },
];


    const getProductVariant = await ProductVariantModel.aggregate(aggregationPipeline);
    const totalRowCount = await ProductVariantModel.countDocuments(matchQuery);

    return NextResponse.json({
      success: true,
      data: getProductVariant,
      meta: { totalRowCount }
    });
  } catch (error) {
    console.error("Error in GET /api/category:", error);
    return catchError(error);
  }
}







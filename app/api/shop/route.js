import { connectDB } from "@/lib/databaseConnection";
import { catchError } from "@/lib/helperFunction";
import { response } from "@/lib/response";
import Categorymodel from "@/models/Category.model";
import ProductModel from "@/models/Product.model";

export async function GET(request) {
  try {
    await connectDB();

    const searchParams = request.nextUrl.searchParams;

    const size = searchParams.get("size");
    const color = searchParams.get("color");
    const minPrice = parseInt(searchParams.get("minPrice")) || 0;
    const maxPrice = parseInt(searchParams.get("maxPrice")) || 9999999;
    const categorySlug = searchParams.get("category");
    const search = searchParams.get("q");

    const limit = parseInt(searchParams.get("limit")) || 9;
    const page = parseInt(searchParams.get("page")) || 0;
    const skip = page * limit;

    // 🚀 SORT NORMALIZATION FIX
    let sortOption = (searchParams.get("sort") || "default_shorting")
      .trim()
      .toLowerCase();

    let sortquery = {};

    if (sortOption === "default_shorting") sortquery = { createdAt: -1 };
    if (sortOption === "asc") sortquery = { name: 1 };
    if (sortOption === "dsc") sortquery = { name: -1 };
    if (sortOption === "price_low_high") sortquery = { sellingPrice: 1 };
    if (sortOption === "price_high_low") sortquery = { sellingPrice: -1 };

    // -----------------------------------------------------
    // CATEGORY ID FIND
    // -----------------------------------------------------
    let categoryId = [];

    if (categorySlug) {
      const slugs = categorySlug.split(',')
      const categoryData = await Categorymodel.find({deletedAt: null, slug: {$in: slugs} })
        .select("_id")
        .lean();

      categoryId = categoryData.map(category => category._id)
    }

    // -----------------------------------------------------
    // MATCH STAGE
    // -----------------------------------------------------
    let matchStage = {};

    if (categoryId.length > 0 ) matchStage.category = {$in: categoryId};

    if (search) {
      matchStage.name = { $regex: search, $options: "i" };
    }

    // -----------------------------------------------------
    // AGGREGATE PIPELINE
    // -----------------------------------------------------
    const products = await ProductModel.aggregate([
      { $match: matchStage },

      { $sort: sortquery },

      { $skip: skip },
      { $limit: limit + 1 },

      // VARIANT LOOKUP
      {
        $lookup: {
          from: "productvariants",
          localField: "_id",
          foreignField: "product",
          as: "variants",
        },
      },

      // FIXED VARIANT FILTER
      {
        $addFields: {
          variants: {
            $filter: {
              input: "$variants",
              as: "variant",
              cond: {
                $and: [
                   size
          ? { $in: ["$$variant.size", size.split(',')] }
          : { $literal: true},

        color
          ? { $in: ["$$variant.color", color.split(',')] }
         : { $literal: true},
                ],
              },
            },
          },
        },
      },
     {
       $match : {
        variants:{$ne:[]}
      }
},
      // MEDIA LOOKUP
      {
        $lookup: {
          from: "medias",
          localField: "media",
          foreignField: "_id",
          as: "media",
        },
      },

      // CLEAN OUTPUT FIELDS
      {
        $project: {
          _id: 1,
          name: 1,
          slug: 1,
          mrp: 1,
          sellingPrice: 1,
          discountPercentage: 1,

          media: {
            _id: 1,
            secure_url: 1,
            alt: 1,
          },

          variants: {
            color: 1,
            size: 1,
            mrp: 1,
            sellingPrice: 1,
            discountPercentage: 1,
          },
        },
      },
    ]);

    // -----------------------------------------------------
    // NEXT PAGE LOGIC
    // -----------------------------------------------------
    let nextPage = null;
    if (products.length > limit) {
      nextPage = page + 1;
      products.pop();
    }

    return response(true, 200, "Product data found", { products, nextPage });
  } catch (error) {
    return catchError(error);
  }
}

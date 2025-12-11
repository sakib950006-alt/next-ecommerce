import mongoose from "mongoose";

const ProductVariantSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    color: {
      type: String,
      required: true,
      trim: true,
    },
    size: {
      type: String,
      required: true,
      trim: true,
    },
    mrp: {
      type: Number,
      required: true,
    },
    sellingPrice: {
      type: Number,
      required: true,
    },
    discountPercentage: {
      type: Number,
      required: true,
    },
    sku: {
      type: String, // ✅ FIXED: was `string` (from zod import) → should be `String`
      required: true,
      unique: true,
      trim: true,
    },
    media: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Media",
        required: true,
      },
    ],
    description: {
      type: String,
      required: false, // ✅ made optional to match zod
      default: "",
    },
    deletedAt: {
      type: Date,
      default: null,
      index: true,
    },
  },
  { timestamps: true }
);

// ✅ FIX: Prevent OverwriteModelError
const ProductVariantModel =
  mongoose.models.ProductVariant ||
  mongoose.model("ProductVariant", ProductVariantSchema, "productvariants");

export default ProductVariantModel;

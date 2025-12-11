import { z } from "zod";

export const zSchema = z.object({
  // 🔹 Product Variant fields
  product: z.string().min(3, { message: "Product is required" }),
  sku: z.string().min(1, { message: "SKU is required" }),
  color: z.string().min(1, { message: "Color is required" }),
  size: z.string().min(1, { message: "Size is required" }),
  code: z.string().min(1, { message: "code is required" }),
   minShoppingAmount: z.union([
    z.number(),
    z.string().transform((val) => Number(val)),
  ]),
   amount: z.union([
    z.number(),
    z.string().transform((val) => Number(val)),
  ]),
  validity: z.coerce.date(),
  mrp: z.union([
    z.number(),
    z.string().transform((val) => Number(val)),
  ]),
  sellingPrice: z.union([
    z.number(),
    z.string().transform((val) => Number(val)),
  ]),
  discountPercentage: z.union([
    z.number(),
    z.string().transform((val) => Number(val)),
  ]),
 

  media: z.array(z.string().min(1, "Media ID is required")),

  description: z.string().optional(), // ✅ optional field

  // 🔹 Other fields from old schema (if needed in other modules)
  email: z.string().email().optional(),
  password: z.string().optional(),
  name: z.string().optional(),
  otp: z.string().optional(),
  _id: z.string().optional(),
  alt: z.string().optional(),
  title: z.string().optional(),
  slug: z.string().optional(),
  category: z.string().optional(),

userId: z.string().min(3, { message: "User id is required" }),
rating: z.union([
    z.number().positive('Expected positive value, recived negative.'),
    z.string().transform((val) => Number(val)).refine((val) => !isNaN(val) && val >= 0, 'please provide a valid number. ')
  ]),
  review: z.string().min(3, { message: "Review is required" }),
code: z.string().min(3, { message: "Coupon code is required" }),
phone: z.string().min(10, { message: "Phone number is required" }),
country: z.string().min(3, { message: "Country is required" }),
state: z.string().min(3, { message: "State is required" }),
city: z.string().min(3, { message: "City is required" }),
pincode: z.string().min(3, { message: "Pincode: is required" }),
landmark: z.string().min(3, { message: "Landmark is required" }),
ordernote: z.string().optional(),
address: z.string().min(3, { message: "Address is required" }),
});


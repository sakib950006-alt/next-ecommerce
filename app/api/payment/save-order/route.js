import crypto from "crypto";
import mongoose from "mongoose";
import z from "zod";
import { orderNotification } from "@/email/orderNotification";
import { connectDB } from "@/lib/databaseConnection";
import { catchError } from "@/lib/helperFunction";
import { response } from "@/lib/response";
import { zSchema } from "@/lib/zodSchema";
import { sendMail } from "@/lib/sendMail";
import OrderModel from "@/models/Order.model";

export async function POST(request) {
  try {
    await connectDB();
    const payload = await request.json();

    console.log("PAYLOAD:", payload);

    // ---------------- Product & Order validation ----------------
    const productSchema = z.object({
      productId: z.string().optional(),
      variantId: z.string().optional(),
      name: z.string().min(1),
      qty: z.number().min(1),
      mrp: z.number().nonnegative(),
      sellingPrice: z.number().nonnegative(),
    });

    const orderSchema = zSchema
      .pick({
        name: true,
        email: true,
        phone: true,
        country: true,
        state: true,
        city: true,
        pincode: true,
        landmark: true,
        ordernote: true,
      })
      .extend({
        userId: z.string().optional(),
        razorpay_payment_id: z.string().min(3),
        razorpay_order_id: z.string().min(3),
        razorpay_signature: z.string().min(3),
        subtotal: z.number().nonnegative(),
        discount: z.number().nonnegative(),
        couponDiscountAmount: z.number().nonnegative(),
        totalAmount: z.number().nonnegative(),
        products: z.array(productSchema).min(1),
      });

    const parsed = orderSchema.safeParse(payload);
    if (!parsed.success) {
      console.log("Validation Error:", parsed.error);
      return response(false, 400, "Invalid or missing fields.", {
        error: parsed.error,
      });
    }
    const data = parsed.data;

    // ------------ Normalize products (fallback productId <- variantId) ------------
    const normalized = data.products.map((p, idx) => {
      const rawVariantId = p.variantId ?? p.variantid ?? p.variant ?? null;
      const rawProductId = p.productId ?? p.productid ?? p._id ?? rawVariantId ?? null;

      return {
        __index: idx,
        rawProductId,
        rawVariantId,
        name: p.name,
        qty: Number(p.qty),
        mrp: Number(p.mrp),
        sellingPrice: Number(p.sellingPrice),
      };
    });

    // ------------ Validate IDs (must be 24-hex) ------------
    for (const prod of normalized) {
      if (!prod.rawProductId) {
        return response(false, 400, `Missing productId at index ${prod.__index}`);
      }
      if (!prod.rawVariantId) {
        return response(false, 400, `Missing variantId at index ${prod.__index}`);
      }
      const isValidId = /^[0-9a-fA-F]{24}$/.test(prod.rawProductId);
      const isValidVar = /^[0-9a-fA-F]{24}$/.test(prod.rawVariantId);
      if (!isValidId) {
        return response(false, 400, `Invalid productId format at index ${prod.__index}`);
      }
      if (!isValidVar) {
        return response(false, 400, `Invalid variantId format at index ${prod.__index}`);
      }
    }

    // ---------------- Razorpay signature verification (HMAC SHA256) ----------------
    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (!secret) {
      console.log("Missing RAZORPAY_KEY_SECRET in env");
      return response(false, 500, "Server configuration error: payment secret missing.");
    }

    // compute expected signature
    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(`${data.razorpay_order_id}|${data.razorpay_payment_id}`)
      .digest("hex");

    if (expectedSignature !== data.razorpay_signature) {
      console.log("Signature mismatch:", { expectedSignature, received: data.razorpay_signature });
      return response(false, 400, "Payment verification failed (invalid signature).");
    }

    const paymentStatus = "pending";

    // ---------------- Convert to ObjectId & prepare for DB ----------------
    const productsToSave = normalized.map((p) => ({
      productId: new mongoose.Types.ObjectId(p.rawProductId),
      variantId: new mongoose.Types.ObjectId(p.rawVariantId),
      name: p.name,
      qty: p.qty,
      mrp: p.mrp,
      sellingPrice: p.sellingPrice,
    }));

    // ---------------- Save order ----------------
    const newOrder = await OrderModel.create({
      user: data.userId ? new mongoose.Types.ObjectId(data.userId) : undefined,
      name: data.name,
      email: data.email,
      phone: data.phone,
      country: data.country,
      state: data.state,
      city: data.city,
      pincode: data.pincode,
      landmark: data.landmark,
      ordernote: data.ordernote,
      products: productsToSave,
      subtotal: data.subtotal,
      discount: data.discount,
      couponDiscountAmount: data.couponDiscountAmount,
      totalAmount: data.totalAmount,
      payment_id: data.razorpay_payment_id,
      order_id: data.razorpay_order_id,
      status: paymentStatus,
    });

    // ---------------- Send confirmation email (best-effort) ----------------
    try {
      const mailData = {
        order_id: data.razorpay_order_id,
        orderDetailsUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/order-details/${data.razorpay_order_id}`,
      };
      await sendMail("Your order has been confirmed.", data.email, orderNotification(mailData));
    } catch (mailErr) {
      console.log("Mail error:", mailErr);
    }

    return response(true, 200, "Order placed successfully.", { order: newOrder });
  } catch (err) {
    console.log("SAVE ORDER ERROR:", err);
    return catchError(err);
  }
}

import { connectDB } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import MediaModel from "@/models/Media.model";
import cloudinary from "@/lib/cloudinary";
import { isAuthenticated } from "@/lib/authentication";

export async function POST(request) {
  let body = [];
  let insertedMedia = [];
  try {
    const auth = await isAuthenticated("admin");
    if (!auth.isAuth) return response(false, 403, "Unauthorized.");

    await connectDB();

    body = await request.json();
    console.log("👉 Payload received:", JSON.stringify(body, null, 2));

    if (!Array.isArray(body) || body.length === 0) {
      return response(false, 400, "Payload must be a non-empty array");
    }

    // ✅ Debug-friendly validation
    const invalid = body.find(
      (item) =>
        !item.asset_id ||
        !item.public_id ||
        !item.path ||
        !item.thumbnail_url ||
        !item.secure_url
    );

    if (invalid) {
      console.log("❌ Invalid Item Found:", invalid);
      return response(false, 400, "Missing required media fields");
    }

    insertedMedia = await MediaModel.insertMany(body, { ordered: false });
    console.log("✅ Inserted media into DB:", insertedMedia);

    return response(true, 200, "Media uploaded successfully", insertedMedia);
  } catch (error) {
    console.error("❌ Error occurred:", error);

    if (insertedMedia.length > 0) {
      const publicIds = insertedMedia.map((item) => item.public_id);
      try {
        await cloudinary.api.delete_resources(publicIds);
        console.log("✅ Cloudinary rollback done");
      } catch (deleteError) {
        console.error("❌ Cloudinary rollback error:", deleteError);
        error.cloudinary = deleteError;
      }
    }

    return catchError(error);
  }
}

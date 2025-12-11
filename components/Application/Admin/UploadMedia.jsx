"use client";
import { Button } from "@/components/ui/button";
import { CldUploadWidget } from "next-cloudinary";
import toast from "react-hot-toast";
import { FiPlus } from "react-icons/fi";
import axios from "axios";

const UploadMedia = ({ isMultiple = false, onUpload,queryClient }) => {
  const handleOnError = (error) => {
    toast.error("Upload failed. Please try again.");
    console.error("Cloudinary upload error:", error);
  };

  const handleOnQueueEnd = async (result) => {
    try {
      const files = result.info.files;

      const uploadedFiles = files
        .filter((file) => file.uploadInfo)
        .map((file) => ({
          asset_id: file.uploadInfo.asset_id,
          public_id: file.uploadInfo.public_id,
          path: file.uploadInfo.secure_url, // ✅ full URL
          thumbnail_url:
            file.uploadInfo.thumbnail_url || file.uploadInfo.secure_url,
          secure_url: file.uploadInfo.secure_url, // ✅ required
          alt: file.uploadInfo.original_filename || "",
          title: file.uploadInfo.original_filename || "",
        }));

      if (uploadedFiles.length === 0) return;

      console.log(
        "👉 Payload sent to API:",
        JSON.stringify(uploadedFiles, null, 2)
      );

      const { data: mediaUploadResponse } = await axios.post(
        "/api/media/create",
        uploadedFiles
      );

      if (!mediaUploadResponse.success) {
        throw new Error(mediaUploadResponse.message);
      }
queryClient.invalidateQueries(['media-data'])
      toast.success("Media uploaded successfully");

      if (onUpload) onUpload(mediaUploadResponse.data);
    } catch (error) {
      console.error("❌ API upload error:", error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <CldUploadWidget
      signatureEndpoint="/api/cloudinary-signature"
      uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
      onError={handleOnError}
      onQueuesEnd={handleOnQueueEnd}
      config={{
        cloud: {
          cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
          apiKey: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
        },
      }}
      options={{
        multiple: isMultiple,
        sources: ["local", "url", "unsplash", "google_drive"],
      }}
    >
      {({ open }) => (
        <Button onClick={() => open()}>
          <FiPlus />
          Upload Media
        </Button>
      )}
    </CldUploadWidget>
  );
};

export default UploadMedia;

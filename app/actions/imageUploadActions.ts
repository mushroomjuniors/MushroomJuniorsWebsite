"use server";

import { v2 as cloudinary, UploadApiResponse, UploadApiErrorResponse } from "cloudinary";
import { Readable } from "stream";

// Configure Cloudinary with environment variables
// Ensure these are set in your .env.local file
const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

// This initial check runs when the module is first loaded on the server.
if (!cloudName || !apiKey || !apiSecret) {
  console.error("[MODULE LOAD] Cloudinary environment variables are not fully configured.");
  console.error(`[MODULE LOAD] CLOUDINARY_CLOUD_NAME loaded as: ${cloudName}`);
  console.error(`[MODULE LOAD] CLOUDINARY_API_KEY loaded as: ${apiKey}`);
  console.error(`[MODULE LOAD] CLOUDINARY_API_SECRET loaded as: ${apiSecret}`);
} else {
  // This configuration should only happen if the above check passes.
  console.log("[MODULE LOAD] Cloudinary environment variables seem configured. Setting up Cloudinary config.");
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true, // Ensures HTTPS URLs are returned
  });
}

export async function uploadImageToCloudinary(
  formData: FormData
): Promise<{ success: boolean; url?: string; error?: string }> {
  // Debug logs that run every time the function is called
  console.log("--- [ACTION RUN] uploadImageToCloudinary called ---");
  console.log("[ACTION RUN] Checking configured env vars at the time of function call:");
  console.log(`[ACTION RUN] CLOUDINARY_CLOUD_NAME: ${process.env.CLOUDINARY_CLOUD_NAME}`);
  console.log(`[ACTION RUN] CLOUDINARY_API_KEY: ${process.env.CLOUDINARY_API_KEY}`);
  console.log(`[ACTION RUN] CLOUDINARY_API_SECRET: ${process.env.CLOUDINARY_API_SECRET}`);
  // console.log("[ACTION RUN] All process.env keys:", Object.keys(process.env)); // Uncomment for more verbosity

  // Re-check module-scoped constants to see if they were set during module load
  if (!cloudName || !apiKey || !apiSecret) {
    console.error("[ACTION RUN] Module-scoped Cloudinary vars (cloudName, apiKey, apiSecret) are STILL undefined/empty here.");
    return { success: false, error: "Cloudinary server configuration is incomplete (checked at action runtime)." };
  }

  const file = formData.get("file") as File | null;

  if (!file) {
    return { success: false, error: "No file provided in form data." };
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  console.log(`[ACTION RUN] Attempting to upload file: ${file.name}`);

  return new Promise((resolve) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {},
      (error?: UploadApiErrorResponse, result?: UploadApiResponse) => {
        if (error) {
          console.error("[ACTION RUN] Cloudinary uploader.upload_stream ERROR:", error);
          resolve({ success: false, error: error.message });
        } else if (result) {
          console.log("[ACTION RUN] Cloudinary uploader.upload_stream SUCCESS:", result.secure_url);
          resolve({ success: true, url: result.secure_url });
        } else {
          console.error("[ACTION RUN] Cloudinary uploader.upload_stream UNKNOWN_ERROR (no error, no result).");
          resolve({ success: false, error: "Unknown Cloudinary upload error" });
        }
      }
    );
    const readableStream = new Readable();
    readableStream._read = () => {};
    readableStream.push(buffer);
    readableStream.push(null);
    readableStream.pipe(uploadStream);
  });
} 

import { createHash } from "crypto";

function getCloudinaryConfig() {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error(
      "Cloudinary is not configured. Check CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET."
    );
  }

  return { cloudName, apiKey, apiSecret };
}

function createSignature(
  params: Record<string, string>,
  secret: string
) {
  const value = Object.keys(params)
    .sort()
    .map((key) => `${key}=${params[key]}`)
    .join("&");

  return createHash("sha1")
    .update(`${value}${secret}`)
    .digest("hex");
}

export async function uploadWorkImage(file: File) {
  const { cloudName, apiKey, apiSecret } = getCloudinaryConfig();

  const timestamp = Math.floor(Date.now() / 1000).toString();
  const folder = "colorhub/our-work";

  const form = new FormData();
  form.append("file", file);
  form.append("api_key", apiKey);
  form.append("timestamp", timestamp);
  form.append("folder", folder);
  form.append(
    "signature",
    createSignature({ folder, timestamp }, apiSecret)
  );

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    {
      method: "POST",
      body: form,
      cache: "no-store",
    }
  );

  const result = await response.json();

  if (
    !response.ok ||
    !result.secure_url ||
    !result.public_id
  ) {
    console.error("Cloudinary upload failed:", result);
    throw new Error("Image upload failed. Check Cloudinary settings.");
  }

  return {
    imageUrl: String(result.secure_url),
    imagePublicId: String(result.public_id),
  };
}

export async function deleteWorkImage(publicId: string) {
  if (!publicId) return;

  const { cloudName, apiKey, apiSecret } = getCloudinaryConfig();
  const timestamp = Math.floor(Date.now() / 1000).toString();

  const form = new FormData();
  form.append("public_id", publicId);
  form.append("api_key", apiKey);
  form.append("timestamp", timestamp);
  form.append(
    "signature",
    createSignature(
      { public_id: publicId, timestamp },
      apiSecret
    )
  );

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`,
    {
      method: "POST",
      body: form,
      cache: "no-store",
    }
  );

  const result = await response.json();

  if (
    !response.ok ||
    !["ok", "not found"].includes(String(result.result))
  ) {
    console.error("Cloudinary delete failed:", result);
    throw new Error("Could not delete the Cloudinary image.");
  }
}

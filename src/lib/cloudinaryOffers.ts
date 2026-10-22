
import { createHash } from "crypto";

function cloudinaryConfig() {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error(
      "Cloudinary environment variables are not configured."
    );
  }

  return { cloudName, apiKey, apiSecret };
}

function signatureFor(
  params: Record<string, string>,
  apiSecret: string
) {
  const toSign = Object.keys(params)
    .sort()
    .map((key) => `${key}=${params[key]}`)
    .join("&");

  return createHash("sha1")
    .update(`${toSign}${apiSecret}`)
    .digest("hex");
}

export async function uploadOfferImage(file: File) {
  const { cloudName, apiKey, apiSecret } = cloudinaryConfig();

  const timestamp = Math.floor(Date.now() / 1000).toString();
  const folder = "colorhub/offers";

  const signature = signatureFor(
    { folder, timestamp },
    apiSecret
  );

  const form = new FormData();
  form.append("file", file);
  form.append("api_key", apiKey);
  form.append("timestamp", timestamp);
  form.append("folder", folder);
  form.append("signature", signature);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    {
      method: "POST",
      body: form,
      cache: "no-store",
    }
  );

  const data = await response.json();

  if (
    !response.ok ||
    !data.secure_url ||
    !data.public_id
  ) {
    console.error("Cloudinary upload failed:", data);
    throw new Error(
      "Image upload failed. Check Cloudinary configuration and try again."
    );
  }

  return {
    imageUrl: String(data.secure_url),
    imagePublicId: String(data.public_id),
  };
}

export async function deleteCloudinaryImage(
  publicId: string
) {
  const { cloudName, apiKey, apiSecret } = cloudinaryConfig();

  const timestamp = Math.floor(Date.now() / 1000).toString();

  const signature = signatureFor(
    {
      public_id: publicId,
      timestamp,
    },
    apiSecret
  );

  const body = new FormData();
  body.append("public_id", publicId);
  body.append("api_key", apiKey);
  body.append("timestamp", timestamp);
  body.append("signature", signature);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`,
    {
      method: "POST",
      body,
      cache: "no-store",
    }
  );

  const data = await response.json();

  if (
    !response.ok ||
    !["ok", "not found"].includes(String(data.result))
  ) {
    console.error("Cloudinary deletion failed:", data);
    throw new Error("Cloudinary image deletion failed.");
  }
}

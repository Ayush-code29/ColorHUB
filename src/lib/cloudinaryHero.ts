import { createHash } from "crypto";

function getCloudinaryConfig() {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error(
      "Cloudinary configuration missing. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET."
    );
  }

  return { cloudName, apiKey, apiSecret };
}

function createSignature(
  params: Record<string, string>,
  apiSecret: string
) {
  const value = Object.keys(params)
    .sort()
    .map((key) => `${key}=${params[key]}`)
    .join("&");

  return createHash("sha1")
    .update(`${value}${apiSecret}`)
    .digest("hex");
}

export async function uploadHeroImage(file: File) {
  const { cloudName, apiKey, apiSecret } = getCloudinaryConfig();

  const timestamp = Math.floor(Date.now() / 1000).toString();
  const folder = "aashirvad-paint/hero-banner";

  const signature = createSignature(
    { folder, timestamp },
    apiSecret
  );

  const form = new FormData();

  form.append("file", file);
  form.append("api_key", apiKey);
  form.append("timestamp", timestamp);
  form.append("folder", folder);
  form.append("signature", signature);

  let response: Response;

  try {
    response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: "POST",
        body: form,
        cache: "no-store",
      }
    );
  } catch (error) {
    console.error("Cloudinary network error:", error);
    throw new Error("Could not connect to Cloudinary. Check server network.");
  }

  const data = await response.json().catch(() => null);

  if (!response.ok || !data?.secure_url || !data?.public_id) {
    console.error("Cloudinary upload response:", data);

    throw new Error(
      data?.error?.message ||
        `Cloudinary upload failed with status ${response.status}.`
    );
  }

  return {
    imageUrl: String(data.secure_url),
    imagePublicId: String(data.public_id),
  };
}

export async function deleteHeroImage(publicId: string) {
  if (!publicId) return;

  const { cloudName, apiKey, apiSecret } = getCloudinaryConfig();

  const timestamp = Math.floor(Date.now() / 1000).toString();

  const signature = createSignature(
    {
      public_id: publicId,
      timestamp,
    },
    apiSecret
  );

  const form = new FormData();

  form.append("public_id", publicId);
  form.append("api_key", apiKey);
  form.append("timestamp", timestamp);
  form.append("signature", signature);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`,
    {
      method: "POST",
      body: form,
      cache: "no-store",
    }
  );

  const data = await response.json().catch(() => null);

  if (
    !response.ok ||
    !["ok", "not found"].includes(String(data?.result))
  ) {
    console.error("Cloudinary delete response:", data);

    throw new Error(
      data?.error?.message || "Unable to delete image from Cloudinary."
    );
  }
}
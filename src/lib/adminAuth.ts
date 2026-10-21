
import { cookies } from "next/headers";
import { jwtVerify, SignJWT } from "jose";

export const ADMIN_COOKIE_NAME = "colorhub_admin_session";

const SESSION_DURATION_SECONDS = 8 * 60 * 60;

function getSecret() {
  const secret = process.env.ADMIN_SESSION_SECRET;

  if (!secret || secret.length < 32) {
    throw new Error(
      "ADMIN_SESSION_SECRET must be at least 32 characters."
    );
  }

  return new TextEncoder().encode(secret);
}

export async function createAdminSession() {
  const email = process.env.ADMIN_EMAIL;

  if (!email) {
    throw new Error("ADMIN_EMAIL is not configured.");
  }

  return new SignJWT({
    role: "admin",
    email: email.trim().toLowerCase(),
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DURATION_SECONDS}s`)
    .sign(getSecret());
}

export async function isAdminAuthenticated() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;

    if (!token) {
      return false;
    }

    const { payload } = await jwtVerify(token, getSecret());

    const configuredEmail = process.env.ADMIN_EMAIL
      ?.trim()
      .toLowerCase();

    return (
      payload.role === "admin" &&
      typeof payload.email === "string" &&
      payload.email === configuredEmail
    );
  } catch {
    return false;
  }
}

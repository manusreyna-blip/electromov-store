import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";

const COOKIE = "em_admin";
const DAY = 60 * 60 * 24;

function secret() {
  const value = process.env.AUTH_SECRET || process.env.ADMIN_PASSWORD || "electromov-dev-secret-cambiar";
  return new TextEncoder().encode(value.padEnd(32, "0"));
}

export function adminPasswordConfigured() {
  return Boolean(process.env.ADMIN_PASSWORD);
}

/** Password del panel. Si no hay ADMIN_PASSWORD definido, se usa una de desarrollo. */
export function checkPassword(password: string) {
  const expected = process.env.ADMIN_PASSWORD || "electromov";
  if (password.length !== expected.length) return false;
  let diff = 0;
  for (let i = 0; i < password.length; i++) diff |= password.charCodeAt(i) ^ expected.charCodeAt(i);
  return diff === 0;
}

export async function createSession() {
  const token = await new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret());

  const store = await cookies();
  store.set(COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: DAY * 7,
  });
}

export async function destroySession() {
  const store = await cookies();
  store.delete(COOKIE);
}

export async function isAuthenticated() {
  const store = await cookies();
  const token = store.get(COOKIE)?.value;
  if (!token) return false;
  try {
    await jwtVerify(token, secret());
    return true;
  } catch {
    return false;
  }
}

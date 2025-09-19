import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const AUTH_COOKIE = "authToken";

// Lightweight decode for JWT payload (routing only; no signature verification)
function decodeJwtPayload(token) {
  try {
    const base64 = token.split(".")[1];
    if (!base64) return null;
    const json = Buffer.from(base64.replace(/-/g, "+").replace(/_/g, "/"), "base64").toString("utf-8");
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export async function GET() {
  const cookieStore = cookies();
  const token = cookieStore.get(AUTH_COOKIE)?.value;

  if (!token) {
    // No session cookie; return user: null but 200 to avoid client throwing
    return NextResponse.json({ user: null }, { status: 200 });
  }

  const payload = decodeJwtPayload(token);
  if (!payload) {
    return NextResponse.json({ user: null }, { status: 200 });
  }

  // If your backend embeds a "user" claim, prefer it. Otherwise build from common JWT fields.
  const user =
    payload.user ??
    {
      id: payload.sub ?? payload.id ?? null,
      email: payload.email ?? null,
      name: payload.name ?? null,
      role: payload.role ?? (Array.isArray(payload.roles) ? payload.roles[0] : null),
      roles: Array.isArray(payload.roles)
        ? payload.roles
        : payload.role
        ? [payload.role]
        : Array.isArray(payload.permissions)
        ? payload.permissions
        : [],
    };

  return NextResponse.json({ user }, { status: 200 });
}
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../[...nextauth]/route";

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return NextResponse.redirect(new URL("/login?error=NoSession", req.url));
    }

    const { email, name } = session.user;

    const gql = `
      mutation LoginWithGoogle($email: String!, $name: String) {
        loginWithGoogle(email: $email, name: $name) {
          token
          user { id name email role active lastLogin createdAt updatedAt }
        }
      }
    `;

    const res = await fetch(process.env.NEXT_PUBLIC_GRAPHQL_API_URL || "http://localhost:4000/graphql", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: gql, variables: { email, name } }),
      cache: "no-store",
    });

    if (!res.ok) {
      return NextResponse.redirect(new URL("/login?error=Backend", req.url));
    }

    const data = await res.json();
    const payload = data?.data?.loginWithGoogle;

    if (!payload?.token) {
      return NextResponse.redirect(new URL("/login?error=NoToken", req.url));
    }

    const url = new URL(req.url);
    const next = url.searchParams.get("next") || "/dashboard";
    const redirectUrl = new URL(`/auth/callback?token=${encodeURIComponent(payload.token)}&next=${encodeURIComponent(next)}`, req.url);

    return NextResponse.redirect(redirectUrl);
  } catch (err) {
    return NextResponse.redirect(new URL("/login?error=Unknown", req.url));
  }
}

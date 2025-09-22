import { NextRequest } from "next/server";

const API = process.env.API_BASE_URL!; // server-only, e.g. http://localhost:5171

export async function POST(req: NextRequest) {
  const body = await req.text();
  const res = await fetch(`${API}/api/auth/login`, {
    method: "POST",
    body,
    headers: { "Content-Type": "application/json" },
    // include NO cookies from Next here; login sets cookies in response
  });

  const text = await res.text();
  const out = new Response(text || null, {
    status: res.status,
    headers: { "Content-Type": "application/json" },
  });
  // Pass through Set-Cookie from API to browser
  const setCookie = res.headers.get("set-cookie");
  if (setCookie) out.headers.append("set-cookie", setCookie);
  return out;
}

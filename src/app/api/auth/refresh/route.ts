import { cookies } from "next/headers";
const API = process.env.API_BASE_URL!;

export async function POST() {
  const cookie = cookies().toString();
  const res = await fetch(`${API}/api/auth/refresh`, {
    method: "POST",
    headers: { cookie },
  });
  const text = await res.text();
  const out = new Response(text || null, {
    status: res.status,
    headers: { "Content-Type": "application/json" },
  });
  const setCookie = res.headers.get("set-cookie");
  if (setCookie) out.headers.append("set-cookie", setCookie);
  return out;
}

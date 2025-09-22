import { cookies } from "next/headers";
const API = process.env.API_BASE_URL!;
export async function POST() {
  const cookie = cookies().toString();
  const res = await fetch(`${API}/api/auth/logout`, {
    method: "POST",
    credentials: "include",
    headers: { cookie },
  });
  const out = new Response(null, { status: res.status });
  const setCookie = res.headers.get("set-cookie");
  if (setCookie) out.headers.append("set-cookie", setCookie);
  return out;
}

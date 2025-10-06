export function getRootHost(): string {
  // Prefer explicit env var in prod to handle multi-level TLDs (e.g. abclettings.co.uk)
  const env = process.env.NEXT_PUBLIC_ROOT_HOST?.toLowerCase();
  if (env) return env;

  const h = window.location.hostname.toLowerCase();

  // For localhost / 127.0.0.1 (keep host as-is and preserve port)
  if (h === "localhost" || /^\d+\.\d+\.\d+\.\d+$/.test(h)) return h;

  // Simple fallback: take the last two labels (works for lvh.me/localtest.me/sslip.io)
  const parts = h.split(".");
  return parts.length <= 2 ? h : parts.slice(-2).join(".");
}

export function isOnAgencyHost(slug: string): boolean {
  const host = window.location.hostname.toLowerCase();
  return host.startsWith(`${slug.toLowerCase()}.`);
}

// export function buildAgencyUrl(slug: string, path = "/app"): string {
//   const root = getRootHost();
//   const proto = window.location.protocol;
//   // Keep port for dev servers (e.g. Next on :3000)
//   const port = window.location.port ? `:${window.location.port}` : "";
//   return `${proto}//${slug}.${root}${port}${path}`;
// }

export function buildAgencyUrl(slug: string, path = "/app") {
  // dev uses agency.localhost:3000
  const port = window.location.port ? `:${window.location.port}` : "";
  return `http://${slug}.localhost${port}${path}`;
}

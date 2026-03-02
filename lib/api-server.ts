/**
 * Server-safe fetch utility for generateMetadata() and sitemap.
 * Uses native fetch with Next.js caching — no localStorage dependency.
 */

const API_BASE_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://127.0.0.1:8000";

export async function serverFetch<T>(
  endpoint: string,
  options?: { revalidate?: number }
): Promise<T> {
  const res = await fetch(`${API_BASE_URL}/api${endpoint}`, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "ngrok-skip-browser-warning": "true",
    },
    next: { revalidate: options?.revalidate ?? 300 },
  });

  if (!res.ok) {
    throw new Error(`Server fetch failed: ${res.status} ${res.statusText}`);
  }

  return res.json() as Promise<T>;
}

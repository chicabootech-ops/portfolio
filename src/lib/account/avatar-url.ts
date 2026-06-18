import { apiConfig } from "@/config/api";

/** Resolve avatar URL from API (relative path, R2 CDN, or local blob preview). */
export function resolveAvatarUrl(url: string | null): string | null {
  if (!url) return null;
  if (url.startsWith("blob:") || url.startsWith("data:")) return url;
  if (url.startsWith("http://") || url.startsWith("https://")) return url;

  const base = apiConfig.baseUrl.replace(/\/$/, "");
  return `${base}${url.startsWith("/") ? url : `/${url}`}`;
}

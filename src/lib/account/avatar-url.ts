import { apiConfig } from "@/config/api";

/** R2 object keys are not directly loadable in the browser. */
export function isStorageAvatarKey(url: string | null | undefined): boolean {
  return Boolean(url?.startsWith("avatars/"));
}

/** Resolve avatar URL from API path, R2 CDN, or local blob preview. */
export function resolveAvatarUrl(url: string | null): string | null {
  if (!url) return null;
  if (url.startsWith("blob:") || url.startsWith("data:")) return url;
  if (isStorageAvatarKey(url)) return null;
  if (url.startsWith("http://") || url.startsWith("https://")) return url;

  const base = apiConfig.baseUrl.replace(/\/$/, "");
  return `${base}${url.startsWith("/") ? url : `/${url}`}`;
}

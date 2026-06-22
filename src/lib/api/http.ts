import type { ApiErrorBody } from "@/types/user";
import { UserApiError } from "@/types/user";

type RequestOptions = {
  method?: string;
  body?: unknown;
  headers?: Record<string, string>;
};

async function parseError(response: Response): Promise<UserApiError> {
  let body: ApiErrorBody = {};
  try {
    body = (await response.json()) as ApiErrorBody;
  } catch {
    // ignore
  }
  const message =
    body.message ??
    body.error ??
    (typeof body.detail === "string" ? body.detail : undefined) ??
    `Request failed (${response.status})`;
  return new UserApiError(message, response.status, body.code);
}

export async function apiFetch<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const headers: Record<string, string> = {
    Accept: "application/json",
    ...options.headers,
  };

  let body: BodyInit | undefined;
  if (options.body !== undefined) {
    headers["Content-Type"] = "application/json";
    body = JSON.stringify(options.body);
  }

  const response = await fetch(path, {
    method: options.method ?? "GET",
    credentials: "same-origin",
    cache: "no-store",
    headers,
    body,
  });

  if (!response.ok) {
    throw await parseError(response);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

export async function apiUploadToUrl(
  uploadUrl: string,
  file: Blob,
  contentType: string,
  onProgress?: (percent: number) => void
): Promise<void> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("PUT", uploadUrl);
    xhr.setRequestHeader("Content-Type", contentType);

    if (onProgress) {
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          onProgress(Math.round((event.loaded / event.total) * 100));
        }
      };
    }

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve();
      } else {
        reject(new UserApiError(`Upload failed (${xhr.status})`, xhr.status, "upload_failed"));
      }
    };
    xhr.onerror = () => reject(new UserApiError("Upload network error", 0, "upload_network_error"));
    xhr.send(file);
  });
}

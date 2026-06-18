const SAFE_AUTH_ERRORS: Record<number, string> = {
  400: "Request could not be completed. Please check your details and try again.",
  401: "Invalid email or password.",
  429: "Too many attempts. Please wait and try again.",
  503: "Service temporarily unavailable. Please try again shortly.",
};

export function getSafeAuthError(status: number): string {
  return (
    SAFE_AUTH_ERRORS[status] ??
    "Something went wrong. Please try again."
  );
}

type BackendErrorBody = {
  error?: string;
  detail?: string | { msg: string }[];
};

export function parseBackendError(
  body: BackendErrorBody,
  status: number
): string {
  if (typeof body.error === "string" && body.error.trim()) {
    return body.error;
  }

  if (status === 422) {
    return SAFE_AUTH_ERRORS[400] ?? getSafeAuthError(status);
  }

  return getSafeAuthError(status);
}

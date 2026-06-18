import type { AuthSessionResponse, LoginCredentials, SignupCredentials } from "@/types/auth";

type ApiErrorBody = {
  error?: string;
};

async function postAuth<TBody extends object>(
  path: string,
  body: TBody,
  fallbackError: string
): Promise<AuthSessionResponse> {
  const response = await fetch(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    credentials: "same-origin",
  });

  const data = (await response.json().catch(() => ({}))) as
    | AuthSessionResponse
    | ApiErrorBody;

  if (!response.ok) {
    const message =
      typeof data === "object" && data && "error" in data && data.error
        ? data.error
        : fallbackError;
    throw new Error(message);
  }

  return data as AuthSessionResponse;
}

export function loginUser(credentials: LoginCredentials) {
  return postAuth("/api/auth/login", credentials, "Unable to sign in.");
}

export function registerUser(credentials: SignupCredentials) {
  return postAuth(
    "/api/auth/register",
    credentials,
    "Unable to create your account."
  );
}

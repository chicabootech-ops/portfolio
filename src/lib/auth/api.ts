import { apiConfig } from "@/config/api";
import type {
  AuthResponse,
  LoginCredentials,
  SignupCredentials,
} from "@/types/auth";

type ApiErrorBody = {
  detail?: string | { msg: string }[];
};

function parseErrorMessage(body: ApiErrorBody, fallback: string): string {
  if (!body.detail) return fallback;
  if (typeof body.detail === "string") return body.detail;
  if (Array.isArray(body.detail) && body.detail.length > 0) {
    return body.detail[0]?.msg ?? fallback;
  }
  return fallback;
}

async function postAuth<TBody extends object>(
  path: string,
  body: TBody,
  fallbackError: string
): Promise<AuthResponse> {
  const response = await fetch(`${apiConfig.baseUrl}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = (await response.json().catch(() => ({}))) as
    | AuthResponse
    | ApiErrorBody;

  if (!response.ok) {
    throw new Error(parseErrorMessage(data as ApiErrorBody, fallbackError));
  }

  return data as AuthResponse;
}

export function loginUser(credentials: LoginCredentials) {
  return postAuth(apiConfig.auth.login, credentials, "Unable to sign in.");
}

export function registerUser(credentials: SignupCredentials) {
  return postAuth(
    apiConfig.auth.register,
    credentials,
    "Unable to create your account."
  );
}

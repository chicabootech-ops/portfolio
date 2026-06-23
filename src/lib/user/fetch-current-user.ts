import type { CurrentUser } from "@/types/user";
import { UserApiError } from "@/types/user";
import { userService } from "@/services/user.service";

/** Shared fetcher — returns null when unauthenticated (no throw). */
export async function fetchCurrentUser(): Promise<CurrentUser | null> {
  try {
    return await userService.getMe();
  } catch (error) {
    if (error instanceof UserApiError && (error.status === 401 || error.status === 403)) {
      return null;
    }
    throw error;
  }
}

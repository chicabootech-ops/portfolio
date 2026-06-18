import { jwtVerify } from "jose";

function getJwtSecret(): Uint8Array | null {
  const secret = process.env.AUTH_JWT_SECRET;
  if (!secret) return null;
  return new TextEncoder().encode(secret);
}

export async function verifyAccessToken(token: string) {
  const secret = getJwtSecret();
  if (!secret) return null;

  try {
    const { payload } = await jwtVerify(token, secret, {
      algorithms: ["HS256"],
    });

    if (payload.type !== "access") {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

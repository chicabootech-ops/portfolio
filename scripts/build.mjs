import { spawnSync } from "node:child_process";

/**
 * Cloudflare dashboard runs `npm run build` then `npx wrangler deploy`.
 * OpenNext itself also runs `npm run build` to invoke Next.js.
 *
 * - Top-level build → OpenNext (produces `.open-next/worker.js`)
 * - Nested build (from OpenNext) → `next build`
 */
function run(command, args) {
  const result = spawnSync(command, args, {
    stdio: "inherit",
    env: process.env,
    shell: process.platform === "win32",
  });
  if (result.error) throw result.error;
  process.exit(result.status ?? 1);
}

if (process.env.OPENNEXT_NESTED_NEXT_BUILD === "1") {
  // Webpack produces a smaller OpenNext Worker than Turbopack (fewer duplicate route chunks).
  run("npx", ["next", "build", "--webpack"]);
}

process.env.OPENNEXT_NESTED_NEXT_BUILD = "1";
run("npx", ["opennextjs-cloudflare", "build"]);

import createMiddleware from "next-intl/middleware";
import { routing } from "@/lib/i18n/routing";

// Next.js 16 renamed `middleware.ts` to `proxy.ts` (exports `proxy`, not
// `middleware`). next-intl's handler is a plain (request) => response
// function, so it is re-exported under the new name unchanged.
const intlMiddleware = createMiddleware(routing);

export function proxy(request: Parameters<typeof intlMiddleware>[0]) {
  return intlMiddleware(request);
}

export const config = {
  matcher: ["/((?!api|admin|_next|.*\\..*).*)"],
};

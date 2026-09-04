import { createMiddleware } from '@tanstack/react-start'
import { supabase } from './client'
import { getLocalUser } from '@/lib/auth-helpers'

// Must be registered as a global `functionMiddleware` in `src/start.ts`; otherwise
// the browser never attaches the bearer token to serverFn RPCs.
export const attachSupabaseAuth = createMiddleware({ type: 'function' }).client(
  async ({ next }) => {
    let token: string | undefined;
    try {
      const { data } = await supabase.auth.getSession()
      token = data?.session?.access_token
    } catch {
      // Supabase session fetch failed
    }

    if (!token) {
      const localUser = getLocalUser();
      if (localUser) {
        token = `demo-local-token-${localUser.id}`;
      }
    }

    return next({
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
  },
)

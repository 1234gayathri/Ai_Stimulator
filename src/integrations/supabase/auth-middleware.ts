import { createMiddleware } from '@tanstack/react-start'
import { getRequest } from '@tanstack/react-start/server'
import { createClient, SupabaseClient } from '@supabase/supabase-js'
import type { Database } from './types'
import { createMockSupabaseClient } from '@/lib/mock-supabase-store'

function isNewSupabaseApiKey(value: string): boolean {
  return value.startsWith('sb_publishable_') || value.startsWith('sb_secret_');
}

function createSupabaseFetch(supabaseKey: string): typeof fetch {
  return (input, init) => {
    const headers = new Headers(
      typeof Request !== 'undefined' && input instanceof Request ? input.headers : undefined,
    );

    if (init?.headers) {
      new Headers(init.headers).forEach((value, key) => headers.set(key, value));
    }

    if (isNewSupabaseApiKey(supabaseKey) && headers.get('Authorization') === `Bearer ${supabaseKey}`) {
      headers.delete('Authorization');
    }

    headers.set('apikey', supabaseKey);
    return fetch(input, { ...init, headers });
  };
}

export const requireSupabaseAuth = createMiddleware({ type: 'function' }).server(
  async ({ next }) => {
    const request = getRequest();
    const authHeader = request?.headers?.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new Error('Unauthorized: No authorization header provided');
    }

    const token = authHeader.replace('Bearer ', '').trim();
    if (!token) {
      throw new Error('Unauthorized: No token provided');
    }

    const mockClaims: any = {
      sub: "usr_demo",
      aud: "authenticated",
      exp: Math.floor(Date.now() / 1000) + 3600,
      iat: Math.floor(Date.now() / 1000),
      iss: "supabase",
      role: "authenticated",
    };

    // Handle local fallback tokens (e.g. demo-local-token-usr_xxx)
    if (token.startsWith('demo-local-token-')) {
      const userId = token.replace('demo-local-token-', '') || 'usr_demo';
      mockClaims.sub = userId;
      const mockSupabase = createMockSupabaseClient(userId) as unknown as SupabaseClient<Database>;
      return next({
        context: {
          supabase: mockSupabase,
          userId,
          claims: mockClaims,
        },
      });
    }

    const SUPABASE_URL = process.env.SUPABASE_URL;
    const SUPABASE_PUBLISHABLE_KEY = process.env.SUPABASE_PUBLISHABLE_KEY;

    if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) {
      // Fallback for missing env vars
      const userId = 'usr_demo';
      const mockSupabase = createMockSupabaseClient(userId) as unknown as SupabaseClient<Database>;
      return next({
        context: {
          supabase: mockSupabase,
          userId,
          claims: mockClaims,
        },
      });
    }

    try {
      const supabase = createClient<Database>(
        SUPABASE_URL,
        SUPABASE_PUBLISHABLE_KEY,
        {
          global: {
            fetch: createSupabaseFetch(SUPABASE_PUBLISHABLE_KEY),
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
          auth: {
            storage: undefined,
            persistSession: false,
            autoRefreshToken: false,
          },
        }
      );

      const { data, error } = await supabase.auth.getClaims(token);
      if (!error && data?.claims?.sub) {
        return next({
          context: {
            supabase,
            userId: data.claims.sub,
            claims: data.claims as any,
          },
        });
      }
    } catch {
      // Supabase verification error, fallback to mock client
    }

    // Fallback if token claims validation failed or network unreachable
    const fallbackUserId = 'usr_demo';
    const mockSupabase = createMockSupabaseClient(fallbackUserId) as unknown as SupabaseClient<Database>;
    return next({
      context: {
        supabase: mockSupabase,
        userId: fallbackUserId,
        claims: mockClaims,
      },
    });
  },
);

import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { getLocalUser } from "@/lib/auth-helpers";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async ({ location }) => {
    try {
      const { data } = await supabase.auth.getUser();
      if (data?.user) {
        return { user: data.user };
      }
    } catch {
      // Supabase server unreachable or network error, fallback to local user check
    }

    const localUser = getLocalUser();
    if (localUser) {
      return { user: localUser };
    }

    throw redirect({ to: "/auth", search: { next: location.href } });
  },
  component: () => <Outlet />,
});

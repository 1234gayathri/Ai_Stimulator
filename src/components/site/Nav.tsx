import { Link, useRouter } from "@tanstack/react-router";
import { LogOut, User } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { getLocalUser, clearLocalUser } from "@/lib/auth-helpers";
import { useQueryClient } from "@tanstack/react-query";
import { Logo } from "./Logo";

/** Derive the best display name from whatever auth source we have */
function resolveDisplayName(
  supabaseUser: { email?: string | null; user_metadata?: Record<string, any> } | null
): { username: string; initial: string } | null {
  if (!supabaseUser) return null;

  // Prefer explicit username metadata
  const meta = supabaseUser.user_metadata ?? {};
  const username: string =
    meta.username ||
    meta.preferred_username ||
    meta.full_name ||
    (supabaseUser.email ?? "").split("@")[0] ||
    "user";

  return { username, initial: username.charAt(0).toUpperCase() };
}

export function Nav() {
  const [display, setDisplay] = useState<{ username: string; initial: string } | null>(null);
  const router = useRouter();
  const qc = useQueryClient();

  const updateFromLocalUser = () => {
    const localUser = getLocalUser();
    if (!localUser) { setDisplay(null); return; }

    // Use stored username, fallback to metadata, then strip synthetic domain
    const username: string =
      localUser.username ||
      localUser.user_metadata?.username ||
      localUser.user_metadata?.full_name ||
      localUser.email.replace(/@ai-stimulator\.local$/, "").replace(/@.*$/, "") ||
      "user";

    setDisplay({ username, initial: username.charAt(0).toUpperCase() });
  };

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        if (data?.session?.user) {
          const resolved = resolveDisplayName(data.session.user);
          if (resolved) { setDisplay(resolved); return; }
        }
      } catch {
        // Ignore network errors
      }
      updateFromLocalUser();
    };

    checkUser();

    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      if (session?.user) {
        const resolved = resolveDisplayName(session.user);
        if (resolved) { setDisplay(resolved); return; }
      }
      updateFromLocalUser();
    });

    return () => sub?.subscription?.unsubscribe();
  }, []);

  async function signOut() {
    await qc.cancelQueries();
    qc.clear();
    clearLocalUser();
    try {
      await supabase.auth.signOut();
    } catch {
      // Ignore network errors on signout
    }
    setDisplay(null);
    router.navigate({ to: "/auth", replace: true });
  }

  return (
    <header className="fixed top-0 inset-x-0 z-50 px-4 pt-4">
      <div className="mx-auto max-w-6xl glass rounded-full flex items-center justify-between px-4 py-2.5">
        <Link to="/" className="flex items-center gap-2">
          <Logo size={32} />
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
          <Link to="/resume" className="hover:text-foreground transition" activeProps={{ className: "text-foreground" }}>Resume</Link>
          <Link to="/roadmap" className="hover:text-foreground transition" activeProps={{ className: "text-foreground" }}>Roadmap</Link>
          <Link to="/interview" className="hover:text-foreground transition" activeProps={{ className: "text-foreground" }}>Interview</Link>
          <Link to="/report" className="hover:text-foreground transition" activeProps={{ className: "text-foreground" }}>Report</Link>
          <Link to="/pricing" className="hover:text-foreground transition" activeProps={{ className: "text-foreground" }}>Pricing</Link>
          <Link to="/faq" className="hover:text-foreground transition" activeProps={{ className: "text-foreground" }}>FAQ</Link>
        </nav>
        <div className="flex items-center gap-2">
          {display ? (
            <>
              {/* Avatar badge + username */}
              <div className="hidden sm:flex items-center gap-2">
                <div
                  className="size-7 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                  style={{ background: "var(--gradient-primary)" }}
                >
                  {display.initial}
                </div>
                <span className="text-sm font-medium text-foreground max-w-[140px] truncate">
                  {display.username}
                </span>
              </div>
              <button
                onClick={signOut}
                className="text-sm text-muted-foreground hover:text-foreground px-3 py-1.5 inline-flex items-center gap-1.5 transition"
              >
                <LogOut className="size-3.5" /> Sign out
              </button>
            </>
          ) : (
            <>
              <Link to="/auth" className="hidden sm:block text-sm text-muted-foreground hover:text-foreground px-3 py-1.5 transition">
                Sign in
              </Link>
              <Link
                to="/resume"
                className="text-sm font-medium text-white px-4 py-2 rounded-full transition hover:opacity-90"
                style={{ background: "var(--gradient-primary)" }}
              >
                Get started
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

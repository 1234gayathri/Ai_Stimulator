import { Link, useRouter } from "@tanstack/react-router";
import { LogOut } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { getLocalUser, clearLocalUser } from "@/lib/auth-helpers";
import { useQueryClient } from "@tanstack/react-query";
import { Logo } from "./Logo";

export function Nav() {
  const [email, setEmail] = useState<string | null>(null);
  const router = useRouter();
  const qc = useQueryClient();

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        if (data?.session?.user?.email) {
          setEmail(data.session.user.email);
          return;
        }
      } catch {
        // Ignore network errors
      }

      const localUser = getLocalUser();
      if (localUser) {
        setEmail(localUser.email);
      } else {
        setEmail(null);
      }
    };

    checkUser();

    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      if (session?.user?.email) {
        setEmail(session.user.email);
      } else {
        const local = getLocalUser();
        setEmail(local?.email ?? null);
      }
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
    setEmail(null);
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
          {email ? (
            <>
              <span className="hidden sm:block text-xs text-muted-foreground max-w-[160px] truncate">{email}</span>
              <button
                onClick={signOut}
                className="text-sm text-muted-foreground hover:text-foreground px-3 py-1.5 inline-flex items-center gap-1.5"
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

import { Link } from "@tanstack/react-router";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="px-6 py-14 border-t border-white/5">
      <div className="mx-auto max-w-6xl grid gap-8 md:grid-cols-4 text-sm">
        <div>
          <Link to="/" className="flex items-center gap-2">
            <Logo size={32} />
          </Link>
          <p className="mt-3 text-muted-foreground">
            Your personal AI career mentor — from resume to offer letter.
          </p>
        </div>
        <FooterCol
          title="Workflow"
          links={[
            { to: "/resume", label: "Resume analysis" },
            { to: "/roadmap", label: "Learning roadmap" },
            { to: "/interview", label: "Mock interview" },
            { to: "/report", label: "Employability report" },
          ]}
        />
        <FooterCol
          title="Product"
          links={[
            { to: "/pricing", label: "Pricing" },
            { to: "/faq", label: "FAQ" },
            { to: "/auth", label: "Sign in" },
          ]}
        />
        <FooterCol
          title="Company"
          links={[
            { to: "/", label: "Home" },
          ]}
        />
      </div>
      <div className="mx-auto max-w-6xl mt-10 pt-6 border-t border-white/5 text-xs text-muted-foreground text-center">
        © {new Date().getFullYear()} AI Interview Simulator. All rights reserved.
      </div>
    </footer>
  );
}

function FooterCol({
  title,
  links,
}: {
  title: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  links: { to: any; label: string }[];
}) {
  return (
    <div>
      <div className="text-xs uppercase tracking-widest text-muted-foreground mb-3">{title}</div>
      <ul className="space-y-2">
        {links.map((l) => (
          <li key={l.label}>
            <Link to={l.to} className="text-muted-foreground hover:text-foreground transition">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

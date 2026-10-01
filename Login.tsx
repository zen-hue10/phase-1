import { Button } from "@/components/ui/button";
import { Link } from "react-router";

function getOAuthUrl() {
  const kimiAuthUrl = import.meta.env.VITE_KIMI_AUTH_URL;
  const appID = import.meta.env.VITE_APP_ID;
  const redirectUri = `${window.location.origin}/api/oauth/callback`;
  const state = btoa(redirectUri);

  const url = new URL(`${kimiAuthUrl}/api/oauth/authorize`);
  url.searchParams.set("client_id", appID);
  url.searchParams.set("redirect_uri", redirectUri);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", "profile");
  url.searchParams.set("state", state);

  return url.toString();
}

export default function Login() {
  return (
    <div className="flex min-h-screen flex-col bg-paper text-ink">
      <header className="border-b border-ink/15">
        <div className="mx-auto flex h-16 max-w-5xl items-center px-4 sm:px-6">
          <Link to="/" className="font-display text-xl font-semibold">
            Legato<span className="italic font-medium">Learn</span>
          </Link>
        </div>
      </header>
      <main className="flex flex-1 items-center justify-center px-4 py-16">
        <div className="w-full max-w-md rounded-2xl border border-ink/80 bg-card p-8 card-shadow sm:p-10">
          <p className="font-mono text-xs tracking-[0.18em] text-ink/60">
            MEMBERS &amp; MUSICIANS
          </p>
          <h1 className="mt-3 font-display text-3xl font-semibold leading-tight">
            Welcome back to the{" "}
            <span className="italic font-medium">practice room</span>.
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-ink/70">
            Sign in to plan sessions, keep your practice history in sync across
            devices, and get feedback from your AI coach.
          </p>
          <Button
            className="mt-8 h-12 w-full rounded-full bg-ink text-base font-semibold text-paper hover:bg-ink/90"
            onClick={() => {
              window.location.href = getOAuthUrl();
            }}
          >
            Sign in with Kimi
          </Button>
          <p className="mt-4 text-center text-xs text-ink/50">
            New here? Signing in creates your account automatically.
          </p>
        </div>
      </main>
    </div>
  );
}

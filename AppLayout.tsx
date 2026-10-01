import { NavLink, Outlet, useNavigate } from "react-router";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { CalendarClock, History, Home, LogOut, Sparkles } from "lucide-react";
import { AuthLayoutSkeleton } from "./AuthLayoutSkeleton";

const NAV = [
  { to: "/app", label: "Overview", icon: Home, end: true },
  { to: "/app/plan", label: "Plan a session", icon: CalendarClock },
  { to: "/app/history", label: "History", icon: History },
];

export function Wordmark({ light = false }: { light?: boolean }) {
  return (
    <span
      className={`font-display text-xl font-semibold tracking-tight ${
        light ? "text-paper" : "text-ink"
      }`}
    >
      Legato<span className="italic font-medium">Learn</span>
    </span>
  );
}

export default function AppLayout() {
  const { user, isLoading, logout } = useAuth({
    redirectOnUnauthenticated: true,
  });
  const navigate = useNavigate();

  if (isLoading) return <AuthLayoutSkeleton />;
  if (!user) return null;

  return (
    <div className="min-h-screen bg-paper text-ink">
      <header className="sticky top-0 z-40 border-b border-ink/15 bg-paper/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-5xl items-center gap-4 px-4 sm:px-6">
          <button
            onClick={() => navigate("/app")}
            className="flex min-h-[44px] items-center"
            aria-label="LegatoLearn home"
          >
            <Wordmark />
          </button>
          <nav className="ml-2 flex flex-1 items-center gap-1 overflow-x-auto">
            {NAV.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `flex min-h-[44px] items-center gap-2 whitespace-nowrap rounded-full px-3.5 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-ink text-paper"
                      : "text-ink/70 hover:bg-paper2 hover:text-ink"
                  }`
                }
              >
                <item.icon className="h-4 w-4" />
                <span className="hidden sm:inline">{item.label}</span>
              </NavLink>
            ))}
          </nav>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-11 w-11 rounded-full"
                aria-label="Account menu"
              >
                <Avatar className="h-9 w-9 border border-ink/20">
                  <AvatarFallback className="bg-brass font-display text-sm font-semibold text-ink">
                    {(user.name ?? "M").slice(0, 1).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem disabled className="text-xs text-ink/60">
                {user.name ?? "Musician"}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={logout} className="min-h-[44px]">
                <LogOut className="mr-2 h-4 w-4" /> Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
      <main className="mx-auto w-full max-w-5xl px-4 pb-24 pt-8 sm:px-6 sm:pt-12">
        <Outlet />
      </main>
      <footer className="border-t border-ink/15 py-8">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 sm:px-6">
          <span className="font-mono text-xs tracking-wider text-ink/50">
            BUILT BY STUDENTS · FOR STUDENTS
          </span>
          <Sparkles className="h-4 w-4 text-brass" />
        </div>
      </footer>
    </div>
  );
}

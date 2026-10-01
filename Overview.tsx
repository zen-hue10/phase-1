import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { trpc } from "@/providers/trpc";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowRight, Flame, Play } from "lucide-react";
import { INSTRUMENTS, LEVELS, FOCUS_AREAS, type LevelId } from "@contracts/practice";

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

export default function Overview() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const utils = trpc.useUtils();
  const profile = trpc.practice.profile.useQuery();
  const stats = trpc.practice.stats.useQuery();
  const sessions = trpc.practice.sessions.useQuery();

  const [instrument, setInstrument] = useState("clarinet");
  const [level, setLevel] = useState<LevelId>("secondary");
  const upsert = trpc.practice.upsertProfile.useMutation({
    onSuccess: () => utils.practice.profile.invalidate(),
  });

  const activeSession = sessions.data?.find((s) => s.status === "active");
  const recent = sessions.data?.filter((s) => s.status === "completed").slice(0, 5);
  const needsOnboarding = profile.data === null || profile.data === undefined;

  return (
    <div className="space-y-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono text-xs tracking-[0.16em] text-ink/55">
            {new Date().toLocaleDateString(undefined, {
              weekday: "long",
              day: "numeric",
              month: "long",
            }).toUpperCase()}
          </p>
          <h1 className="mt-2 font-display text-3xl font-semibold sm:text-4xl">
            {greeting()}, <span className="italic font-medium">{user?.name?.split(" ")[0] ?? "musician"}</span>.
          </h1>
        </div>
        <Link
          to="/app/plan"
          className="inline-flex min-h-[48px] items-center gap-2 rounded-full bg-brass px-6 font-bold text-ink shadow-[0_2px_0_#0e2a22] transition-transform hover:-translate-y-0.5"
        >
          Plan a session <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {needsOnboarding && !profile.isLoading && (
        <div className="rounded-2xl border border-ink/80 bg-card p-6 card-shadow sm:p-8">
          <p className="font-mono text-xs tracking-[0.16em] text-ink/55">
            FIRST THINGS FIRST
          </p>
          <h2 className="mt-2 font-display text-2xl font-semibold">
            Tell your coach who you are.
          </h2>
          <p className="mt-2 max-w-lg text-sm text-ink/70">
            Your instrument and level shape every plan the AI coach builds for
            you. You can change these any time.
          </p>
          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="instrument">Instrument</Label>
              <Select value={instrument} onValueChange={setInstrument}>
                <SelectTrigger id="instrument" className="h-12 bg-paper">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {INSTRUMENTS.map((i) => (
                    <SelectItem key={i.id} value={i.id}>
                      {i.label}
                      <span className="ml-2 text-xs text-ink/50">{i.family}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="level">Level</Label>
              <Select value={level} onValueChange={(v) => setLevel(v as LevelId)}>
                <SelectTrigger id="level" className="h-12 bg-paper">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {LEVELS.map((l) => (
                    <SelectItem key={l.id} value={l.id}>
                      {l.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button
            className="mt-6 h-12 rounded-full bg-ink px-8 font-semibold text-paper hover:bg-ink/90"
            disabled={upsert.isPending}
            onClick={() => upsert.mutate({ instrument, level })}
          >
            {upsert.isPending ? "Saving…" : "Save and start"}
          </Button>
        </div>
      )}

      {activeSession && (
        <button
          onClick={() => navigate(`/app/session/${activeSession.id}`)}
          className="flex w-full items-center justify-between rounded-2xl border border-ink/80 bg-brass p-5 text-left card-shadow card-lift sm:p-6"
        >
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink/60">
              Session in progress
            </p>
            <p className="mt-1 font-display text-xl font-semibold">
              {activeSession.title}
            </p>
          </div>
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-ink text-paper">
            <Play className="h-5 w-5" />
          </span>
        </button>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 border-t-2 border-ink pt-6 sm:gap-8">
        <div>
          <p className="flex items-center gap-1.5 font-display text-3xl font-semibold sm:text-4xl">
            {stats.data?.streakDays ?? 0}
            {(stats.data?.streakDays ?? 0) > 0 && (
              <Flame className="h-6 w-6 text-crimson" />
            )}
          </p>
          <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.14em] text-ink/55">
            Day streak
          </p>
        </div>
        <div>
          <p className="font-display text-3xl font-semibold sm:text-4xl">
            {stats.data?.totalMinutes ?? 0}
          </p>
          <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.14em] text-ink/55">
            Minutes practised
          </p>
        </div>
        <div>
          <p className="font-display text-3xl font-semibold sm:text-4xl">
            {stats.data?.totalSessions ?? 0}
          </p>
          <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.14em] text-ink/55">
            Sessions done
          </p>
        </div>
      </div>

      {/* Recent sessions */}
      <section>
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl font-semibold">Recent sessions</h2>
          <Link
            to="/app/history"
            className="inline-flex min-h-[44px] items-center gap-1 text-sm font-semibold text-ink/70 hover:text-ink"
          >
            All history <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        {recent && recent.length > 0 ? (
          <ul className="mt-4 divide-y divide-ink/12 border-y border-ink/20">
            {recent.map((s) => (
              <li key={s.id} className="flex items-center justify-between gap-4 py-4">
                <div className="min-w-0">
                  <p className="truncate font-medium">{s.title}</p>
                  <p className="mt-0.5 font-mono text-xs text-ink/55">
                    {s.completedAt
                      ? new Date(s.completedAt).toLocaleDateString(undefined, {
                          day: "numeric",
                          month: "short",
                        })
                      : ""}
                    {" · "}
                    {Math.round((s.actualSeconds ?? 0) / 60)} min
                  </p>
                </div>
                <div className="hidden gap-1.5 sm:flex">
                  {s.focusAreas.slice(0, 3).map((f) => (
                    <span
                      key={f}
                      className="rounded-full bg-paper2 px-2.5 py-1 text-xs text-ink/70"
                    >
                      {FOCUS_AREAS.find((a) => a.id === f)?.label ?? f}
                    </span>
                  ))}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="mt-4 rounded-2xl border border-dashed border-ink/30 p-8 text-center">
            <p className="font-display text-lg italic text-ink/70">
              No sessions yet — your first one starts on the planner.
            </p>
            <Button
              className="mt-4 h-11 rounded-full bg-ink px-6 font-semibold text-paper hover:bg-ink/90"
              onClick={() => navigate("/app/plan")}
            >
              Plan your first session
            </Button>
          </div>
        )}
      </section>
    </div>
  );
}

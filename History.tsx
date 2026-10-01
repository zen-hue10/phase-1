import { useState } from "react";
import { Link } from "react-router";
import { trpc } from "@/providers/trpc";
import { ChevronDown, Loader2 } from "lucide-react";
import { FOCUS_AREAS } from "@contracts/practice";

export default function History() {
  const sessions = trpc.practice.sessions.useQuery();
  const [openId, setOpenId] = useState<number | null>(null);

  if (sessions.isLoading) {
    return (
      <div className="flex justify-center py-24">
        <Loader2 className="h-6 w-6 animate-spin text-ink/50" />
      </div>
    );
  }

  const list = sessions.data ?? [];

  return (
    <div>
      <p className="font-mono text-xs tracking-[0.16em] text-ink/55">
        YOUR PRACTICE JOURNAL
      </p>
      <h1 className="mt-2 font-display text-3xl font-semibold sm:text-4xl">
        Every session, <span className="italic font-medium">remembered</span>.
      </h1>
      <p className="mt-3 max-w-xl text-ink/70">
        Synced to your account — pick up on any device and your history,
        streaks, and coach feedback are all here.
      </p>

      {list.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-dashed border-ink/30 p-10 text-center">
          <p className="font-display text-lg italic text-ink/70">
            No sessions yet. Your journal starts with one intentional hour.
          </p>
          <Link
            to="/app/plan"
            className="mt-5 inline-flex min-h-[48px] items-center rounded-full bg-brass px-7 font-bold text-ink shadow-[0_2px_0_#0e2a22]"
          >
            Plan your first session
          </Link>
        </div>
      ) : (
        <ul className="mt-8 space-y-3">
          {list.map((s) => {
            const open = openId === s.id;
            return (
              <li
                key={s.id}
                className="overflow-hidden rounded-2xl border border-ink/25 bg-card"
              >
                <button
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left min-h-[56px]"
                  onClick={() => setOpenId(open ? null : s.id)}
                  aria-expanded={open}
                >
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-semibold">{s.title}</p>
                      {s.status === "completed" && (
                        <span className="rounded-full bg-mint px-2 py-0.5 font-mono text-[10px] font-medium text-ink">
                          DONE
                        </span>
                      )}
                      {s.status === "active" && (
                        <span className="rounded-full bg-brass px-2 py-0.5 font-mono text-[10px] font-medium text-ink">
                          IN PROGRESS
                        </span>
                      )}
                      {s.status === "abandoned" && (
                        <span className="rounded-full bg-paper3 px-2 py-0.5 font-mono text-[10px] font-medium text-ink/60">
                          DISCARDED
                        </span>
                      )}
                      {s.source === "ai" && (
                        <span className="rounded-full border border-ink/30 px-2 py-0.5 font-mono text-[10px] text-ink/60">
                          AI
                        </span>
                      )}
                    </div>
                    <p className="mt-1 font-mono text-xs text-ink/55">
                      {new Date(s.createdAt).toLocaleDateString(undefined, {
                        weekday: "short",
                        day: "numeric",
                        month: "short",
                      })}
                      {" · "}
                      {s.status === "completed"
                        ? `${Math.round((s.actualSeconds ?? 0) / 60)} min practised`
                        : `${s.plannedMinutes} min planned`}
                    </p>
                  </div>
                  <ChevronDown
                    className={`h-5 w-5 shrink-0 text-ink/50 transition-transform ${
                      open ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {open && (
                  <div className="border-t border-ink/15 px-5 py-5">
                    <div className="flex flex-wrap gap-1.5">
                      {s.focusAreas.map((f) => (
                        <span
                          key={f}
                          className="rounded-full bg-paper2 px-2.5 py-1 text-xs text-ink/70"
                        >
                          {FOCUS_AREAS.find((a) => a.id === f)?.label ?? f}
                        </span>
                      ))}
                    </div>
                    <ol className="mt-4 space-y-2 text-sm">
                      {s.blocks.map((b, i) => (
                        <li key={i} className="flex justify-between gap-4">
                          <span className="text-ink/80">
                            <span className="mr-2 font-mono text-xs text-ink/40">
                              0{i + 1}
                            </span>
                            {b.title}
                          </span>
                          <span className="font-mono text-xs text-ink/50">
                            {b.minutes}m
                          </span>
                        </li>
                      ))}
                    </ol>
                    {(s.whatClicked || s.whatDidnt || s.carryForward) && (
                      <div className="mt-5 space-y-3 border-t border-ink/15 pt-4 text-sm">
                        {s.whatClicked && (
                          <p>
                            <span className="font-mono text-[11px] uppercase tracking-wider text-ink/50">
                              Clicked —{" "}
                            </span>
                            {s.whatClicked}
                          </p>
                        )}
                        {s.whatDidnt && (
                          <p>
                            <span className="font-mono text-[11px] uppercase tracking-wider text-ink/50">
                              Didn't —{" "}
                            </span>
                            {s.whatDidnt}
                          </p>
                        )}
                        {s.carryForward && (
                          <p>
                            <span className="font-mono text-[11px] uppercase tracking-wider text-ink/50">
                              Carry forward —{" "}
                            </span>
                            {s.carryForward}
                          </p>
                        )}
                      </div>
                    )}
                    {s.aiFeedback && (
                      <div className="mt-5 rounded-xl bg-ink p-5 text-paper">
                        <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-brass">
                          Coach's feedback
                        </p>
                        <p className="mt-2 text-sm leading-relaxed text-paper/90">
                          {s.aiFeedback}
                        </p>
                      </div>
                    )}
                    {s.status === "active" && (
                      <Link
                        to={`/app/session/${s.id}`}
                        className="mt-5 inline-flex min-h-[44px] items-center rounded-full bg-ink px-5 text-sm font-semibold text-paper"
                      >
                        Resume session
                      </Link>
                    )}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

import { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { trpc } from "@/providers/trpc";
import { Button } from "@/components/ui/button";
import { Check, RefreshCw, Sparkles, TriangleAlert } from "lucide-react";
import {
  DURATION_OPTIONS,
  FOCUS_AREAS,
  type FocusAreaId,
  type PlanBlock,
} from "@contracts/practice";

type GeneratedPlan = {
  title: string;
  coachNote: string;
  blocks: PlanBlock[];
};

function buildClassicPlan(
  minutes: number,
  focusAreas: FocusAreaId[],
): { title: string; blocks: PlanBlock[] } {
  const selected = FOCUS_AREAS.filter((f) => focusAreas.includes(f.id));
  const base = Math.floor(minutes / selected.length);
  const blocks: PlanBlock[] = selected.map((f, i) => ({
    title: f.label,
    minutes: i === 0 ? base + (minutes - base * selected.length) : base,
    instructions: f.blurb + ". Set a timer, stay honest, and stop when it rings.",
    tip: i === 0 ? "Start slower than you think you need to." : undefined,
  }));
  return { title: `${minutes}-minute practice session`, blocks };
}

export default function Planner() {
  const navigate = useNavigate();
  const [minutes, setMinutes] = useState(45);
  const [selected, setSelected] = useState<FocusAreaId[]>(["warmup", "technical"]);
  const [plan, setPlan] = useState<GeneratedPlan | null>(null);

  const utils = trpc.useUtils();
  const generate = trpc.coach.generatePlan.useMutation({
    onSuccess: (data) => setPlan(data),
  });
  const createSession = trpc.practice.createSession.useMutation({
    onSuccess: async (session) => {
      await utils.practice.sessions.invalidate();
      if (session) navigate(`/app/session/${session.id}`);
    },
  });

  const toggle = (id: FocusAreaId) =>
    setSelected((cur) =>
      cur.includes(id) ? cur.filter((f) => f !== id) : [...cur, id],
    );

  const groups = useMemo(() => {
    const map = new Map<string, typeof FOCUS_AREAS>();
    for (const f of FOCUS_AREAS) {
      map.set(f.group, [...(map.get(f.group) ?? []), f]);
    }
    return [...map.entries()];
  }, []);

  const askCoach = () =>
    generate.mutate({ minutes, focusAreas: selected });

  const startAiPlan = () => {
    if (!plan) return;
    createSession.mutate({
      title: plan.title,
      plannedMinutes: minutes,
      focusAreas: selected,
      blocks: plan.blocks,
      source: "ai",
      coachNote: plan.coachNote,
    });
  };

  const startClassicPlan = () => {
    const classic = buildClassicPlan(minutes, selected);
    createSession.mutate({
      title: classic.title,
      plannedMinutes: minutes,
      focusAreas: selected,
      blocks: classic.blocks,
      source: "classic",
    });
  };

  const aiError = generate.error;

  return (
    <div className="space-y-12">
      <div>
        <p className="font-mono text-xs tracking-[0.16em] text-ink/55">
          BUILD A SESSION
        </p>
        <h1 className="mt-2 font-display text-3xl font-semibold sm:text-4xl">
          The <span className="italic font-medium">practice planner</span>
        </h1>
        <p className="mt-3 max-w-xl text-ink/70">
          Choose your time and focus areas. Your AI coach builds a structured,
          timed session — or use the classic planner for an instant split.
        </p>
      </div>

      {/* Step 1 — duration */}
      <section>
        <h2 className="flex items-baseline gap-3 font-display text-xl font-semibold">
          <span className="font-mono text-sm text-crimson">01</span> How much
          time do you have?
        </h2>
        <div className="mt-4 flex flex-wrap gap-2.5">
          {DURATION_OPTIONS.map((m) => (
            <button
              key={m}
              onClick={() => setMinutes(m)}
              className={`min-h-[48px] rounded-full border px-5 font-mono text-sm font-medium transition-colors ${
                minutes === m
                  ? "border-ink bg-ink text-paper"
                  : "border-ink/30 bg-card text-ink hover:border-ink/60"
              }`}
            >
              {m} min
            </button>
          ))}
        </div>
      </section>

      {/* Step 2 — focus areas */}
      <section>
        <h2 className="flex items-baseline gap-3 font-display text-xl font-semibold">
          <span className="font-mono text-sm text-crimson">02</span> What do you
          want to work on?
        </h2>
        <p className="mt-1 text-sm text-ink/60">
          Select one or more — the coach weights your time accordingly.
        </p>
        <div className="mt-5 space-y-6">
          {groups.map(([group, areas]) => (
            <div key={group}>
              <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink/50">
                {group}
              </p>
              <div className="mt-2.5 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
                {areas.map((a) => {
                  const on = selected.includes(a.id);
                  return (
                    <button
                      key={a.id}
                      onClick={() => toggle(a.id)}
                      className={`flex min-h-[44px] items-start justify-between gap-3 rounded-xl border p-4 text-left transition-colors ${
                        on
                          ? "border-ink bg-ink text-paper"
                          : "border-ink/25 bg-card text-ink hover:border-ink/60"
                      }`}
                    >
                      <span>
                        <span className="block text-sm font-semibold">
                          {a.label}
                        </span>
                        <span
                          className={`mt-1 block text-xs leading-relaxed ${
                            on ? "text-paper/70" : "text-ink/55"
                          }`}
                        >
                          {a.blurb}
                        </span>
                      </span>
                      {on && <Check className="mt-0.5 h-4 w-4 shrink-0 text-brass" />}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Step 3 — generate */}
      <section className="border-t-2 border-ink pt-8">
        <h2 className="flex items-baseline gap-3 font-display text-xl font-semibold">
          <span className="font-mono text-sm text-crimson">03</span> Your
          practice plan
        </h2>
        <p className="mt-1 font-mono text-xs text-ink/55">
          {minutes} MINUTES · {selected.length} FOCUS AREA
          {selected.length === 1 ? "" : "S"}
        </p>

        {!plan && !generate.isPending && (
          <div className="mt-6 flex flex-wrap gap-3">
            <Button
              className="h-12 rounded-full bg-brass px-7 font-bold text-ink shadow-[0_2px_0_#0e2a22] hover:bg-brass/90"
              disabled={selected.length === 0 || generate.isPending}
              onClick={askCoach}
            >
              <Sparkles className="mr-2 h-4 w-4" /> Ask the AI coach
            </Button>
            <Button
              variant="outline"
              className="h-12 rounded-full border-ink/40 bg-transparent px-7 font-semibold hover:bg-paper2"
              disabled={selected.length === 0 || createSession.isPending}
              onClick={startClassicPlan}
            >
              Build a classic plan
            </Button>
          </div>
        )}

        {generate.isPending && (
          <div className="mt-6 rounded-2xl border border-ink/25 bg-card p-8">
            <div className="flex items-center gap-3">
              <RefreshCw className="h-5 w-5 animate-spin text-ink/60" />
              <p className="font-display text-lg italic">
                Your coach is writing today's session…
              </p>
            </div>
            <div className="mt-5 space-y-3">
              {[0, 1, 2].map((i) => (
                <div key={i} className="h-4 animate-pulse rounded bg-paper3" style={{ width: `${85 - i * 18}%` }} />
              ))}
            </div>
          </div>
        )}

        {aiError && !generate.isPending && (
          <div className="mt-6 rounded-2xl border border-crimson/60 bg-card p-6">
            <p className="flex items-center gap-2 font-semibold text-crimson">
              <TriangleAlert className="h-4 w-4" /> The coach is unavailable
              right now
            </p>
            <p className="mt-2 text-sm text-ink/70">
              {aiError.message}. Your choices aren't lost — build a classic
              plan instead, or try the coach again in a moment.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Button
                className="h-11 rounded-full bg-ink px-6 font-semibold text-paper hover:bg-ink/90"
                disabled={selected.length === 0 || createSession.isPending}
                onClick={startClassicPlan}
              >
                Use a classic plan
              </Button>
              <Button
                variant="outline"
                className="h-11 rounded-full border-ink/40 bg-transparent px-6 font-semibold hover:bg-paper2"
                onClick={askCoach}
                disabled={generate.isPending}
              >
                Try the coach again
              </Button>
            </div>
          </div>
        )}

        {plan && !generate.isPending && (
          <div className="mt-6 rounded-2xl border border-ink/80 bg-card p-6 card-shadow sm:p-8">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <span className="rounded-full bg-mint px-3 py-1 font-mono text-[11px] font-medium text-ink">
                  AI-PLANNED
                </span>
                <h3 className="mt-3 font-display text-2xl font-semibold">
                  {plan.title}
                </h3>
              </div>
              <p className="font-mono text-sm text-ink/55">{minutes} min</p>
            </div>
            <p className="mt-3 max-w-2xl font-display text-lg italic leading-relaxed text-ink/80">
              “{plan.coachNote}”
            </p>
            <ol className="mt-6 space-y-4">
              {plan.blocks.map((b, i) => (
                <li key={i} className="flex gap-4 border-t border-ink/15 pt-4">
                  <span className="font-mono text-sm text-ink/45">
                    0{i + 1}
                  </span>
                  <div className="flex-1">
                    <div className="flex items-baseline justify-between gap-3">
                      <p className="font-semibold">{b.title}</p>
                      <p className="font-mono text-xs text-ink/55">
                        {b.minutes} min
                      </p>
                    </div>
                    <p className="mt-1 text-sm leading-relaxed text-ink/70">
                      {b.instructions}
                    </p>
                    {b.tip && (
                      <p className="mt-2 rounded-lg bg-paper2 px-3 py-2 text-xs leading-relaxed text-ink/75">
                        <span className="font-semibold">Tip — </span>
                        {b.tip}
                      </p>
                    )}
                  </div>
                </li>
              ))}
            </ol>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button
                className="h-12 rounded-full bg-ink px-8 font-semibold text-paper hover:bg-ink/90"
                disabled={createSession.isPending}
                onClick={startAiPlan}
              >
                {createSession.isPending ? "Saving…" : "Start this session"}
              </Button>
              <Button
                variant="outline"
                className="h-12 rounded-full border-ink/40 bg-transparent px-6 font-semibold hover:bg-paper2"
                disabled={generate.isPending}
                onClick={askCoach}
              >
                <RefreshCw className="mr-2 h-4 w-4" /> Regenerate
              </Button>
              <Button
                variant="ghost"
                className="h-12 px-4 text-ink/60"
                onClick={() => setPlan(null)}
              >
                Start over
              </Button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

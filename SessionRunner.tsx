import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { trpc } from "@/providers/trpc";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Check,
  ChevronRight,
  Loader2,
  Pause,
  Play,
  TriangleAlert,
} from "lucide-react";

function fmt(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

type Phase = "run" | "reflect" | "done";

export default function SessionRunner() {
  const { id } = useParams<{ id: string }>();
  const sessionId = Number(id);
  const navigate = useNavigate();
  const utils = trpc.useUtils();

  const session = trpc.practice.session.useQuery(
    { id: sessionId },
    { enabled: Number.isFinite(sessionId), retry: false },
  );

  const [phase, setPhase] = useState<Phase>("run");
  const [blockIndex, setBlockIndex] = useState(0);
  const [blockElapsed, setBlockElapsed] = useState(0);
  const [totalElapsed, setTotalElapsed] = useState(0);
  const [paused, setPaused] = useState(false);

  const [whatClicked, setWhatClicked] = useState("");
  const [whatDidnt, setWhatDidnt] = useState("");
  const [carryForward, setCarryForward] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);

  const complete = trpc.practice.completeSession.useMutation();
  const reflect = trpc.coach.reflectFeedback.useMutation({
    onSuccess: (d) => setFeedback(d.feedback),
  });
  const abandon = trpc.practice.abandonSession.useMutation({
    onSuccess: async () => {
      await utils.practice.invalidate();
      navigate("/app");
    },
  });

  const blocks = useMemo(() => session.data?.blocks ?? [], [session.data]);
  const current = blocks[blockIndex];
  const blockTotal = (current?.minutes ?? 0) * 60;
  const totalPlanned = blocks.reduce((s, b) => s + b.minutes, 0) * 60;
  const finishedRef = useRef(false);

  useEffect(() => {
    if (phase !== "run" || paused || !current) return;
    const t = setInterval(() => {
      setTotalElapsed((v) => v + 1);
      setBlockElapsed((v) => {
        if (v + 1 >= blockTotal) {
          if (blockIndex + 1 < blocks.length) {
            setBlockIndex(blockIndex + 1);
            return 0;
          }
          if (!finishedRef.current) {
            finishedRef.current = true;
            setPhase("reflect");
            setPaused(true);
          }
          return v;
        }
        return v + 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [phase, paused, blockIndex, blockTotal, blocks.length, current]);

  if (session.isLoading) {
    return (
      <div className="flex justify-center py-24">
        <Loader2 className="h-6 w-6 animate-spin text-ink/50" />
      </div>
    );
  }

  if (!session.data) {
    return (
      <div className="py-24 text-center">
        <p className="font-display text-xl italic">Session not found.</p>
        <Link to="/app" className="mt-4 inline-block font-semibold underline">
          Back to overview
        </Link>
      </div>
    );
  }

  const s = session.data;

  // Already-completed session: show summary
  if (s.status === "completed" && phase === "run") {
    return (
      <div className="mx-auto max-w-2xl space-y-6">
        <span className="rounded-full bg-mint px-3 py-1 font-mono text-[11px] font-medium text-ink">
          COMPLETED
        </span>
        <h1 className="font-display text-3xl font-semibold">{s.title}</h1>
        <p className="font-mono text-sm text-ink/55">
          {Math.round((s.actualSeconds ?? 0) / 60)} MIN ·{" "}
          {s.completedAt
            ? new Date(s.completedAt).toLocaleDateString(undefined, {
                day: "numeric",
                month: "long",
              })
            : ""}
        </p>
        {s.aiFeedback && (
          <div className="rounded-2xl border border-ink/80 bg-card p-6 card-shadow">
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink/55">
              Coach's feedback
            </p>
            <p className="mt-3 leading-relaxed text-ink/85">{s.aiFeedback}</p>
          </div>
        )}
        <div className="flex gap-3">
          <Button
            className="h-11 rounded-full bg-ink px-6 font-semibold text-paper hover:bg-ink/90"
            onClick={() => navigate("/app/plan")}
          >
            Plan another session
          </Button>
          <Button
            variant="outline"
            className="h-11 rounded-full border-ink/40 bg-transparent px-6 hover:bg-paper2"
            onClick={() => navigate("/app/history")}
          >
            View history
          </Button>
        </div>
      </div>
    );
  }

  // ---------- Reflection phase ----------
  if (phase === "reflect" || phase === "done") {
    const submit = async () => {
      await complete.mutateAsync({
        id: sessionId,
        actualSeconds: totalElapsed,
        whatClicked,
        whatDidnt,
        carryForward,
      });
      setPhase("done");
      utils.practice.invalidate();
      reflect.mutate({ sessionId });
    };

    return (
      <div className="mx-auto max-w-2xl">
        <span className="rounded-full bg-mint px-3 py-1 font-mono text-[11px] font-medium text-ink">
          SESSION COMPLETE
        </span>
        <h1 className="mt-4 font-display text-3xl font-semibold">
          Great work. A quick reflection makes the next session{" "}
          <span className="italic font-medium">better</span>.
        </h1>
        <div className="mt-4 flex gap-6 border-t border-ink/20 pt-4 font-mono text-xs text-ink/55">
          <span>{fmt(totalElapsed)} PRACTISED</span>
          <span>{blocks.length} BLOCKS</span>
          <span>{s.source === "ai" ? "AI-PLANNED" : "CLASSIC PLAN"}</span>
        </div>

        {phase === "reflect" && (
          <form
            className="mt-8 space-y-5"
            onSubmit={(e) => {
              e.preventDefault();
              submit();
            }}
          >
            <div className="space-y-2">
              <Label htmlFor="clicked">What clicked today?</Label>
              <Textarea
                id="clicked"
                value={whatClicked}
                onChange={(e) => setWhatClicked(e.target.value)}
                placeholder="A passage, a habit, a feeling — anything that worked."
                className="min-h-[88px] border-ink/30 bg-card"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="didnt">What didn't?</Label>
              <Textarea
                id="didnt"
                value={whatDidnt}
                onChange={(e) => setWhatDidnt(e.target.value)}
                placeholder="Be honest. This is where growth hides."
                className="min-h-[88px] border-ink/30 bg-card"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="carry">One thing to carry into tomorrow</Label>
              <Textarea
                id="carry"
                value={carryForward}
                onChange={(e) => setCarryForward(e.target.value)}
                placeholder="Just one. Small and concrete."
                className="min-h-[72px] border-ink/30 bg-card"
              />
            </div>
            <Button
              type="submit"
              className="h-12 w-full rounded-full bg-ink font-semibold text-paper hover:bg-ink/90"
              disabled={complete.isPending}
            >
              {complete.isPending ? "Saving…" : "Save reflection & hear from your coach"}
            </Button>
          </form>
        )}

        {phase === "done" && (
          <div className="mt-8 space-y-5">
            {reflect.isPending && (
              <div className="flex items-center gap-3 rounded-2xl border border-ink/25 bg-card p-6">
                <Loader2 className="h-5 w-5 animate-spin text-ink/60" />
                <p className="font-display italic text-ink/75">
                  Your coach is reading your reflection…
                </p>
              </div>
            )}
            {feedback && (
              <div className="rounded-2xl border border-ink/80 bg-card p-6 card-shadow sm:p-8">
                <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink/55">
                  Coach's feedback
                </p>
                <p className="mt-3 font-display text-lg leading-relaxed text-ink/90">
                  {feedback}
                </p>
              </div>
            )}
            {reflect.error && !reflect.isPending && (
              <div className="rounded-2xl border border-crimson/50 bg-card p-6">
                <p className="flex items-center gap-2 text-sm font-semibold text-crimson">
                  <TriangleAlert className="h-4 w-4" /> Coach feedback is
                  unavailable right now
                </p>
                <p className="mt-2 text-sm text-ink/70">
                  {reflect.error.message}. Don't worry — your session and
                  reflection are saved.
                </p>
                <Button
                  variant="outline"
                  className="mt-4 h-11 rounded-full border-ink/40 bg-transparent px-5 hover:bg-paper2"
                  onClick={() => reflect.mutate({ sessionId })}
                >
                  Try again
                </Button>
              </div>
            )}
            <div className="flex flex-wrap gap-3 pt-2">
              <Button
                className="h-12 rounded-full bg-brass px-7 font-bold text-ink shadow-[0_2px_0_#0e2a22] hover:bg-brass/90"
                onClick={() => navigate("/app/plan")}
              >
                Plan tomorrow's session
              </Button>
              <Button
                variant="outline"
                className="h-12 rounded-full border-ink/40 bg-transparent px-6 hover:bg-paper2"
                onClick={() => navigate("/app")}
              >
                Back to overview
              </Button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ---------- Running phase ----------
  const remaining = Math.max(0, blockTotal - blockElapsed);
  const progress = Math.min(100, Math.round((totalElapsed / totalPlanned) * 100));

  return (
    <div className="mx-auto max-w-2xl">
      <p className="font-mono text-xs tracking-[0.16em] text-ink/55">
        SESSION IN PROGRESS
      </p>
      <h1 className="mt-2 font-display text-3xl font-semibold">{s.title}</h1>
      {s.coachNote && (
        <p className="mt-3 font-display text-lg italic leading-relaxed text-ink/75">
          “{s.coachNote}”
        </p>
      )}

      {/* Timer */}
      <div className="mt-8 rounded-2xl border border-ink/80 bg-card p-6 text-center card-shadow sm:p-10">
        <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink/55">
          Block {blockIndex + 1} of {blocks.length}
        </p>
        <h2 className="mt-2 font-display text-2xl font-semibold">
          {current?.title}
        </h2>
        <p className="mt-6 font-mono text-6xl font-medium tabular-nums tracking-tight sm:text-7xl">
          {fmt(remaining)}
        </p>
        <p className="mt-2 font-mono text-xs text-ink/50">
          REMAINING IN THIS BLOCK · {fmt(totalElapsed)} TOTAL
        </p>

        <div className="mt-8 flex justify-center gap-3">
          <Button
            className="h-14 w-14 rounded-full bg-ink text-paper hover:bg-ink/90"
            onClick={() => setPaused((p) => !p)}
            aria-label={paused ? "Resume" : "Pause"}
          >
            {paused ? <Play className="h-6 w-6" /> : <Pause className="h-6 w-6" />}
          </Button>
          <Button
            variant="outline"
            className="h-14 rounded-full border-ink/40 bg-transparent px-6 font-semibold hover:bg-paper2"
            onClick={() => {
              if (blockIndex + 1 < blocks.length) {
                setBlockIndex(blockIndex + 1);
                setBlockElapsed(0);
              } else {
                setPhase("reflect");
                setPaused(true);
              }
            }}
          >
            {blockIndex + 1 < blocks.length ? (
              <>
                Skip block <ChevronRight className="ml-1 h-4 w-4" />
              </>
            ) : (
              "Finish"
            )}
          </Button>
        </div>

        <div className="mt-8">
          <div className="flex justify-between font-mono text-[11px] text-ink/50">
            <span>OVERALL</span>
            <span>{progress}%</span>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-paper3">
            <div
              className="h-full rounded-full bg-brass transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Current block instructions */}
      {current && (
        <div className="mt-6 rounded-2xl border border-ink/25 bg-card p-6">
          <p className="text-sm leading-relaxed text-ink/80">
            {current.instructions}
          </p>
          {current.tip && (
            <p className="mt-3 rounded-lg bg-paper2 px-3 py-2 text-xs leading-relaxed text-ink/75">
              <span className="font-semibold">Tip — </span>
              {current.tip}
            </p>
          )}
        </div>
      )}

      {/* Block list */}
      <ol className="mt-6 divide-y divide-ink/12 rounded-2xl border border-ink/25 bg-card">
        {blocks.map((b, i) => (
          <li
            key={i}
            className={`flex items-center justify-between px-5 py-3.5 text-sm ${
              i === blockIndex
                ? "bg-brass/25 font-semibold"
                : i < blockIndex
                  ? "text-ink/45"
                  : "text-ink/75"
            }`}
          >
            <span className="flex items-center gap-3">
              {i < blockIndex ? (
                <Check className="h-4 w-4 text-ink/50" />
              ) : (
                <span className="font-mono text-xs text-ink/45">0{i + 1}</span>
              )}
              {b.title}
            </span>
            <span className="font-mono text-xs">{b.minutes} min</span>
          </li>
        ))}
      </ol>

      <div className="mt-8 flex items-center justify-between">
        <Button
          className="h-12 rounded-full bg-ink px-7 font-semibold text-paper hover:bg-ink/90"
          onClick={() => {
            setPhase("reflect");
            setPaused(true);
          }}
        >
          End session & reflect
        </Button>
        <button
          className="min-h-[44px] px-2 text-sm text-ink/50 underline decoration-ink/30 underline-offset-4 hover:text-crimson"
          onClick={() => abandon.mutate({ id: sessionId })}
        >
          Discard session
        </button>
      </div>
    </div>
  );
}

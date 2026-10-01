import { Link } from "react-router";
import { ArrowRight, Flame, Timer } from "lucide-react";

const FRAMEWORK = [
  {
    n: "01",
    title: "Individual Practice",
    lead: "The mechanics of intentional improvement. Practice smarter, not just harder.",
    items: [
      "Slow practice systems",
      "Isolating difficult passages",
      "Metronome discipline",
      "Honest self-assessment",
    ],
  },
  {
    n: "02",
    title: "Music Making",
    lead: "Beyond technical accuracy — understanding why you play, not just how.",
    items: [
      "Phrasing and expression",
      "Dynamic interpretation",
      "Contextual understanding",
      "Communicating through music",
    ],
  },
  {
    n: "03",
    title: "Ensemble Skills",
    lead: "Where individual growth becomes collective excellence.",
    items: [
      "Listening sideways",
      "Blending within sections",
      "Section responsibility",
      "Collaborative accountability",
    ],
  },
];

const STEPS = [
  {
    n: "1",
    title: "Plan",
    body: "Tell the coach how much time you have and what you want to work on. Get a structured, timed session built for your instrument and level.",
  },
  {
    n: "2",
    title: "Practice",
    body: "Follow the blocks with a guided timer. When it rings, move on — discipline prevents over-practicing one thing.",
  },
  {
    n: "3",
    title: "Reflect",
    body: "What clicked? What didn't? One thing to carry into tomorrow. Thirty seconds of honesty beats an hour of autopilot.",
  },
  {
    n: "4",
    title: "Grow",
    body: "Your coach reads every reflection and answers with one observation and one concrete next step. History syncs across every device you own.",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-paper text-ink">
      {/* Nav */}
      <header className="sticky top-0 z-40 border-b border-ink/15 bg-paper/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link to="/" className="font-display text-xl font-semibold tracking-tight">
            Legato<span className="italic font-medium">Learn</span>
          </Link>
          <nav className="hidden items-center gap-7 text-sm font-medium text-ink/70 md:flex">
            <a href="#framework" className="hover:text-ink">Framework</a>
            <a href="#how" className="hover:text-ink">How it works</a>
            <a href="#story" className="hover:text-ink">Our story</a>
          </nav>
          <Link
            to="/app"
            className="inline-flex min-h-[44px] items-center gap-2 rounded-full bg-ink px-5 text-sm font-semibold text-paper transition-transform hover:-translate-y-0.5"
          >
            Open the app <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </header>

      {/* Hero — asymmetric editorial grid */}
      <section className="mx-auto grid max-w-6xl gap-10 px-4 pb-16 pt-14 sm:px-6 sm:pt-20 lg:grid-cols-[1.25fr_1fr] lg:gap-14">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full border border-ink/25 px-4 py-1.5 font-mono text-xs tracking-[0.14em]">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-crimson opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-crimson" />
            </span>
            BUILT BY STUDENTS · FOR STUDENTS
          </p>
          <h1 className="mt-6 font-display text-[clamp(2.6rem,6vw,4.25rem)] font-semibold leading-[1.04] tracking-[-0.02em]">
            Practice with <span className="italic font-medium">intention</span>.
            <br />
            Grow for <span className="italic font-medium">life</span>.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink/75">
            A student-led resource hub for concert band musicians — from primary
            school to university. Structured practice plans, honest reflection,
            and an AI coach that keeps you improving, in band and beyond.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              to="/app"
              className="inline-flex min-h-[52px] items-center gap-2 rounded-full bg-brass px-7 text-base font-bold text-ink shadow-[0_2px_0_#0e2a22] transition-transform hover:-translate-y-0.5"
            >
              Start practicing <ArrowRight className="h-5 w-5" />
            </Link>
            <a
              href="#framework"
              className="inline-flex min-h-[52px] items-center rounded-full border border-ink/40 px-7 text-base font-semibold hover:bg-paper2"
            >
              See the framework
            </a>
          </div>
          <dl className="mt-12 grid max-w-md grid-cols-3 gap-6 border-t border-ink/20 pt-6">
            {[
              ["1", "Framework"],
              ["3", "Growth levels"],
              ["∞", "Future impact"],
            ].map(([v, l]) => (
              <div key={l}>
                <dt className="sr-only">{l}</dt>
                <dd className="font-display text-3xl font-semibold">{v}</dd>
                <dd className="mt-1 font-mono text-[11px] uppercase tracking-[0.14em] text-ink/55">
                  {l}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Floating sample session card */}
        <div className="lg:pt-10">
          <div className="rounded-2xl border border-ink/80 bg-card p-6 card-shadow card-lift sm:p-7">
            <div className="flex items-center justify-between">
              <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink/55">
                Today's session
              </p>
              <span className="rounded-full bg-mint px-3 py-1 font-mono text-[11px] font-medium text-ink">
                AI-PLANNED
              </span>
            </div>
            <h2 className="mt-3 font-display text-2xl font-semibold">
              Tone before tempo
            </h2>
            <ul className="mt-5 space-y-3">
              {[
                ["Long tones & breathing", "10 min"],
                ["Technical passage · bar 42–58", "15 min"],
                ["Expression & phrasing", "12 min"],
                ["Record & reflect", "8 min"],
              ].map(([t, m], i) => (
                <li
                  key={t}
                  className="flex items-center justify-between border-b border-ink/12 pb-3 text-sm last:border-0 last:pb-0"
                >
                  <span className="flex items-center gap-3">
                    <span className="font-mono text-xs text-ink/45">
                      0{i + 1}
                    </span>
                    {t}
                  </span>
                  <span className="font-mono text-xs text-ink/60">{m}</span>
                </li>
              ))}
            </ul>
            <div className="mt-6 flex items-center justify-between rounded-xl bg-paper2 px-4 py-3">
              <span className="flex items-center gap-2 text-sm font-medium">
                <Timer className="h-4 w-4" /> 45 minutes
              </span>
              <span className="flex items-center gap-1.5 font-mono text-xs text-crimson">
                <Flame className="h-3.5 w-3.5" /> 6-day streak
              </span>
            </div>
          </div>
          <p className="mt-4 text-center font-mono text-[11px] tracking-[0.12em] text-ink/45">
            A REAL PLAN, BUILT IN ABOUT TEN SECONDS
          </p>
        </div>
      </section>

      <div className="staff-lines mx-auto max-w-6xl px-4 sm:px-6" aria-hidden />

      {/* Framework */}
      <section id="framework" className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <p className="font-mono text-xs tracking-[0.18em] text-ink/55">OUR METHOD</p>
        <h2 className="mt-3 max-w-2xl font-display text-[clamp(2rem,4.5vw,3rem)] font-semibold leading-tight">
          The Three-Level <span className="italic font-medium">Framework</span>
        </h2>
        <p className="mt-4 max-w-2xl leading-relaxed text-ink/70">
          Designed from scratch by students, for students. Each level builds on
          the last — connecting musical skill to lifelong growth.
        </p>
        <div className="mt-12 grid gap-10 md:grid-cols-3">
          {FRAMEWORK.map((lvl) => (
            <div key={lvl.n} className="border-t-2 border-ink pt-6">
              <p className="font-mono text-sm text-crimson">{lvl.n}</p>
              <h3 className="mt-2 font-display text-xl font-semibold">
                {lvl.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink/70">
                {lvl.lead}
              </p>
              <ul className="mt-4 space-y-2 text-sm">
                {lvl.items.map((item) => (
                  <li key={item} className="flex gap-2">
                    <span className="text-ink/40">—</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-14 rounded-2xl border border-ink/25 bg-paper2 p-6 sm:p-8">
          <h3 className="font-display text-xl font-semibold">
            Why this framework works
          </h3>
          <p className="mt-3 max-w-3xl leading-relaxed text-ink/75">
            The habits built here — reflection, intentionality, ownership, and
            accountability — are not band habits. They are life habits. Every
            skill in this framework is transferable to the classroom, the
            workplace, and every challenge beyond the concert hall.
          </p>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="border-y border-ink/15 bg-paper2/60">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
          <p className="font-mono text-xs tracking-[0.18em] text-ink/55">
            THE LOOP
          </p>
          <h2 className="mt-3 font-display text-[clamp(2rem,4.5vw,3rem)] font-semibold">
            Four steps. Every <span className="italic font-medium">session</span>.
          </h2>
          <div className="mt-12 grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((s) => (
              <div key={s.n}>
                <p className="flex h-11 w-11 items-center justify-center rounded-full border border-ink/70 font-mono text-sm font-medium">
                  {s.n}
                </p>
                <h3 className="mt-4 font-display text-lg font-semibold">
                  {s.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink/70">
                  {s.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI coach — dark ink band */}
      <section className="bg-ink text-paper">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
          <div className="grid items-start gap-12 lg:grid-cols-2">
            <div>
              <p className="font-mono text-xs tracking-[0.18em] text-brass">
                YOUR COACH, ON CALL
              </p>
              <h2 className="mt-3 font-display text-[clamp(2rem,4.5vw,3rem)] font-semibold leading-tight">
                An AI coach that reads your{" "}
                <span className="italic font-medium">reflections</span>.
              </h2>
              <p className="mt-5 max-w-lg leading-relaxed text-paper/75">
                Tell it your instrument, your level, and how much time you have.
                It builds a session around your goals — then, after you play, it
                answers your reflection with one honest observation and one
                concrete next step. Not generic advice. Yours.
              </p>
              <Link
                to="/app"
                className="mt-8 inline-flex min-h-[52px] items-center gap-2 rounded-full bg-brass px-7 text-base font-bold text-ink transition-transform hover:-translate-y-0.5"
              >
                Meet your coach <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
            <div className="space-y-4">
              <figure className="rounded-2xl border border-paper/25 bg-paper/5 p-6">
                <figcaption className="font-mono text-[11px] uppercase tracking-[0.16em] text-brass">
                  Coach's note · before
                </figcaption>
                <blockquote className="mt-3 font-display text-lg italic leading-relaxed text-paper/90">
                  “You've been fighting that bar 42 run all week. Today we slow
                  it right down — 60 BPM, no heroics. Win small, then win fast.”
                </blockquote>
              </figure>
              <figure className="rounded-2xl border border-paper/25 bg-paper/5 p-6">
                <figcaption className="font-mono text-[11px] uppercase tracking-[0.16em] text-mint">
                  Coach's feedback · after
                </figcaption>
                <blockquote className="mt-3 leading-relaxed text-paper/85">
                  “You noticed the run fell apart above 100 BPM — that awareness
                  is the real progress. Tomorrow, isolate just bars 50–54 at 92
                  BPM before anything else. Small target, full focus. Good
                  session.”
                </blockquote>
              </figure>
            </div>
          </div>
        </div>
        <div className="staff-lines-light mx-auto max-w-6xl px-4 sm:px-6" aria-hidden />
      </section>

      {/* Story */}
      <section id="story" className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:gap-16">
          <div>
            <p className="font-mono text-xs tracking-[0.18em] text-ink/55">
              OUR STORY
            </p>
            <h2 className="mt-3 font-display text-[clamp(2rem,4.5vw,3rem)] font-semibold leading-tight">
              Two students. One idea. A culture{" "}
              <span className="italic font-medium">changed</span>.
            </h2>
          </div>
          <div className="space-y-5 leading-relaxed text-ink/75">
            <p>
              LegatoLearn began in the Victoria Junior College Symphonic Band
              with a simple observation — our band members were working hard,
              but intentional improvement wasn't always the result. Rather than
              accepting this, we chose to build something.
            </p>
            <p>
              In a workshop across every section of the band, we introduced a
              three-level framework for growth that has since changed how our
              members practise, reflect, and lead themselves. Members stopped
              waiting to be told — they started self-directing.
            </p>
            <p>
              This platform is the next step. We believe every school band
              deserves access to what we built — so we're sharing it, from
              primary school bands to university ensembles.
            </p>
            <p className="font-display text-lg italic text-ink">
              “Real leadership begins with choosing to act before being asked.”
            </p>
          </div>
        </div>
      </section>

      {/* School bands CTA — brass block */}
      <section className="bg-brass text-ink">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-16">
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div className="max-w-2xl">
              <h2 className="font-display text-[clamp(1.8rem,4vw,2.6rem)] font-semibold leading-tight">
                Bring LegatoLearn to your school band.
              </h2>
              <p className="mt-3 leading-relaxed text-ink/80">
                Band director, teacher-in-charge, or student leader? The
                framework was built to be shared. Give your members a shared
                language for improvement.
              </p>
            </div>
            <Link
              to="/app"
              className="inline-flex min-h-[52px] shrink-0 items-center gap-2 rounded-full bg-ink px-7 text-base font-bold text-paper transition-transform hover:-translate-y-0.5"
            >
              Get started <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-ink text-paper">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <div>
              <p className="font-display text-2xl font-semibold">
                Legato<span className="italic font-medium">Learn</span>
              </p>
              <p className="mt-2 max-w-sm text-sm text-paper/60">
                A student-built practice system for concert band musicians —
                primary to university.
              </p>
            </div>
            <p className="font-mono text-xs tracking-[0.14em] text-paper/50">
              ORIGINALLY BUILT FOR VJC SYMPHONIC BAND
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

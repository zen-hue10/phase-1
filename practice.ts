// Shared practice domain types & constants (frontend ↔ backend)

export type PlanBlock = {
  title: string;
  minutes: number;
  instructions: string;
  tip?: string;
};

export type FocusAreaId =
  | "warmup"
  | "technical"
  | "record"
  | "expression"
  | "repertoire"
  | "listening";

export const FOCUS_AREAS: {
  id: FocusAreaId;
  label: string;
  blurb: string;
  group: "Individual Practice" | "Music Making" | "Ensemble Skills";
}[] = [
  {
    id: "warmup",
    label: "Warm-up & Fundamentals",
    blurb: "Long tones, scales, articulation exercises",
    group: "Individual Practice",
  },
  {
    id: "technical",
    label: "Technical Passages",
    blurb: "Slow practice, metronome work, difficult sections",
    group: "Individual Practice",
  },
  {
    id: "record",
    label: "Record & Reflect",
    blurb: "Self-assessment, honest feedback, goal tracking",
    group: "Individual Practice",
  },
  {
    id: "expression",
    label: "Expression & Phrasing",
    blurb: "Dynamics, musical storytelling, interpretation",
    group: "Music Making",
  },
  {
    id: "repertoire",
    label: "Repertoire Run-through",
    blurb: "Full pieces, continuity, stamina building",
    group: "Music Making",
  },
  {
    id: "listening",
    label: "Listening & Blending",
    blurb: "Section balance, tuning, ensemble awareness",
    group: "Ensemble Skills",
  },
];

export const INSTRUMENTS: { id: string; label: string; family: string }[] = [
  { id: "flute", label: "Flute", family: "Woodwind" },
  { id: "oboe", label: "Oboe", family: "Woodwind" },
  { id: "clarinet", label: "Clarinet", family: "Woodwind" },
  { id: "bassoon", label: "Bassoon", family: "Woodwind" },
  { id: "saxophone", label: "Saxophone", family: "Woodwind" },
  { id: "trumpet", label: "Trumpet", family: "Brass" },
  { id: "horn", label: "French Horn", family: "Brass" },
  { id: "trombone", label: "Trombone", family: "Brass" },
  { id: "euphonium", label: "Euphonium", family: "Brass" },
  { id: "tuba", label: "Tuba", family: "Brass" },
  { id: "percussion", label: "Percussion", family: "Percussion" },
  { id: "double_bass", label: "Double Bass", family: "Strings" },
  { id: "other", label: "Other", family: "Other" },
];

export const LEVELS = [
  { id: "primary", label: "Primary school" },
  { id: "secondary", label: "Secondary school" },
  { id: "pre_university", label: "Junior college / IB" },
  { id: "university", label: "University" },
] as const;

export type LevelId = (typeof LEVELS)[number]["id"];

export const DURATION_OPTIONS = [15, 30, 45, 60, 90, 120] as const;

import {
  mysqlTable,
  mysqlEnum,
  serial,
  varchar,
  text,
  timestamp,
  bigint,
  int,
  json,
} from "drizzle-orm/mysql-core";
import type { PlanBlock, FocusAreaId, LevelId } from "@contracts/practice";

export const users = mysqlTable("users", {
  id: serial("id").primaryKey(),
  unionId: varchar("unionId", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 320 }),
  avatar: text("avatar"),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  lastSignInAt: timestamp("lastSignInAt").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export const practiceProfiles = mysqlTable("practice_profiles", {
  id: serial("id").primaryKey(),
  userId: bigint("userId", { mode: "number", unsigned: true })
    .notNull()
    .unique(),
  instrument: varchar("instrument", { length: 64 }).notNull().default("other"),
  level: mysqlEnum("level", [
    "primary",
    "secondary",
    "pre_university",
    "university",
  ])
    .$type<LevelId>()
    .notNull()
    .default("secondary"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export const practiceSessions = mysqlTable("practice_sessions", {
  id: serial("id").primaryKey(),
  userId: bigint("userId", { mode: "number", unsigned: true }).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  plannedMinutes: int("plannedMinutes").notNull(),
  focusAreas: json("focusAreas").$type<FocusAreaId[]>().notNull(),
  blocks: json("blocks").$type<PlanBlock[]>().notNull(),
  source: mysqlEnum("source", ["ai", "classic"]).notNull().default("classic"),
  coachNote: text("coachNote"),
  status: mysqlEnum("status", ["active", "completed", "abandoned"])
    .notNull()
    .default("active"),
  startedAt: timestamp("startedAt").defaultNow().notNull(),
  completedAt: timestamp("completedAt"),
  actualSeconds: int("actualSeconds"),
  whatClicked: text("whatClicked"),
  whatDidnt: text("whatDidnt"),
  carryForward: text("carryForward"),
  aiFeedback: text("aiFeedback"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type PracticeProfile = typeof practiceProfiles.$inferSelect;
export type PracticeSession = typeof practiceSessions.$inferSelect;

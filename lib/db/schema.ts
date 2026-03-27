import {
  boolean,
  integer,
  pgTable,
  primaryKey,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name"),
  /** Null pro účty pouze přes OAuth (Google). */
  passwordHash: text("password_hash"),
  emailVerified: timestamp("email_verified", { mode: "date" }),
  image: text("image"),
});

/** Auth.js — OAuth a další poskytovatelé (@auth/drizzle-adapter). */
export const accounts = pgTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  }),
);

export const authSessions = pgTable("session", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationTokens = pgTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({
      columns: [vt.identifier, vt.token],
    }),
  }),
);

export const authenticators = pgTable(
  "authenticator",
  {
    credentialID: text("credentialID").notNull().unique(),
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    providerAccountId: text("providerAccountId").notNull(),
    credentialPublicKey: text("credentialPublicKey").notNull(),
    counter: integer("counter").notNull(),
    credentialDeviceType: text("credentialDeviceType").notNull(),
    credentialBackedUp: boolean("credentialBackedUp").notNull(),
    transports: text("transports"),
  },
  (authenticator) => ({
    compositePK: primaryKey({
      columns: [authenticator.userId, authenticator.credentialID],
    }),
  }),
);

export const principles = pgTable("principles", {
  id: text("id").primaryKey(),
  sortOrder: integer("sort_order").notNull(),
  title: text("title").notNull(),
  summary: text("summary").notNull(),
  /** Cesta podle `public/`, např. `/principles_right-person.png` */
  imagePath: text("image_path"),
  /** Krátké praktické tipy k principu (orientace / učení) */
  learningTips: text("learning_tips").notNull().default(""),
  /** Ilustrativní situace z praxe (nehodnotící tón) */
  fieldStories: text("field_stories").notNull().default(""),
});

export const consultingRoles = pgTable("consulting_roles", {
  id: text("id").primaryKey(),
  phaseKey: text("phase_key").notNull(),
  phaseLabel: text("phase_label").notNull(),
  sortOrder: integer("sort_order").notNull(),
  /** Kód z karty (SI, SM, …) */
  cardCode: text("card_code"),
  /** Pořadí 1–16 podle sady karet */
  cardIndex: integer("card_index"),
  name: text("name").notNull(),
  /** @deprecated použijte summaryLine; ponecháno pro zpětnou kompatibilitu */
  description: text("description"),
  /** Krátká definice z líce karty */
  summaryLine: text("summary_line"),
  /** Odstavec „Co role dělá“ (rub) */
  whatItDoes: text("what_it_does"),
  /** JSON pole stringů — „Užitečné projevy“ */
  usefulBullets: text("useful_bullets"),
  /** JSON pole stringů — „Rizika při přepálení“ */
  riskBullets: text("risk_bullets"),
  /** Cesta podle `public/`, např. `/roles_situator.png` */
  imagePath: text("image_path"),
});

export const preparationSessions = pgTable("preparation_sessions", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  status: text("status", { enum: ["draft", "complete"] })
    .notNull()
    .default("draft"),
  consultationLabel: text("consultation_label"),
  /** Plánovaný čas schůzky (ISO) */
  occurredAt: text("occurred_at"),
  focusNote: text("focus_note"),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

export const preparationRoles = pgTable(
  "preparation_roles",
  {
    preparationId: text("preparation_id")
      .notNull()
      .references(() => preparationSessions.id, { onDelete: "cascade" }),
    roleId: text("role_id")
      .notNull()
      .references(() => consultingRoles.id),
    type: text("type", {
      enum: ["strengthen", "downregulate"],
    }).notNull(),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.preparationId, t.roleId] }),
  }),
);

export const reflectionSessions = pgTable("reflection_sessions", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  status: text("status", { enum: ["draft", "complete"] })
    .notNull()
    .default("draft"),
  /** Volitelná vazba na přípravu před konzultací (záměr vs. realita) */
  preparationId: text("preparation_id").references(() => preparationSessions.id),
  consultationLabel: text("consultation_label"),
  occurredAt: text("occurred_at"),
  alignmentLikert: text("alignment_likert"),
  alignmentNote: text("alignment_note"),
  learningNote: text("learning_note"),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

export const reflectionPrinciples = pgTable(
  "reflection_principles",
  {
    reflectionId: text("reflection_id")
      .notNull()
      .references(() => reflectionSessions.id, { onDelete: "cascade" }),
    principleId: text("principle_id")
      .notNull()
      .references(() => principles.id),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.reflectionId, t.principleId] }),
  }),
);

export const reflectionRoleCalibrations = pgTable(
  "reflection_role_calibrations",
  {
    reflectionId: text("reflection_id")
      .notNull()
      .references(() => reflectionSessions.id, { onDelete: "cascade" }),
    roleId: text("role_id")
      .notNull()
      .references(() => consultingRoles.id),
    calibration: text("calibration", {
      enum: ["underused", "balanced", "overused"],
    }).notNull(),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.reflectionId, t.roleId] }),
  }),
);

export type User = typeof users.$inferSelect;
export type Principle = typeof principles.$inferSelect;
export type ConsultingRole = typeof consultingRoles.$inferSelect;
export type ReflectionSession = typeof reflectionSessions.$inferSelect;
export type PreparationSession = typeof preparationSessions.$inferSelect;

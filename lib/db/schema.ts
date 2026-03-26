import {
  integer,
  primaryKey,
  sqliteTable,
  text,
} from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name"),
  passwordHash: text("password_hash").notNull(),
});

export const principles = sqliteTable("principles", {
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

export const consultingRoles = sqliteTable("consulting_roles", {
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

export const preparationSessions = sqliteTable("preparation_sessions", {
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

export const preparationRoles = sqliteTable(
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

export const reflectionSessions = sqliteTable("reflection_sessions", {
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

export const reflectionPrinciples = sqliteTable(
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

export const reflectionRoleCalibrations = sqliteTable(
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

CREATE TABLE "consulting_roles" (
	"id" text PRIMARY KEY NOT NULL,
	"phase_key" text NOT NULL,
	"phase_label" text NOT NULL,
	"sort_order" integer NOT NULL,
	"card_code" text,
	"card_index" integer,
	"name" text NOT NULL,
	"description" text,
	"summary_line" text,
	"what_it_does" text,
	"useful_bullets" text,
	"risk_bullets" text,
	"image_path" text
);
--> statement-breakpoint
CREATE TABLE "preparation_roles" (
	"preparation_id" text NOT NULL,
	"role_id" text NOT NULL,
	"type" text NOT NULL,
	CONSTRAINT "preparation_roles_preparation_id_role_id_pk" PRIMARY KEY("preparation_id","role_id")
);
--> statement-breakpoint
CREATE TABLE "preparation_sessions" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"status" text DEFAULT 'draft' NOT NULL,
	"consultation_label" text,
	"occurred_at" text,
	"focus_note" text,
	"created_at" text NOT NULL,
	"updated_at" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "principles" (
	"id" text PRIMARY KEY NOT NULL,
	"sort_order" integer NOT NULL,
	"title" text NOT NULL,
	"summary" text NOT NULL,
	"image_path" text,
	"learning_tips" text DEFAULT '' NOT NULL,
	"field_stories" text DEFAULT '' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "reflection_principles" (
	"reflection_id" text NOT NULL,
	"principle_id" text NOT NULL,
	CONSTRAINT "reflection_principles_reflection_id_principle_id_pk" PRIMARY KEY("reflection_id","principle_id")
);
--> statement-breakpoint
CREATE TABLE "reflection_role_calibrations" (
	"reflection_id" text NOT NULL,
	"role_id" text NOT NULL,
	"calibration" text NOT NULL,
	CONSTRAINT "reflection_role_calibrations_reflection_id_role_id_pk" PRIMARY KEY("reflection_id","role_id")
);
--> statement-breakpoint
CREATE TABLE "reflection_sessions" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"status" text DEFAULT 'draft' NOT NULL,
	"preparation_id" text,
	"consultation_label" text,
	"occurred_at" text,
	"alignment_likert" text,
	"alignment_note" text,
	"learning_note" text,
	"created_at" text NOT NULL,
	"updated_at" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" text PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"name" text,
	"password_hash" text NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "preparation_roles" ADD CONSTRAINT "preparation_roles_preparation_id_preparation_sessions_id_fk" FOREIGN KEY ("preparation_id") REFERENCES "public"."preparation_sessions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "preparation_roles" ADD CONSTRAINT "preparation_roles_role_id_consulting_roles_id_fk" FOREIGN KEY ("role_id") REFERENCES "public"."consulting_roles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "preparation_sessions" ADD CONSTRAINT "preparation_sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reflection_principles" ADD CONSTRAINT "reflection_principles_reflection_id_reflection_sessions_id_fk" FOREIGN KEY ("reflection_id") REFERENCES "public"."reflection_sessions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reflection_principles" ADD CONSTRAINT "reflection_principles_principle_id_principles_id_fk" FOREIGN KEY ("principle_id") REFERENCES "public"."principles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reflection_role_calibrations" ADD CONSTRAINT "reflection_role_calibrations_reflection_id_reflection_sessions_id_fk" FOREIGN KEY ("reflection_id") REFERENCES "public"."reflection_sessions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reflection_role_calibrations" ADD CONSTRAINT "reflection_role_calibrations_role_id_consulting_roles_id_fk" FOREIGN KEY ("role_id") REFERENCES "public"."consulting_roles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reflection_sessions" ADD CONSTRAINT "reflection_sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reflection_sessions" ADD CONSTRAINT "reflection_sessions_preparation_id_preparation_sessions_id_fk" FOREIGN KEY ("preparation_id") REFERENCES "public"."preparation_sessions"("id") ON DELETE no action ON UPDATE no action;
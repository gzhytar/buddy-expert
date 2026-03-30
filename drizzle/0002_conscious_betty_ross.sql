CREATE TABLE "user_consulting_role_self_evals" (
	"user_id" text NOT NULL,
	"role_id" text NOT NULL,
	"sentiment" text NOT NULL,
	"updated_at" text NOT NULL,
	CONSTRAINT "user_consulting_role_self_evals_user_id_role_id_pk" PRIMARY KEY("user_id","role_id")
);
--> statement-breakpoint
ALTER TABLE "user_consulting_role_self_evals" ADD CONSTRAINT "user_consulting_role_self_evals_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_consulting_role_self_evals" ADD CONSTRAINT "user_consulting_role_self_evals_role_id_consulting_roles_id_fk" FOREIGN KEY ("role_id") REFERENCES "public"."consulting_roles"("id") ON DELETE cascade ON UPDATE no action;
CREATE TABLE `consulting_roles` (
	`id` text PRIMARY KEY NOT NULL,
	`phase_key` text NOT NULL,
	`phase_label` text NOT NULL,
	`sort_order` integer NOT NULL,
	`name` text NOT NULL,
	`description` text
);
--> statement-breakpoint
CREATE TABLE `principles` (
	`id` text PRIMARY KEY NOT NULL,
	`sort_order` integer NOT NULL,
	`title` text NOT NULL,
	`summary` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `reflection_principles` (
	`reflection_id` text NOT NULL,
	`principle_id` text NOT NULL,
	PRIMARY KEY(`reflection_id`, `principle_id`),
	FOREIGN KEY (`reflection_id`) REFERENCES `reflection_sessions`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`principle_id`) REFERENCES `principles`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `reflection_role_calibrations` (
	`reflection_id` text NOT NULL,
	`role_id` text NOT NULL,
	`calibration` text NOT NULL,
	PRIMARY KEY(`reflection_id`, `role_id`),
	FOREIGN KEY (`reflection_id`) REFERENCES `reflection_sessions`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`role_id`) REFERENCES `consulting_roles`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `reflection_sessions` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`status` text DEFAULT 'draft' NOT NULL,
	`consultation_label` text,
	`occurred_at` text,
	`alignment_likert` text,
	`alignment_note` text,
	`learning_note` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`name` text,
	`password_hash` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);
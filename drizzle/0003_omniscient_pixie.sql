CREATE TABLE `preparation_sessions` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`status` text DEFAULT 'draft' NOT NULL,
	`consultation_label` text,
	`occurred_at` text,
	`focus_note` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `preparation_roles` (
	`preparation_id` text NOT NULL,
	`role_id` text NOT NULL,
	`type` text NOT NULL,
	PRIMARY KEY(`preparation_id`, `role_id`),
	FOREIGN KEY (`preparation_id`) REFERENCES `preparation_sessions`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`role_id`) REFERENCES `consulting_roles`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
ALTER TABLE `reflection_sessions` ADD `preparation_id` text REFERENCES preparation_sessions(id);

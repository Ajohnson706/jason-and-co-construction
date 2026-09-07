CREATE TABLE `leads` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`phone` text NOT NULL,
	`location` text NOT NULL,
	`project_type` text NOT NULL,
	`timeline` text DEFAULT '' NOT NULL,
	`details` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);

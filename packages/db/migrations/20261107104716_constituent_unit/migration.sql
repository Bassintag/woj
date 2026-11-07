DELETE FROM `constituents`;--> statement-breakpoint
ALTER TABLE `constituents` ADD `unit_id` integer NOT NULL REFERENCES units(id);

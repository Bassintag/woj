CREATE TABLE `constituents` (
	`id` integer PRIMARY KEY AUTOINCREMENT,
	`quantity` real NOT NULL,
	`recipe_id` integer NOT NULL,
	`ingredient_id` integer NOT NULL,
	CONSTRAINT `fk_constituents_recipe_id_recipes_id_fk` FOREIGN KEY (`recipe_id`) REFERENCES `recipes`(`id`),
	CONSTRAINT `fk_constituents_ingredient_id_ingredients_id_fk` FOREIGN KEY (`ingredient_id`) REFERENCES `ingredients`(`id`)
);
--> statement-breakpoint
CREATE TABLE `conversions` (
	`id` integer PRIMARY KEY AUTOINCREMENT,
	`factor` real NOT NULL,
	`ingredient_id` integer NOT NULL,
	`unit_id` integer NOT NULL,
	CONSTRAINT `fk_conversions_ingredient_id_ingredients_id_fk` FOREIGN KEY (`ingredient_id`) REFERENCES `ingredients`(`id`),
	CONSTRAINT `fk_conversions_unit_id_units_id_fk` FOREIGN KEY (`unit_id`) REFERENCES `units`(`id`)
);
--> statement-breakpoint
CREATE TABLE `ingredients` (
	`id` integer PRIMARY KEY AUTOINCREMENT,
	`title` text NOT NULL UNIQUE,
	`image_url` text,
	`calories` integer NOT NULL,
	`default_unit_id` integer NOT NULL,
	CONSTRAINT `fk_ingredients_default_unit_id_units_id_fk` FOREIGN KEY (`default_unit_id`) REFERENCES `units`(`id`)
);
--> statement-breakpoint
CREATE TABLE `meals` (
	`id` integer PRIMARY KEY AUTOINCREMENT,
	`order` integer NOT NULL,
	`quantity` integer NOT NULL,
	`menu_id` integer NOT NULL,
	`recipe_id` integer NOT NULL,
	CONSTRAINT `fk_meals_menu_id_menus_id_fk` FOREIGN KEY (`menu_id`) REFERENCES `menus`(`id`),
	CONSTRAINT `fk_meals_recipe_id_recipes_id_fk` FOREIGN KEY (`recipe_id`) REFERENCES `recipes`(`id`)
);
--> statement-breakpoint
CREATE TABLE `menus` (
	`id` integer PRIMARY KEY AUTOINCREMENT,
	`title` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `recipes` (
	`id` integer PRIMARY KEY AUTOINCREMENT,
	`title` text NOT NULL UNIQUE,
	`image_url` text,
	`baking_time` integer,
	`cooking_time` integer,
	`calories` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `recipesToTags` (
	`recipe_id` integer NOT NULL,
	`tag_id` integer NOT NULL,
	CONSTRAINT `recipesToTags_pk` PRIMARY KEY(`recipe_id`, `tag_id`),
	CONSTRAINT `fk_recipesToTags_recipe_id_recipes_id_fk` FOREIGN KEY (`recipe_id`) REFERENCES `recipes`(`id`),
	CONSTRAINT `fk_recipesToTags_tag_id_tags_id_fk` FOREIGN KEY (`tag_id`) REFERENCES `tags`(`id`)
);
--> statement-breakpoint
CREATE TABLE `steps` (
	`id` integer PRIMARY KEY AUTOINCREMENT,
	`order` integer NOT NULL,
	`description` text NOT NULL,
	`recipe_id` integer NOT NULL,
	CONSTRAINT `fk_steps_recipe_id_recipes_id_fk` FOREIGN KEY (`recipe_id`) REFERENCES `recipes`(`id`)
);
--> statement-breakpoint
CREATE TABLE `symbols` (
	`id` integer PRIMARY KEY AUTOINCREMENT,
	`title` text NOT NULL,
	`digits` integer NOT NULL,
	`factor` real NOT NULL,
	`min` real,
	`max` real,
	`unit_id` integer NOT NULL,
	CONSTRAINT `fk_symbols_unit_id_units_id_fk` FOREIGN KEY (`unit_id`) REFERENCES `units`(`id`)
);
--> statement-breakpoint
CREATE TABLE `tags` (
	`id` integer PRIMARY KEY AUTOINCREMENT,
	`title` text NOT NULL UNIQUE,
	`color` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `units` (
	`id` integer PRIMARY KEY AUTOINCREMENT,
	`title` text NOT NULL UNIQUE
);
--> statement-breakpoint
CREATE UNIQUE INDEX `recipe_ingredient_idx` ON `constituents` (`recipe_id`,`ingredient_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `ingredient_unit_idx` ON `conversions` (`ingredient_id`,`unit_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `menu_recipe_idx` ON `meals` (`menu_id`,`recipe_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `recipe_order_idx` ON `steps` (`recipe_id`,`order`);--> statement-breakpoint
CREATE UNIQUE INDEX `title_unit_idx` ON `symbols` (`title`,`unit_id`);
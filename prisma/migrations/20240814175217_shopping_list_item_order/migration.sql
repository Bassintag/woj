/*
  Warnings:

  - Added the required column `order` to the `ShoppingItem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ShoppingItem" ADD COLUMN     "order" SMALLINT NOT NULL;

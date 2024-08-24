/*
  Warnings:

  - You are about to drop the `ShoppingItem` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ShoppingList` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_RecipeToShoppingList` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ShoppingItem" DROP CONSTRAINT "ShoppingItem_ingredientId_fkey";

-- DropForeignKey
ALTER TABLE "ShoppingItem" DROP CONSTRAINT "ShoppingItem_shoppingListId_fkey";

-- DropForeignKey
ALTER TABLE "_RecipeToShoppingList" DROP CONSTRAINT "_RecipeToShoppingList_A_fkey";

-- DropForeignKey
ALTER TABLE "_RecipeToShoppingList" DROP CONSTRAINT "_RecipeToShoppingList_B_fkey";

-- DropTable
DROP TABLE "ShoppingItem";

-- DropTable
DROP TABLE "ShoppingList";

-- DropTable
DROP TABLE "_RecipeToShoppingList";

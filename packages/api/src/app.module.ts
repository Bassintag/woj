import { Module } from '@nestjs/common';
import { RecipeModule } from './modules/recipe/recipe.module';
import { ConfigModule } from '@nestjs/config';
import { ShoppingListModule } from './modules/shopping-list/shopping-list.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    RecipeModule,
    ShoppingListModule,
  ],
})
export class AppModule {}

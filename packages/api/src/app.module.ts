import { Module } from '@nestjs/common';
import { RecipeModule } from './modules/recipe/recipe.module';
import { ConfigModule } from '@nestjs/config';
import { MenuModule } from './modules/menu/menu.module';
import { TagModule } from './modules/tag/tag.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MenuModule,
    RecipeModule,
    TagModule,
  ],
})
export class AppModule {}

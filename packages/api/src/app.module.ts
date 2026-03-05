import { Module } from '@nestjs/common';
import { RecipeModule } from './modules/recipe/recipe.module';
import { ConfigModule } from '@nestjs/config';
import { MenuModule } from './modules/menu/menu.module';
import { TagModule } from './modules/tag/tag.module';
import { ActionModule } from './modules/action/action.module';
import { APP_PIPE } from '@nestjs/core';
import { ZodValidationPipe } from 'nestjs-zod';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '../../.env'],
    }),
    ActionModule,
    MenuModule,
    RecipeModule,
    TagModule,
  ],
})
export class AppModule {}

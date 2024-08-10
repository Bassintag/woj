import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { RecipeService } from './recipe.service';
import { RecipeController } from './recipe.controller';

@Module({
  imports: [PrismaModule],
  providers: [RecipeService],
  controllers: [RecipeController],
})
export class RecipeModule {}

import { Module } from '@nestjs/common';
import { ShoppingListService } from './shopping-list.service';
import { PrismaModule } from '../prisma/prisma.module';
import { ShoppingListController } from './shopping-list.controller';

@Module({
  imports: [PrismaModule],
  providers: [ShoppingListService],
  controllers: [ShoppingListController],
})
export class ShoppingListModule {}

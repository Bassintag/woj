import { Module } from '@nestjs/common';
import { ActionController } from './action.controller';
import { ActionService } from './action.service';
import { JowModule } from './modules/jow/jow.module';
import { PrismaModule } from '../prisma/prisma.module';
import { JowService } from './modules/jow/jow.service';
import { SOURCE_ADAPTERS } from './action.const';

@Module({
  imports: [PrismaModule, JowModule],
  providers: [
    {
      provide: SOURCE_ADAPTERS,
      useFactory: (...args) => args,
      inject: [JowService],
    },
    ActionService,
  ],
  controllers: [ActionController],
})
export class ActionModule {}

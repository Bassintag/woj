import { Module } from '@nestjs/common';
import { JowService } from './jow.service';
import { JowClient } from './jow.client';

@Module({
  providers: [JowClient, JowService],
  exports: [JowService],
})
export class JowModule {}

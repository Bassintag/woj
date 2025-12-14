import { PrismaClient } from '@prisma/client';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import { ConfigService } from '@nestjs/config';
import { AppConfig } from 'src/interfaces/app-config.interface';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor(config: ConfigService<AppConfig>) {
    super({
      adapter: new PrismaBetterSqlite3({
        url: config.getOrThrow('DATABASE_URL'),
      }),
    });
  }
  async onModuleInit() {
    await this.$connect();
  }
}
